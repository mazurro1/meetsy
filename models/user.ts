import mongoose from "mongoose";

export interface IUserProps extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  surname: string;
  password?: string;
  isNewFromSocial: boolean;
  language: string;
  avatarUrl?: string;
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
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Name is required"],
      maxLength: [200, "Name cannot be more then 200 characters"],
    },
    surname: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Surname is required"],
      maxLength: [200, "Surname cannot be more then 200 characters"],
    },
    password: {
      type: String,
      trim: true,
      required: false,
    },
    isNewFromSocial: {
      type: Boolean,
      require: [true, "isNewFromSocial is required"],
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
  },
  {
    timestamps: true,
  }
);

const User =
  (mongoose.models.User as mongoose.Model<UserType, {}, {}, {}>) ||
  mongoose.model<UserType>("User", UserSchema);

export default User;
