import mongoose from "mongoose";
import { createSchema } from "#utils/db/createSchema.js";

export const INVITATION_STATUSES = ["pending", "accepted", "declined", "cancelled"];

const invitationSchema = createSchema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  status: {
    type: String,
    enum: INVITATION_STATUSES,
    default: "pending",
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

invitationSchema.index({ shop: 1, user: 1 });
invitationSchema.index({ user: 1, status: 1 });

export default mongoose.model("Invitation", invitationSchema);
