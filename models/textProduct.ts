import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    unique: true,
    trim: true,
    maxLength: [40, "Title cannot be more then 40 characters"],
  },
  description: {
    type: String,
    required: true,
    maxLength: [200, "Title cannot be more then 200 characters"],
  },
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
