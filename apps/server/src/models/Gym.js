import mongoose from "mongoose";

const gymSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    themePreference: {
      type: String,
      enum: ["dark", "light", "system"],
      default: "dark"
    },
    settings: {
      reminders: {
        email: {
          type: Boolean,
          default: true
        },
        whatsapp: {
          type: Boolean,
          default: false
        }
      }
    }
  },
  {
    timestamps: true
  }
);

export const Gym = mongoose.model("Gym", gymSchema);
