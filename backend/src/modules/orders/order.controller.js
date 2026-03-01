import { ok } from "#utils/http/apiResponse.js";
import * as orderService from "./order.service.js";

export async function list(req, res) {
  const result = await orderService.list({
    ...req.query,
    shop: req.user.shop,
  });
  return ok(res, result.data, undefined, result.meta);
}

export async function get(req, res) {
  const order = await orderService.getById(req.params.id, req.user.shop);
  return ok(res, order);
}

export async function confirm(req, res) {
  const order = await orderService.confirm(req.params.id, req.user.shop, req.user.userId);
  return ok(res, order, "Order confirmed");
}

export async function refuse(req, res) {
  const order = await orderService.refuse(
    req.params.id,
    req.user.shop,
    req.user.userId,
    req.body.reason,
  );
  return ok(res, order, "Order refused");
}

export async function cancel(req, res) {
  const order = await orderService.cancel(
    req.params.id,
    req.user.shop,
    req.user.userId,
    req.body.reason,
  );
  return ok(res, order, "Order cancelled");
}
