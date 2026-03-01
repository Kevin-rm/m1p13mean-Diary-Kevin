import { ok, created, okOrNotFound, notFound, badRequest } from "#utils/http/apiResponse.js";

import * as promotionService from "./promotion.service.js";

export async function listPromotions(req, res) {
  const result = await promotionService.listPromotions({
    ...req.query,
    shop: req.context.shop,
  });

  return ok(res, result.data, undefined, result.meta);
}

export async function getPromotion(req, res) {
  const promotion = await promotionService.getPromotionById(req.params.id, req.context.shop);

  return okOrNotFound(res, promotion, { entityName: "Promotion" });
}

export async function createPromotion(req, res) {
  const result = await promotionService.createPromotion(req.body, req.context.shop);

  if (result.error === "not_found") return notFound(res, "Product not found");

  if (result.error === "invalid_dates") return badRequest(res, "End date must be after start date");

  return created(res, result.data, "Promotion created");
}

export async function updatePromotion(req, res) {
  const promotion = await promotionService.updatePromotion(
    req.params.id,
    req.context.shop,
    req.body,
  );

  return okOrNotFound(res, promotion, {
    message: "Promotion updated",
    entityName: "Promotion",
  });
}

export async function toggleActive(req, res) {
  const promotion = await promotionService.toggleActive(req.params.id, req.context.shop);

  return okOrNotFound(res, promotion, {
    message: "Promotion status updated",
    entityName: "Promotion",
  });
}
