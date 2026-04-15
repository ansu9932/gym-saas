import QRCode from "qrcode";
import { Attendance } from "../models/Attendance.js";
import { Member } from "../models/Member.js";
import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildMemberStatus } from "../utils/membership.js";

export const getMemberQrCode = asyncHandler(async (req, res) => {
  const member = await Member.findOne({
    _id: req.params.memberId,
    gym: req.user.gym._id
  });

  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }

  const qrDataUrl = await QRCode.toDataURL(member.qrCodeValue, {
    color: {
      dark: "#ff5b3b",
      light: "#0a0a0a"
    },
    margin: 1,
    width: 320
  });

  res.json({
    memberId: member._id,
    qrCodeValue: member.qrCodeValue,
    qrDataUrl
  });
});

export const checkInMember = asyncHandler(async (req, res) => {
  const query = req.body.memberId
    ? { _id: req.body.memberId, gym: req.user.gym._id }
    : { qrCodeValue: req.body.qrCodeValue, gym: req.user.gym._id };

  const member = await Member.findOne(query).populate("membershipPlan");

  if (!member) {
    res.status(404);
    throw new Error("Member not found for this gym");
  }

  const attendance = await Attendance.create({
    gym: req.user.gym._id,
    member: member._id,
    source: req.body.memberId ? "manual" : "qr"
  });

  await Notification.create({
    gym: req.user.gym._id,
    member: member._id,
    type: "attendance",
    title: `${member.fullName} checked in`,
    message: `${member.fullName} checked in successfully.`,
    metadata: {
      checkedInAt: attendance.checkedInAt
    }
  });

  res.status(201).json({
    attendance,
    member: {
      ...member.toObject(),
      ...buildMemberStatus(member)
    }
  });
});

export const listAttendance = asyncHandler(async (req, res) => {
  const records = await Attendance.find({
    gym: req.user.gym._id
  })
    .populate("member", "fullName phoneNumber profilePhotoUrl")
    .sort({ checkedInAt: -1 })
    .limit(50);

  res.json(records);
});
