import mongoose from "mongoose";
import { BILLING_CYCLES } from "../constants/roles.js";

const membershipPlanSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    billingCycle: {
      type: String,
      enum: BILLING_CYCLES,
      required: true
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

membershipPlanSchema.index({ gym: 1, name: 1 }, { unique: true });

export const MembershipPlan = mongoose.model(
  "MembershipPlan",
  membershipPlanSchema
);
