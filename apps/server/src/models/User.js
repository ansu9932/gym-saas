import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { USER_ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.STAFF
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLoginAt: Date
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function handlePasswordHash(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(value) {
  return bcrypt.compare(value, this.password);
};

export const User = mongoose.model("User", userSchema);
