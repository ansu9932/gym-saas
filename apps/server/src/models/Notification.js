import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
      index: true
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member"
    },
    type: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    },
    readAt: Date
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ gym: 1, readAt: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
