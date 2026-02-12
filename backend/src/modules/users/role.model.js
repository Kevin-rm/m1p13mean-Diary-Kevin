import mongoose from "mongoose";
import { createSchema } from "../../utils/db/createSchema.js";

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
});

export default mongoose.model("Role", roleSchema);
