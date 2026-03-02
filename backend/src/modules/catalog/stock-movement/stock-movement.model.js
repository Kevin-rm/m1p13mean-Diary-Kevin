import mongoose from "mongoose";
import { createSchema } from "#utils/db/createSchema.js";

export const MOVEMENT_TYPES = ["in", "out", "adjustment"];

const movementLineSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const stockMovementSchema = createSchema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  type: {
    type: String,
    enum: MOVEMENT_TYPES,
    required: true,
  },
  note: {
    type: String,
    trim: true,
  },
  lines: {
    type: [movementLineSchema],
    required: true,
    validate: {
      validator: lines => lines.length > 0,
      message: "A stock movement must contain at least one line",
    },
  },
});

stockMovementSchema.index({ shop: 1, createdAt: -1 });
stockMovementSchema.index({ "lines.product": 1, createdAt: -1 });

export default mongoose.model("StockMovement", stockMovementSchema);
