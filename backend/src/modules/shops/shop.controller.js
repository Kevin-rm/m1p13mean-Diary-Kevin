import { ok, badRequest } from "#utils/http/apiResponse.js";
import * as shopService from "./shop.service.js";

const getId = req => req.resolvedId ?? req.params.id;

export async function list(req, res) {
  const result = await shopService.list(req.query);
  return ok(res, result.data, undefined, result.meta);
}

export async function get(req, res) {
  const shop = await shopService.getById(getId(req));
  return ok(res, shop);
}

export async function update(req, res) {
  const shop = await shopService.update(getId(req), req.body);
  return ok(res, shop, "Shop updated");
}

export async function setLogo(req, res) {
  if (!req.file) return badRequest(res, "No file provided");
  const shop = await shopService.setLogo(getId(req), req.file);
  return ok(res, shop, "Logo updated");
}

export async function addImages(req, res) {
  if (!req.files?.length) return badRequest(res, "At least one image is required");
  const shop = await shopService.addImages(getId(req), req.files);
  return ok(res, shop, "Images added");
}

export async function removeImage(req, res) {
  const { imageUrl } = req.body;
  if (!imageUrl) return badRequest(res, "imageUrl is required");
  const shop = await shopService.removeImage(getId(req), imageUrl);
  return ok(res, shop, "Image removed");
}

export async function validateStatus(req, res) {
  const shop = await shopService.validate(req.params.id);
  return ok(res, shop, "Shop validated");
}

export async function suspend(req, res) {
  const shop = await shopService.suspend(req.params.id);
  return ok(res, shop, "Shop suspended");
}

export async function stats(_req, res) {
  const result = await shopService.stats();
  return ok(res, result);
}
