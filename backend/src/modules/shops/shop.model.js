import mongoose from "mongoose";
import { createSchema } from "#utils/db/createSchema.js";

export const SHOP_STATUSES = ["pending", "active", "suspended"];

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const scheduleSlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: DAYS_OF_WEEK,
    },
    openTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    closeTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
  },
  { _id: false },
);

const positionSchema = new mongoose.Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    floor: { type: Number, default: 0 },
  },
  { _id: false },
);

const shopSchema = createSchema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  logoUrl: {
    type: String,
  },
  images: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: SHOP_STATUSES,
    default: "pending",
  },
  contactEmail: {
    type: String,
    lowercase: true,
    trim: true,
  },
  contactPhone: {
    type: String,
    trim: true,
  },
  schedule: {
    type: [scheduleSlotSchema],
    default: [],
  },
  position: {
    type: positionSchema,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

shopSchema.index({ status: 1 });

export default mongoose.model("Shop", shopSchema);
