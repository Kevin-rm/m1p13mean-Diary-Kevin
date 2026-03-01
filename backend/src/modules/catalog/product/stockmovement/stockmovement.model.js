import mongoose from "mongoose";
import { createSchema } from "#utils/db/createSchema.js";

export const STOCK_MOVEMENT_TYPES = ["in", "out", "adjustment"];

const stockMovementSchema = createSchema({
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
    enum: STOCK_MOVEMENT_TYPES,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

  reason: {
    type: String,
    trim: true,
  },

  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  previousStock: {
    type: Number,
    required: true,
  },

  newStock: {
    type: Number,
    required: true,
  },
});

stockMovementSchema.index({ product: 1, createdAt: -1 });

export default mongoose.model("StockMovement", stockMovementSchema);
