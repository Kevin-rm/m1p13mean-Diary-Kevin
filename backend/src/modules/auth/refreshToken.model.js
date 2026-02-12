import mongoose from "mongoose";
import { createSchema } from "../../utils/db/createSchema.js";

const refreshTokenSchema = createSchema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userContext: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserContext",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
  revokedAt: {
    type: Date,
    default: null,
  },
});

refreshTokenSchema.index({ user: 1 });

export default mongoose.model("RefreshToken", refreshTokenSchema);
