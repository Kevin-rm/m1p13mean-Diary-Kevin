import { ok, created } from "#utils/http/apiResponse.js";
import * as stockMovementService from "./stockmovement.service.js";

export async function list(req, res) {
  const result = await stockMovementService.list({
    ...req.query,
    shop: req.user.shop,
  });
  return ok(res, result.data, undefined, result.meta);
}

export async function get(req, res) {
  const movement = await stockMovementService.getById(req.params.id, req.user.shop);
  return ok(res, movement);
}

export async function create(req, res) {
  const movement = await stockMovementService.create(req.body, req.user.shop, req.user.userId);
  return created(res, movement, "Stock updated");
}
