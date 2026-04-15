import { MembershipPlan } from "../models/MembershipPlan.js";
import { Member } from "../models/Member.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listPlans = asyncHandler(async (req, res) => {
  const plans = await MembershipPlan.find({
    gym: req.user.gym._id
  }).sort({ price: 1, durationDays: 1 });

  res.json(plans);
});

export const createPlan = asyncHandler(async (req, res) => {
  const { name, billingCycle, durationDays, price, description } = req.body;

  if (!name || !billingCycle || !durationDays || price === undefined) {
    res.status(400);
    throw new Error("Name, billing cycle, duration days, and price are required");
  }

  const plan = await MembershipPlan.create({
    gym: req.user.gym._id,
    name,
    billingCycle,
    durationDays: Number(durationDays),
    price: Number(price),
    description
  });

  res.status(201).json(plan);
});

export const updatePlan = asyncHandler(async (req, res) => {
  const plan = await MembershipPlan.findOne({
    _id: req.params.id,
    gym: req.user.gym._id
  });

  if (!plan) {
    res.status(404);
    throw new Error("Plan not found");
  }

  Object.assign(plan, {
    name: req.body.name ?? plan.name,
    billingCycle: req.body.billingCycle ?? plan.billingCycle,
    durationDays: req.body.durationDays
      ? Number(req.body.durationDays)
      : plan.durationDays,
    price: req.body.price !== undefined ? Number(req.body.price) : plan.price,
    description: req.body.description ?? plan.description,
    isActive:
      typeof req.body.isActive === "boolean" ? req.body.isActive : plan.isActive
  });

  await plan.save();
  res.json(plan);
});

export const deletePlan = asyncHandler(async (req, res) => {
  const activeMembers = await Member.exists({
    gym: req.user.gym._id,
    membershipPlan: req.params.id
  });

  if (activeMembers) {
    res.status(400);
    throw new Error("You cannot delete a plan assigned to members");
  }

  const deleted = await MembershipPlan.findOneAndDelete({
    _id: req.params.id,
    gym: req.user.gym._id
  });

  if (!deleted) {
    res.status(404);
    throw new Error("Plan not found");
  }

  res.status(204).send();
});
