import mongoose from "mongoose";
import { createSchema } from "../../utils/db/createSchema.js";

export const ACTIVITY_LOG_ACTIONS = ["create", "update", "delete"];

const activityLogSchema = createSchema(
  {
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ACTIVITY_LOG_ACTIONS,
    },
    targetModel: {
      type: String,
      required: true,
      trim: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

activityLogSchema.index({ performedBy: 1, createdAt: -1 });
activityLogSchema.index({ targetModel: 1, targetId: 1, createdAt: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);
