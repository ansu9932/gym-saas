import fs from "fs/promises";
import path from "path";
import dayjs from "dayjs";
import { MembershipPlan } from "../models/MembershipPlan.js";
import { Member } from "../models/Member.js";
import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  buildMemberStatus,
  buildRenewedDates,
  buildStatusQuery,
  calculateEndDate
} from "../utils/membership.js";
import { buildMembersCsv } from "../utils/csv.js";

const uploadsRoot = path.resolve(process.cwd(), "uploads");

const removeFileIfExists = async (fileUrl) => {
  if (!fileUrl) {
    return;
  }

  const relativePath = fileUrl.replace(/^\/uploads\//, "");
  const target = path.join(uploadsRoot, relativePath);

  try {
    await fs.unlink(target);
  } catch (_error) {
    // Deleting a missing file should not block member updates.
  }
};

const mapMemberResponse = (member) => {
  const { status, daysLeft } = buildMemberStatus(member);
  const raw = member.toObject ? member.toObject() : member;

  return {
    ...raw,
    status,
    daysLeft
  };
};

const resolvePlan = async (gymId, planId) => {
  const plan = await MembershipPlan.findOne({
    _id: planId,
    gym: gymId
  });

  if (!plan) {
    throw new Error("Selected plan was not found");
  }

  return plan;
};

export const listMembers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 10), 200);
  const search = req.query.search?.trim();
  const status = req.query.status;
  const paymentStatus = req.query.paymentStatus;
  const plan = req.query.plan;

  const query = {
    gym: req.user.gym._id,
    ...(paymentStatus && paymentStatus !== "all"
      ? { paymentStatus }
      : {}),
    ...(plan && plan !== "all" ? { membershipPlan: plan } : {}),
    ...(status && status !== "all" ? buildStatusQuery(status) : {})
  };

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { phoneNumber: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const [members, total] = await Promise.all([
    Member.find(query)
      .populate("membershipPlan")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Member.countDocuments(query)
  ]);

  res.json({
    items: members.map(mapMemberResponse),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    }
  });
});

export const getMember = asyncHandler(async (req, res) => {
  const member = await Member.findOne({
    _id: req.params.id,
    gym: req.user.gym._id
  }).populate("membershipPlan");

  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }

  res.json(mapMemberResponse(member));
});

export const createMember = asyncHandler(async (req, res) => {
  const {
    fullName,
    phoneNumber,
    email,
    membershipPlan,
    startDate,
    endDate,
    paymentStatus = "paid",
    amountPaid,
    notes
  } = req.body;

  if (!fullName || !phoneNumber || !membershipPlan || !startDate) {
    res.status(400);
    throw new Error("Name, phone number, plan, and start date are required");
  }

  const plan = await resolvePlan(req.user.gym._id, membershipPlan);
  const derivedEndDate = endDate
    ? new Date(endDate)
    : calculateEndDate({
        startDate: new Date(startDate),
        durationDays: plan.durationDays
      });

  const member = await Member.create({
    gym: req.user.gym._id,
    fullName,
    phoneNumber,
    email,
    membershipPlan: plan._id,
    planName: plan.name,
    startDate: new Date(startDate),
    endDate: derivedEndDate,
    paymentStatus,
    price: plan.price,
    amountPaid: amountPaid !== undefined ? Number(amountPaid) : plan.price,
    notes,
    profilePhotoUrl: req.file ? `/uploads/members/${req.file.filename}` : null
  });

  member.qrCodeValue = `gym:${req.user.gym._id}:member:${member._id}`;
  await member.save();

  await Notification.create({
    gym: req.user.gym._id,
    member: member._id,
    type: "member-created",
    title: `${member.fullName} added`,
    message: `${member.fullName} joined the ${member.planName} plan.`,
    metadata: {
      startDate: member.startDate,
      endDate: member.endDate
    }
  });

  await member.populate("membershipPlan");
  res.status(201).json(mapMemberResponse(member));
});

export const updateMember = asyncHandler(async (req, res) => {
  const member = await Member.findOne({
    _id: req.params.id,
    gym: req.user.gym._id
  });

  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }

  if (req.body.membershipPlan && req.body.membershipPlan !== member.membershipPlan.toString()) {
    const plan = await resolvePlan(req.user.gym._id, req.body.membershipPlan);
    member.membershipPlan = plan._id;
    member.planName = plan.name;
    member.price = plan.price;

    if (!req.body.endDate) {
      member.endDate = calculateEndDate({
        startDate: req.body.startDate ? new Date(req.body.startDate) : member.startDate,
        durationDays: plan.durationDays
      });
    }
  }

  if (req.file) {
    await removeFileIfExists(member.profilePhotoUrl);
    member.profilePhotoUrl = `/uploads/members/${req.file.filename}`;
  }

  member.fullName = req.body.fullName ?? member.fullName;
  member.phoneNumber = req.body.phoneNumber ?? member.phoneNumber;
  member.email = req.body.email ?? member.email;
  member.startDate = req.body.startDate ? new Date(req.body.startDate) : member.startDate;
  member.endDate = req.body.endDate ? new Date(req.body.endDate) : member.endDate;
  member.paymentStatus = req.body.paymentStatus ?? member.paymentStatus;
  member.amountPaid =
    req.body.amountPaid !== undefined ? Number(req.body.amountPaid) : member.amountPaid;
  member.notes = req.body.notes ?? member.notes;

  await member.save();
  await member.populate("membershipPlan");

  res.json(mapMemberResponse(member));
});

export const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findOne({
    _id: req.params.id,
    gym: req.user.gym._id
  });

  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }

  await removeFileIfExists(member.profilePhotoUrl);
  await member.deleteOne();

  res.status(204).send();
});

export const renewMember = asyncHandler(async (req, res) => {
  const member = await Member.findOne({
    _id: req.params.id,
    gym: req.user.gym._id
  }).populate("membershipPlan");

  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }

  let plan = member.membershipPlan;

  if (req.body.membershipPlan) {
    plan = await resolvePlan(req.user.gym._id, req.body.membershipPlan);
  }

  member.renewalHistory.push({
    membershipPlan: member.membershipPlan?._id || plan._id,
    planName: member.planName,
    startDate: member.startDate,
    endDate: member.endDate,
    amountPaid: member.amountPaid,
    paymentStatus: member.paymentStatus,
    renewedAt: new Date()
  });

  const renewedDates = buildRenewedDates({
    currentEndDate: member.endDate,
    durationDays: Number(req.body.durationDays || plan.durationDays)
  });

  member.membershipPlan = plan._id;
  member.planName = plan.name;
  member.price = plan.price;
  member.startDate = renewedDates.startDate;
  member.endDate = renewedDates.endDate;
  member.paymentStatus = req.body.paymentStatus || "paid";
  member.amountPaid =
    req.body.amountPaid !== undefined ? Number(req.body.amountPaid) : plan.price;
  member.reminders = {
    threeDaySentAt: null,
    expiryDaySentAt: null
  };

  await member.save();
  await member.populate("membershipPlan");

  await Notification.create({
    gym: req.user.gym._id,
    member: member._id,
    type: "member-renewed",
    title: `${member.fullName} renewed`,
    message: `${member.fullName}'s membership has been extended to ${dayjs(member.endDate).format("DD MMM YYYY")}.`,
    metadata: {
      endDate: member.endDate,
      planName: member.planName
    }
  });

  res.json(mapMemberResponse(member));
});

export const exportMembersCsv = asyncHandler(async (req, res) => {
  const members = await Member.find({
    gym: req.user.gym._id
  })
    .populate("membershipPlan")
    .sort({ fullName: 1 });

  const csv = buildMembersCsv(members);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="members-${req.user.gym.slug}.csv"`
  );
  res.send(csv);
});
