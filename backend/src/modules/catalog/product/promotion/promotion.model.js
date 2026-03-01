import mongoose from "mongoose";
import { createSchema } from "#utils/db/createSchema.js";

export const PROMOTION_TYPES = ["percentage", "fixed"];

const promotionSchema = createSchema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
  },

  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
    index: true,
  },

  type: {
    type: String,
    enum: PROMOTION_TYPES,
    required: true,
  },

  value: {
    type: Number,
    required: true,
    min: 0,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

promotionSchema.index({ product: 1, shop: 1 });

export default mongoose.model("Promotion", promotionSchema);
