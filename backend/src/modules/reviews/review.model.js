import mongoose from "mongoose";
import { createSchema } from "#utils/db/createSchema.js";

export const REVIEW_STATUSES = ["pending", "approved", "rejected"];

const reviewSchema = createSchema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  status: {
    type: String,
    enum: REVIEW_STATUSES,
    default: "pending",
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  moderatedAt: {
    type: Date,
  },
});

reviewSchema.index({ user: 1, shop: 1 }, { unique: true });
reviewSchema.index({ shop: 1, status: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);
