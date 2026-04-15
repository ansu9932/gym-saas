import mongoose from "mongoose";
import { PAYMENT_STATUSES } from "../constants/roles.js";

const renewalHistorySchema = new mongoose.Schema(
  {
    membershipPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan"
    },
    planName: String,
    startDate: Date,
    endDate: Date,
    amountPaid: Number,
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES
    },
    renewedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false
  }
);

const memberSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
      index: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    membershipPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: true
    },
    planName: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true,
      index: true
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "paid"
    },
    price: {
      type: Number,
      default: 0
    },
    amountPaid: {
      type: Number,
      default: 0
    },
    profilePhotoUrl: String,
    qrCodeValue: {
      type: String,
      index: true
    },
    notes: String,
    reminders: {
      threeDaySentAt: Date,
      expiryDaySentAt: Date
    },
    renewalHistory: [renewalHistorySchema]
  },
  {
    timestamps: true
  }
);

memberSchema.index({ gym: 1, fullName: 1 });
memberSchema.index({ gym: 1, phoneNumber: 1 });
memberSchema.index({ gym: 1, paymentStatus: 1 });

export const Member = mongoose.model("Member", memberSchema);
