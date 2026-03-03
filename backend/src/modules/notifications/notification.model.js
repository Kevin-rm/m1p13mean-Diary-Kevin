import mongoose from "mongoose";
import { createSchema } from "#utils/db/createSchema.js";

export const NOTIFICATION_TYPES = [
  "order_status_changed",
  "new_order",
  "shop_status_changed",
  "review_posted",
  "review_moderated",
];

const notificationSchema = createSchema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: NOTIFICATION_TYPES,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
});

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
