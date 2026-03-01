import { ok, created } from "#utils/http/apiResponse.js";
import * as cartService from "./cart.service.js";

export async function get(req, res) {
  const cart = await cartService.get(req.user.userId);
  return ok(res, cart);
}

export async function addItem(req, res) {
  const cart = await cartService.addItem(req.user.userId, req.body);
  return ok(res, cart, "Product added to cart");
}

export async function removeItem(req, res) {
  const cart = await cartService.removeItem(req.user.userId, req.body);
  return ok(res, cart, "Product removed from cart");
}

export async function validate(req, res) {
  const result = await cartService.validate(req.user.userId);
  return created(res, result, "Cart validated and orders created");
}
