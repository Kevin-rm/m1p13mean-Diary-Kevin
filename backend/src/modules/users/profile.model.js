import mongoose from "mongoose";
import { createSchema } from "#utils/db/createSchema.js";

export const PROFILE_CODES = ["admin", "shop", "customer"];

export const PERMISSIONS = [
  "shops:create",
  "shops:validate",
  "shops:suspend",
  "categories:read",
  "categories:write",
  "products:read",
  "products:write",
  "orders:read",
  "orders:manage",
  "orders:create",
  "shops:manage",
  "members:read",
  "members:manage",
  "stats:read",
  "stats:global",
  "moderation:reviews",
  "moderation:products",
  "cart:manage",
  "reviews:write",
  "favorites:manage",
];

const profileSchema = createSchema({
  code: {
    type: String,
    required: true,
    unique: true,
    enum: PROFILE_CODES,
  },
  label: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  permissions: {
    type: [{ type: String, enum: PERMISSIONS }],
    default: [],
  },
});

export default mongoose.model("Profile", profileSchema);
