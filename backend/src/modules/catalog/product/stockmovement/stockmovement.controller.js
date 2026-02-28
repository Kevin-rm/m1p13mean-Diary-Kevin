import { ok, created, okOrNotFound, notFound, badRequest } from "#utils/http/apiResponse.js";

import * as stockService from "./stockmovement.service.js";

export async function listStockMovements(req, res) {
  const result = await stockService.listStockMovements({
    ...req.query,
    shop: req.context.shop,
  });

  return ok(res, result.data, undefined, result.meta);
}

export async function getStockMovement(req, res) {
  const movement = await stockService.getStockMovementById(req.params.id, req.context.shop);

  return okOrNotFound(res, movement, {
    entityName: "Stock movement",
  });
}

export async function createStockMovement(req, res) {
  const result = await stockService.createStockMovement(
    req.body,
    req.context.shop,
    req.context.user._id,
  );

  if (result.error === "invalid_type") return badRequest(res, "Invalid stock movement type");

  if (result.error === "not_found") return notFound(res, "Product not found");

  if (result.error === "insufficient_stock") return badRequest(res, "Insufficient stock");

  return created(res, result.data, "Stock updated successfully");
}
