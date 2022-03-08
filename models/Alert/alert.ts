import mongoose from "mongoose";
import type {AlertProps} from "./alert.model";
const ObjectId = mongoose.Schema.Types.ObjectId;

const AlertSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    // companyId: {
    //   type: ObjectId,
    //   ref: "Companys",
    //   required: false,
    //   default: null,
    // },
    type: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
      default: null,
    },
    color: {
      type: String,
      trim: true,
      uppercase: true,
      required: false,
      default: "PRIMARY",
    },
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
    // reserwationId: {
    //   type: ObjectId,
    //   ref: "Reserwations",
    //   required: false,
    //   default: null,
    // },
    // serviceId: {
    //   type: ObjectId,
    //   ref: "Services",
    //   required: false,
    //   default: null,
    // },
    // commutingId: {
    //   type: ObjectId,
    //   ref: "Commutings",
    //   required: false,
    //   default: null,
    // },
  },
  {
    timestamps: true,
  }
);

const Alert =
  (mongoose.models.Alert as mongoose.Model<AlertProps, {}, {}, {}>) ||
  mongoose.model<AlertProps>("Alert", AlertSchema);

export default Alert;
