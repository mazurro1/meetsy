import mongoose from "mongoose";
import type {ProductProps} from "./product.model";

const ProductSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      default: "payment",
    },
    price: {
      type: Number,
      required: true,
      default: null,
    },
    promotionPrice: {
      type: Number,
      required: true,
      default: null,
    },
    platformPointsCount: {
      type: Number,
      required: true,
      default: null,
    },
    platformSubscriptionMonthsCount: {
      type: Number,
      required: true,
      default: null,
    },
    platformSMSCount: {
      type: Number,
      required: true,
      default: null,
    },
    stripePriceId: {
      type: String,
      required: false,
      default: null,
    },
    // expiresAt: {
    //   type: Number,
    //   required: true,
    //   default: null,
    // },
    // paymentId: {
    //   type: String,
    //   trim: true,
    //   required: true,
    //   default: null,
    // },
    // paymentUrl: {
    //   type: String,
    //   trim: true,
    //   required: true,
    //   default: null,
    // },
  },
  {
    timestamps: true,
  }
);

const Product =
  (mongoose.models.Product as mongoose.Model<ProductProps, {}, {}, {}>) ||
  mongoose.model<ProductProps>("Product", ProductSchema);

export default Product;
