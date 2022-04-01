import mongoose from "mongoose";
import type {CompanyWorkerProps} from "./companyWorker.model";

const CompanyWorkerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    permissions: [
      {
        type: Number,
        trim: true,
        required: false,
        default: 0,
      },
    ],
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
    specialization: {
      type: String,
      trim: true,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CompanyWorker =
  (mongoose.models.CompanyWorker as mongoose.Model<
    CompanyWorkerProps,
    {},
    {},
    {}
  >) ||
  mongoose.model<CompanyWorkerProps>("CompanyWorker", CompanyWorkerSchema);

export default CompanyWorker;
