import mongoose from "mongoose";

export function createSchema(definition, { toJSON, ...restOptions } = {}) {
  const { transform, ...toJSONOptions } = toJSON || {};

  return new mongoose.Schema(definition, {
    timestamps: true,
    ...restOptions,
    toJSON: {
      virtuals: true,
      ...toJSONOptions,
      transform(_doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        if (transform) transform(_doc, ret);
      },
    },
  });
}
