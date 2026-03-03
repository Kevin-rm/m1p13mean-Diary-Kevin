import mongoose from "mongoose";
import { createSchema } from "#utils/db/createSchema.js";

const categorySchema = createSchema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Category", categorySchema);
