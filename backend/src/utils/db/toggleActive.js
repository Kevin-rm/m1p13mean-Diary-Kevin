import { NotFoundError } from "#utils/http/errors.js";

export async function toggleActiveStatus(Model, filter, { populate } = {}) {
  const doc = await Model.findOne(typeof filter === "string" ? { _id: filter } : filter);
  if (!doc) throw new NotFoundError();

  doc.isActive = !doc.isActive;
  await doc.save();
  return populate ? doc.populate(populate) : doc;
}
