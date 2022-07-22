import mongoose from "mongoose";
import type {ProductProps} from "./product.model";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      default: null,
    },
    description: {
      type: String,
      required: false,
      default: null,
    },
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
    promotion: {
      type: Boolean,
      required: true,
      default: false,
    },
    reneving: {
      type: Number,
      required: false,
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
    stripeProductId: {
      type: String,
      required: false,
      default: null,
    },
    isAcitve: {
      type: Boolean,
      required: false,
      default: false,
    },
    dateStart: {
      type: Date,
      required: true,
      default: null,
    },
    dateEnd: {
      type: Date,
      required: false,
      default: null,
    },
    isArchived: {
      type: Boolean,
      required: false,
      default: false,
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
