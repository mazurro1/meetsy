import mongoose from "mongoose";
import type {UserProps} from "./user.model";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, "Email address is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    emailCode: {
      type: String,
      trim: true,
      uppercase: true,
      required: false,
      default: null,
    },
    password: {
      type: String,
      trim: true,
      required: false,
    },
    userDetails: {
      name: {
        type: String,
        trim: true,
        lowercase: true,
        required: false,
      },
      surname: {
        type: String,
        trim: true,
        lowercase: true,
        required: false,
      },
      language: {
        type: String,
        trim: true,
        lowercase: true,
        enum: ["pl", "en"],
        required: [true, "Language is required"],
      },
      avatarUrl: {
        type: String,
        trim: true,
        lowercase: true,
        required: false,
      },
      hasPassword: {
        type: Boolean,
        require: [true, "hasPassword is required"],
      },
      emailIsConfirmed: {
        type: Boolean,
        required: [true, "EmailIsConfirmed is required"],
      },
    },

    phoneDetails: {
      number: {
        type: Number,
        trim: true,
        required: false,
      },
      regionalCode: {
        type: Number,
        trim: true,
        required: false,
      },
      has: {
        type: Boolean,
        required: true,
      },
      isConfirmed: {
        type: Boolean,
        required: true,
      },
    },
    pushEndpoint: {
      endpoint: {
        type: String,
        required: false,
        default: null,
      },
      expirationTime: {
        type: String,
        required: false,
        default: null,
      },
      keys: {
        p256dh: {
          type: String,
          required: false,
          default: null,
        },
        auth: {
          type: String,
          required: false,
          default: null,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const User =
  (mongoose.models.User as mongoose.Model<UserProps, {}, {}, {}>) ||
  mongoose.model<UserProps>("User", UserSchema);

export default User;
