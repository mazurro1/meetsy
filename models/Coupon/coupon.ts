import mongoose from "mongoose";
import type {CouponProps} from "./coupon.model";
const ObjectId = mongoose.Schema.Types.ObjectId;

const CouponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: null,
      uppercase: true,
    },
    products: [
      {
        type: ObjectId,
        ref: "Product",
        required: false,
        default: null,
      },
    ],
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    limit: {
      type: Number,
      required: true,
      default: 0,
    },
    isAcitve: {
      type: Boolean,
      required: false,
      default: false,
    },
    isArchived: {
      type: Boolean,
      required: false,
      default: false,
    },
    dateEnd: {
      type: Date,
      required: false,
      default: null,
    },
    couponStripeId: {
      type: String,
      required: false,
      default: null,
    },
    promotionCodeStripeId: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon =
  (mongoose.models.Coupon as mongoose.Model<CouponProps, {}, {}, {}>) ||
  mongoose.model<CouponProps>("Coupon", CouponSchema);

export default Coupon;
