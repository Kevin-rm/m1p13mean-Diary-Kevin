import { ok, created } from "#utils/http/apiResponse.js";
import * as orderService from "./order.service.js";

// ── Shop-side ────────────────────────────────────────────────────────────────

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

// ── Stats ────────────────────────────────────────────────────────────────────

export async function stats(req, res) {
  const result = await orderService.stats(req.user.shop ?? undefined);
  return ok(res, result);
}

// ── Customer ─────────────────────────────────────────────────────────────────

export async function customerList(req, res) {
  const result = await orderService.listByBuyer({
    ...req.query,
    buyer: req.user.userId,
  });
  return ok(res, result.data, undefined, result.meta);
}

export async function customerGet(req, res) {
  const order = await orderService.getByBuyer(req.params.id, req.user.userId);
  return ok(res, order);
}

export async function customerCheckout(req, res) {
  const orders = await orderService.checkout(req.user.userId, req.body.items, req.body.note);
  return created(res, orders, "Commande(s) créée(s)");
}
