import { NotFoundError, BadRequestError } from "#utils/http/errors.js";

export async function toggleActiveStatus(Model, filter, { populate } = {}) {
  const doc = await Model.findOne(typeof filter === "string" ? { _id: filter } : filter);
  if (!doc) throw new NotFoundError(Model.modelName);

  doc.isActive = !doc.isActive;
  await doc.save();
  return populate ? doc.populate(populate) : doc;
}

export async function transitionStatus(
  Model,
  { filter, fromStatus, toStatus, populate, session },
  { beforeSave } = {},
) {
  const query = Model.findOne(filter);
  if (populate) query.populate(populate);
  if (session) query.session(session);

  const doc = await query;
  if (!doc) throw new NotFoundError(Model.modelName);

  if (fromStatus && doc.status !== fromStatus) {
    throw new BadRequestError(`Must be ${fromStatus} to be ${toStatus}`);
  }

  doc.status = toStatus;
  await beforeSave?.(doc);
  await doc.save({ session });
  return doc;
}
