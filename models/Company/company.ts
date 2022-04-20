import mongoose from "mongoose";
import type {CompanyProps} from "./company.model";

const CompanySchema = new mongoose.Schema(
  {
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
    emailCode: {
      type: String,
      trim: true,
      uppercase: true,
      required: false,
      default: null,
    },
    companyDetails: {
      name: {
        type: String,
        trim: true,
        lowercase: true,
        required: false,
        default: null,
        unique: true,
      },
      nip: {
        type: Number,
        required: false,
        default: null,
      },
      avatarUrl: {
        type: String,
        trim: true,
        lowercase: false,
        required: false,
        default: null,
      },
      images: [
        {
          type: String,
          trim: true,
          lowercase: false,
          required: false,
          default: null,
        },
      ],
      emailIsConfirmed: {
        type: Boolean,
        required: [true, "EmailIsConfirmed is required"],
        default: false,
      },
      toConfirmEmail: {
        type: String,
        trim: true,
        lowercase: true,
        required: false,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please fill a valid email address",
        ],
      },
    },
    companyContact: {
      postalCode: {
        type: Number,
        required: true,
        default: null,
      },
      city: {
        placeholder: {
          type: String,
          trim: true,
          lowercase: true,
          required: true,
          default: null,
        },
        value: {
          type: String,
          trim: true,
          lowercase: true,
          required: true,
          default: null,
        },
      },
      district: {
        placeholder: {
          type: String,
          trim: true,
          lowercase: true,
          required: true,
          default: null,
        },
        value: {
          type: String,
          trim: true,
          lowercase: true,
          required: true,
          default: null,
        },
      },
      street: {
        placeholder: {
          type: String,
          trim: true,
          lowercase: true,
          required: true,
          default: null,
        },
        value: {
          type: String,
          trim: true,
          lowercase: true,
          required: true,
          default: null,
        },
      },
      url: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        default: null,
      },
    },
    phoneDetails: {
      number: {
        type: Number,
        trim: true,
        required: false,
        default: null,
      },
      regionalCode: {
        type: Number,
        trim: true,
        required: false,
        default: null,
      },
      toConfirmNumber: {
        type: Number,
        trim: true,
        required: false,
        default: null,
      },
      toConfirmRegionalCode: {
        type: Number,
        trim: true,
        required: false,
        default: null,
      },
      has: {
        type: Boolean,
        required: true,
        default: false,
      },
      isConfirmed: {
        type: Boolean,
        required: true,
        default: false,
      },
      code: {
        type: String,
        trim: true,
        required: false,
        default: null,
      },
      dateSendAgainSMS: {
        type: Date,
        trim: true,
        required: false,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Company =
  (mongoose.models.Company as mongoose.Model<CompanyProps, {}, {}, {}>) ||
  mongoose.model<CompanyProps>("Company", CompanySchema);

export default Company;
