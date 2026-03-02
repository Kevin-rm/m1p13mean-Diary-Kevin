import Shop from "./shop.model.js";
import { paginate } from "#utils/db/paginate.js";
import { pickDefined } from "#utils/objects.js";
import { transitionStatus } from "#utils/db/status.js";
import { NotFoundError } from "#utils/http/errors.js";
import {
  addDocumentImages,
  removeDocumentImage,
  replaceDocumentImage,
} from "#utils/upload/cloudinary.js";
import { UPLOAD_FOLDERS } from "#utils/constants.js";

export async function list({ search, status, page, limit }) {
  const filter = {};
  if (search) filter.$text = { $search: search };
  if (status) filter.status = status;

  return paginate(Shop, {
    filter,
    page,
    limit,
    populate: { path: "owner", select: "firstName lastName" },
  });
}

export async function getById(id) {
  const shop = await Shop.findById(id).populate("owner", "firstName lastName");
  if (!shop) throw new NotFoundError(Shop.modelName);
  return shop;
}

const UPDATABLE_FIELDS = ["description", "contactEmail", "contactPhone", "schedule"];

export async function update(id, data) {
  const update = pickDefined(data, UPDATABLE_FIELDS);
  const shop = await Shop.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!shop) throw new NotFoundError(Shop.modelName);
  return shop;
}

export async function setLogo(id, file) {
  const shop = await Shop.findById(id);
  if (!shop) throw new NotFoundError(Shop.modelName);

  return replaceDocumentImage(shop, "logoUrl", file, UPLOAD_FOLDERS.SHOPS);
}

export async function addImages(id, imageFiles) {
  const shop = await Shop.findById(id);
  if (!shop) throw new NotFoundError(Shop.modelName);
  return addDocumentImages(shop, imageFiles, UPLOAD_FOLDERS.SHOPS);
}

export async function removeImage(id, imageUrl) {
  const shop = await Shop.findById(id);
  if (!shop) throw new NotFoundError(Shop.modelName);
  return removeDocumentImage(shop, imageUrl);
}

export async function validate(id) {
  return transitionStatus(Shop, {
    filter: { _id: id },
    fromStatus: "pending",
    toStatus: "active",
  });
}

export async function suspend(id) {
  return transitionStatus(Shop, {
    filter: { _id: id },
    fromStatus: "active",
    toStatus: "suspended",
  });
}
