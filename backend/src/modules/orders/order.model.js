import mongoose from "mongoose";
import { createSchema } from "../../shared/utils/createSchema.js";

export const ORDER_STATUSES = ["pending", "confirmed", "refused", "cancelled"];

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productImageUrl: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const statusChangeSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      enum: ORDER_STATUSES,
    },
    to: {
      type: String,
      required: true,
      enum: ORDER_STATUSES,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const orderSchema = createSchema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: items => items.length > 0,
      message: "An order must contain at least one item",
    },
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ORDER_STATUSES,
    default: "pending",
  },
  statusHistory: {
    type: [statusChangeSchema],
    default: [],
  },
  note: {
    type: String,
    trim: true,
  },
});

orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ shop: 1, status: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);
