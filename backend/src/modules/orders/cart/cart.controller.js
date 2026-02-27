import { ok, notFound, badRequest } from "#utils/http/apiResponse.js";
import * as cartService from "./cart.service.js";

export async function getCart(req, res) {
  const result = await cartService.getCartOrder(req.context.user._id);
  return ok(res, result.data, undefined, result.meta);
}

export async function addItemCart(req, res) {
  const { productId, shopId, quantity } = req.body;
  if (!productId || !shopId) return badRequest(res, "productId and shopId are required");

  const result = await cartService.addItemCart(req.context.user._id, {
    productId,
    shopId,
    quantity,
  });
  return ok(res, result.data, "Product added to cart");
}

export async function removeItemCart(req, res) {
  const { productId, shopId } = req.body;
  if (!productId || !shopId) return badRequest(res, "productId and shopId are required");

  const result = await cartService.removeItemCart(req.context.user._id, { productId, shopId });
  if (result.error === "Cart not found") return notFound(res, "Cart not found");

  return ok(res, result.data, "Product removed from cart");
}
export async function validateCart(req, res) {
  const result = await cartService.validateCart(req.context.user._id);

  if (result.error === "Cart is empty") return badRequest(res, "Cart is empty");

  return ok(res, result.data, "Cart validated and orders created");
}
