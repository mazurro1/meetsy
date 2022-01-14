import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
    // required: [false, "Password is required"],
    // minlength: [5, "Surname cannot be less then 5 characters"],
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
