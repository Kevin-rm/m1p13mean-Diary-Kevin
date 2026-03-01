import { ok, created } from "#utils/http/apiResponse.js";
import { activeLabel } from "#utils/objects.js";
import * as promotionService from "./promotion.service.js";

export async function list(req, res) {
  const result = await promotionService.list({
    ...req.query,
    shop: req.user.shop,
  });
  return ok(res, result.data, undefined, result.meta);
}

export async function get(req, res) {
  const promotion = await promotionService.getById(req.params.id, req.user.shop);
  return ok(res, promotion);
}

export async function create(req, res) {
  const promotion = await promotionService.create(req.body, req.user.shop);
  return created(res, promotion, "Promotion created");
}

export async function update(req, res) {
  const promotion = await promotionService.update(req.params.id, req.user.shop, req.body);
  return ok(res, promotion, "Promotion updated");
}

export async function toggleActive(req, res) {
  const promotion = await promotionService.toggleActive(req.params.id, req.user.shop);
  return ok(res, promotion, `Promotion ${activeLabel(promotion.isActive)}`);
}
