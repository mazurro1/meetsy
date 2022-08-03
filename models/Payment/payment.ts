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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Number,
      required: false,
      default: null,
    },
    stripeCheckoutId: {
      type: String,
      required: false,
      default: null,
    },
    stripeCheckoutUrl: {
      type: String,
      required: false,
      default: null,
    },
    stripePaymentIntentId: {
      type: String,
      required: false,
      default: null,
    },
    stripeSubscriptionId: {
      type: String,
      required: false,
      default: null,
    },
    stripeLinkInvoice: [
      {
        url: {
          type: String,
          required: false,
          default: null,
        },
        date: {
          type: Date,
          required: false,
          default: null,
        },
      },
    ],
    status: [
      {
        value: {
          type: String,
          required: false,
          default: null,
        },
        date: {
          type: Date,
          required: false,
          default: null,
        },
      },
    ],
    isCanceled: {
      type: Boolean,
      required: false,
      default: false,
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
