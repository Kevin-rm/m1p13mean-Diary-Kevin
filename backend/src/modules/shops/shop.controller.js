import { ok, notFound, badRequest, unauthorized } from "#utils/http/apiResponse.js";
import * as shopService from "./shop.service.js";

export async function listShops(req, res) {
  const result = await shopService.listShops(req.query);
  return ok(res, result.data, undefined, result.meta);
}

export async function getShop(req, res) {
  const shop = await shopService.getShopById(req.params.id);
  if (!shop) return notFound(res, "Shop not found");
  return ok(res, shop);
}

export async function getShopOwner(req, res) {
  const shop = await shopService.getShopByOwnerEmail(req.params.email);
  if (!shop) return notFound(res, "Shop not found");
  return ok(res, shop);
}

export async function addShopImage(req, res) {
  if (!req.file) return badRequest(res, "No file provided");
  const shop = await shopService.addShopImage(req.params.id, req.file);
  if (!shop) return unauthorized(res, "Shop not found");
  return ok(res, { shop }, "Shop updated");
}

export async function validateShop(req, res) {
  const result = await shopService.validateShop(req.params.id);
  if (result.error === "not_found") return notFound(res, "Shop not found");
  if (result.error === "invalid_status")
    return badRequest(res, "Only pending shops can be validated");
  return ok(res, result.data, "Shop validated");
}

export async function suspendShop(req, res) {
  const result = await shopService.suspendShop(req.params.id);
  if (result.error === "not_found") return notFound(res, "Shop not found");
  if (result.error === "invalid_status")
    return badRequest(res, "Only active shops can be suspended");
  return ok(res, result.data, "Shop suspended");
}
