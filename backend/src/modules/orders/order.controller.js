import { ok, okOrNotFound, notFound, badRequest } from "#utils/http/apiResponse.js";
import * as orderService from "./order.service";

export async function listOrders(req, res) {
  const result = await orderService.listOrders({
    ...req.query,
    shop: req.context.shop,
  });
  return ok(res, result.data, undefined, result.meta);
}

export async function getOrder(req, res) {
  const order = orderService.getOrderById(req.params.id, req.context.shop);
  return okOrNotFound(res, order, { entityName: "Order" });
}

export async function confirmOrder(req, res) {
  const result = await orderService.confirmOrder(req.params.id, req.context.user._id);
  if (result.error === "not_found") return notFound(res, "Order not found");
  if (result.error === "invalid_status")
    return badRequest(res, "Only pending shops can be validated");
  return ok(res, result.data, "Shop validated");
}

export async function refuseOrder(req, res) {
  const result = await orderService.refuseOrder(
    req.params.id,
    req.context.user._id,
    req.body.reason,
  );
  if (result.error === "not_found") return notFound(res, "Order not found");
  if (result.error === "invalid_status")
    return badRequest(res, "Only active shops can be suspended");
  return ok(res, result.data, "Shop suspended");
}

export async function cancelOrder(req, res) {
  const result = await orderService.cancelOrder(
    req.params.id,
    req.context.user._id,
    req.body.reason,
  );
  if (result.error === "not_found") return notFound(res, "Order not found");
  if (result.error === "invalid_status")
    return badRequest(res, "Only active shops can be suspended");
  return ok(res, result.data, "Shop suspended");
}
