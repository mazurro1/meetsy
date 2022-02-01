import mongoose from "mongoose";
import { LanguagesProps } from "@Texts";

interface UserDetailsProps {
  name?: string;
  surname?: string;
  language: LanguagesProps;
  avatarUrl: string;
  hasPassword: boolean;
  emailIsConfirmed: boolean;
}

interface UserPhoneProps {
  number?: number;
  regionalCode?: string;
  has: boolean;
  isConfirmed: boolean;
}

export interface UserEndpointKeysProps {
  p256dh: string | null;
  auth: string | null;
}

interface UserPushEndpointProps {
  endpoint: string | null;
  expirationTime: string | null;
  keys: UserEndpointKeysProps;
}

export interface IUserPropsClient {
  _id: mongoose.Types.ObjectId;
  email: string;
  userDetails: UserDetailsProps;
  phoneDetails: UserPhoneProps;
}

export interface IUserProps {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  userDetails: UserDetailsProps;
  phoneDetails: UserPhoneProps;
  pushEndpoint: UserPushEndpointProps;
}

type UserType = IUserProps;

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
        type: String,
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
      },
      expirationTime: {
        type: String,
        required: false,
      },
      keys: {
        p256dh: {
          type: String,
          required: false,
        },
        auth: {
          type: String,
          required: false,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const User =
  (mongoose.models.User as mongoose.Model<UserType, {}, {}, {}>) ||
  mongoose.model<UserType>("User", UserSchema);

export default User;
