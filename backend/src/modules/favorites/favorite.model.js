import mongoose from "mongoose";
import { createSchema } from "../../utils/db/createSchema.js";

export const FAVORITE_TARGET_TYPES = ["Shop", "Product"];

const favoriteSchema = createSchema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  targetType: {
    type: String,
    required: true,
    enum: FAVORITE_TARGET_TYPES,
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "targetType",
  },
});

favoriteSchema.index({ user: 1, targetType: 1, target: 1 }, { unique: true });
favoriteSchema.index({ user: 1, targetType: 1, createdAt: -1 });

export default mongoose.model("Favorite", favoriteSchema);
