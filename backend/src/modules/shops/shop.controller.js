import { ok, okOrNotFound, notFound, badRequest } from "#utils/http/apiResponse.js";
import * as shopService from "./shop.service.js";

export async function listShops(req, res) {
  const result = await shopService.listShops(req.query);
  return ok(res, result.data, undefined, result.meta);
}

export async function getShop(req, res) {
  const shop = await shopService.getShopById(req.params.id);
  return okOrNotFound(res, shop, { entityName: "Shop" });
}

export async function getMyShop(req, res) {
  const shop = await shopService.getShopById(req.user.shop);
  return okOrNotFound(res, shop, { entityName: "Shop" });
}

export async function updateMyShop(req, res) {
  const shop = await shopService.updateShop(req.user.shop, req.body);
  return okOrNotFound(res, shop, { entityName: "Shop", successMessage: "Boutique mise à jour" });
}

export async function setMyShopLogo(req, res) {
  if (!req.file) return badRequest(res, "No file provided");
  const shop = await shopService.setShopLogo(req.user.shop, req.file);
  if (!shop) return notFound(res, "Shop not found");
  return ok(res, shop, "Logo mis à jour");
}

export async function addMyShopImage(req, res) {
  if (!req.file) return badRequest(res, "No file provided");
  const shop = await shopService.addShopImage(req.user.shop, req.file);
  if (!shop) return notFound(res, "Shop not found");
  return ok(res, { shop }, "Shop updated");
}

export async function addShopImage(req, res) {
  if (!req.file) return badRequest(res, "No file provided");
  const shop = await shopService.addShopImage(req.params.id, req.file);
  if (!shop) return notFound(res, "Shop not found");
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
