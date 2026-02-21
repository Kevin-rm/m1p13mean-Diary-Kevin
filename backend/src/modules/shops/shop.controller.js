import { ok, notFound, badRequest } from "../../utils/http/apiResponse.js";
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
