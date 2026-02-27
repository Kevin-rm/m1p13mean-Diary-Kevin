import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { createSchema } from "#utils/db/createSchema.js";

const SALT_ROUNDS = 12;

const userSchema = createSchema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    avatarUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
      },
    },
  },
);

userSchema.pre("save", function () {
  if (!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password, SALT_ROUNDS);
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ isActive: 1 });

export default mongoose.model("User", userSchema);
