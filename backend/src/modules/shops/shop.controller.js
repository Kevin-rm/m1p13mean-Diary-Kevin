import { ok, okOrNotFound, notFound, badRequest } from "#utils/http/apiResponse.js";
import * as shopService from "./shop.service.js";

export function resolveMyShop(req, _res, next) {
  req.params.id = req.user.shop;
  next();
}

export async function list(req, res) {
  const result = await shopService.list(req.query);
  return ok(res, result.data, undefined, result.meta);
}

export async function get(req, res) {
  const shop = await shopService.getById(req.params.id);
  return okOrNotFound(res, shop, { entityName: "Shop" });
}

export async function update(req, res) {
  const shop = await shopService.update(req.params.id, req.body);
  return okOrNotFound(res, shop, { entityName: "Shop", message: "Shop updated" });
}

export async function setLogo(req, res) {
  if (!req.file) return badRequest(res, "No file provided");
  const shop = await shopService.setLogo(req.params.id, req.file);
  if (!shop) return notFound(res, "Shop not found");
  return ok(res, shop, "Logo updated");
}

export async function addImages(req, res) {
  if (!req.files?.length) return badRequest(res, "At least one image is required");
  const result = await shopService.addImages(req.params.id, req.files);
  if (result.error === "not_found") return notFound(res, "Shop not found");
  return ok(res, result.data, "Images added");
}

export async function removeImage(req, res) {
  const { imageUrl } = req.body;
  if (!imageUrl) return badRequest(res, "imageUrl is required");
  const result = await shopService.removeImage(req.params.id, imageUrl);
  if (result.error === "not_found") return notFound(res, "Shop not found");
  if (result.error === "image_not_found") return notFound(res, "Image not found");
  return ok(res, result.data, "Image removed");
}

export async function validateStatus(req, res) {
  const result = await shopService.validate(req.params.id);
  if (result.error === "not_found") return notFound(res, "Shop not found");
  if (result.error === "invalid_status")
    return badRequest(res, "Only pending shops can be validated");
  return ok(res, result.data, "Shop validated");
}

export async function suspend(req, res) {
  const result = await shopService.suspend(req.params.id);
  if (result.error === "not_found") return notFound(res, "Shop not found");
  if (result.error === "invalid_status")
    return badRequest(res, "Only active shops can be suspended");
  return ok(res, result.data, "Shop suspended");
}
