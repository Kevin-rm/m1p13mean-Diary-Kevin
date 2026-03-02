import mongoose from "mongoose";
import { createSchema } from "#utils/db/createSchema.js";
import { PERMISSIONS } from "../profile.model.js";

export const ROLE_CODES = ["owner", "manager", "seller"];

const roleSchema = createSchema({
  code: {
    type: String,
    required: true,
    unique: true,
    enum: ROLE_CODES,
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

export default mongoose.model("Role", roleSchema);
