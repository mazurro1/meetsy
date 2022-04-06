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
    recoverCode: {
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
      default: null,
    },
    consents: [
      {
        type: Number,
        trim: true,
        required: false,
        default: 0,
      },
    ],
    userDetails: {
      name: {
        type: String,
        trim: true,
        lowercase: true,
        required: false,
        default: null,
      },
      surname: {
        type: String,
        trim: true,
        lowercase: true,
        required: false,
        default: null,
      },
      language: {
        type: String,
        trim: true,
        lowercase: true,
        enum: ["pl", "en"],
        required: [true, "Language is required"],
        default: "pl",
      },
      avatarUrl: {
        type: String,
        trim: true,
        lowercase: false,
        required: false,
        default: null,
      },
      hasPassword: {
        type: Boolean,
        require: [true, "hasPassword is required"],
        default: false,
      },
      emailIsConfirmed: {
        type: Boolean,
        required: [true, "EmailIsConfirmed is required"],
        default: false,
      },
      toConfirmEmail: {
        type: String,
        trim: true,
        lowercase: true,
        required: false,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please fill a valid email address",
        ],
      },
    },

    phoneDetails: {
      number: {
        type: Number,
        trim: true,
        required: false,
        default: null,
      },
      regionalCode: {
        type: Number,
        trim: true,
        required: false,
        default: null,
      },
      toConfirmNumber: {
        type: Number,
        trim: true,
        required: false,
        default: null,
      },
      toConfirmRegionalCode: {
        type: Number,
        trim: true,
        required: false,
        default: null,
      },
      has: {
        type: Boolean,
        required: true,
        default: false,
      },
      isConfirmed: {
        type: Boolean,
        required: true,
        default: false,
      },
      code: {
        type: String,
        trim: true,
        required: false,
        default: null,
      },
      dateSendAgainSMS: {
        type: Date,
        trim: true,
        required: false,
        default: null,
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
