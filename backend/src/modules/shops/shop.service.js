import Shop from "./shop.model.js";
import { paginate } from "#utils/db/paginate.js";
import { err, success, pickDefined } from "#utils/objects.js";
import {
  uploadImages,
  deleteImage,
  extractPublicId,
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
    populate: { path: "owner", select: "firstName lastName email" },
  });
}

export async function getById(id) {
  return Shop.findById(id).populate("owner", "firstName lastName email");
}

const UPDATABLE_FIELDS = ["description", "contactEmail", "contactPhone", "schedule"];

export async function update(id, data) {
  const update = pickDefined(data, UPDATABLE_FIELDS);
  return Shop.findByIdAndUpdate(id, update, { new: true, runValidators: true });
}

export async function setLogo(id, file) {
  const shop = await Shop.findById(id);
  if (!shop) return null;

  return replaceDocumentImage(shop, "logoUrl", file, UPLOAD_FOLDERS.SHOPS);
}

export async function addImages(id, imageFiles) {
  const shop = await Shop.findById(id);
  if (!shop) return err("not_found");

  const results = await uploadImages(
    imageFiles.map(f => f.buffer),
    { folder: UPLOAD_FOLDERS.SHOPS },
  );
  shop.images.push(...results.map(r => r.url));

  await shop.save();
  return success(shop);
}

export async function removeImage(id, imageUrl) {
  const shop = await Shop.findById(id);
  if (!shop) return err("not_found");

  const imageIndex = shop.images.indexOf(imageUrl);
  if (imageIndex === -1) return err("image_not_found");

  const publicId = extractPublicId(imageUrl);
  if (publicId) await deleteImage(publicId);

  shop.images.splice(imageIndex, 1);
  await shop.save();
  return success(shop);
}

async function transitionStatus(id, fromStatus, toStatus) {
  const shop = await Shop.findById(id);
  if (!shop) return err("not_found");
  if (shop.status !== fromStatus) return err("invalid_status");

  shop.status = toStatus;
  await shop.save();
  return success(shop);
}

export async function validate(id) {
  return transitionStatus(id, "pending", "active");
}

export async function suspend(id) {
  return transitionStatus(id, "active", "suspended");
}
