import mongoose from "mongoose";
import type {ProductProps} from "./payment.model";

const ProductSchema = new mongoose.Schema(
  {
    // promotionId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Promotion",
    //   required: true,
    // },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    expiresAt: {
      type: Number,
      required: true,
      default: null,
    },
    stripePaymentId: {
      type: String,
      trim: true,
      required: true,
      default: null,
    },
    stripePaymenteUrl: {
      type: String,
      trim: true,
      required: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  (mongoose.models.Product as mongoose.Model<ProductProps, {}, {}, {}>) ||
  mongoose.model<ProductProps>("Product", ProductSchema);

export default Product;
