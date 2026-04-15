import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
      index: true
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },
    source: {
      type: String,
      enum: ["qr", "manual"],
      default: "qr"
    },
    checkedInAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

attendanceSchema.index({ gym: 1, member: 1, checkedInAt: -1 });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
