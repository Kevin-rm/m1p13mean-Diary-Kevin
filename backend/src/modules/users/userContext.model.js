import mongoose from "mongoose";
import { createSchema } from "../../utils/db/createSchema.js";

const userContextSchema = createSchema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    default: null,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

userContextSchema.index({ user: 1, profile: 1, shop: 1 }, { unique: true });
userContextSchema.index({ user: 1 });
userContextSchema.index({ shop: 1 });

export default mongoose.model("UserContext", userContextSchema);
