import mongoose from "mongoose";
import type {PaymentProps} from "./payment.model";

const PaymentSchema = new mongoose.Schema(
  {
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: false,
    },
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
    stripeCheckoutId: {
      type: String,
      required: true,
      default: null,
    },
    stripeCheckoutUrl: {
      type: String,
      required: false,
      default: null,
    },
    status: {
      type: String,
      required: true,
      default: "unpaid",
    },
    invoice: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Payment =
  (mongoose.models.Payment as mongoose.Model<PaymentProps, {}, {}, {}>) ||
  mongoose.model<PaymentProps>("Payment", PaymentSchema);

export default Payment;
