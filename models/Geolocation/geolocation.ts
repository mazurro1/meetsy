import mongoose from "mongoose";
import type {GeolocationProps} from "./geolocation.model";

const GeolocationSchema = new mongoose.Schema(
  {
    adress: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Geolocation =
  (mongoose.models.Geolocation as mongoose.Model<
    GeolocationProps,
    {},
    {},
    {}
  >) || mongoose.model<GeolocationProps>("Geolocation", GeolocationSchema);

export default Geolocation;
