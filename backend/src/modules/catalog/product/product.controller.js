import { ok, created, notFound, badRequest } from "#utils/http/apiResponse.js";
import * as productService from "./product.service.js";

export async function listProducts(req, res) {
  const result = await productService.listProducts({
    ...req.query,
    shop: req.context.shop,
  });
  return ok(res, result.data, undefined, result.meta);
}

export async function getProduct(req, res) {
  const product = await productService.getProductById(req.params.id, req.context.shop);
  if (!product) return notFound(res, "Product not found");
  return ok(res, product);
}

export async function createProduct(req, res) {
  const product = await productService.createProduct(
    { ...req.body, shop: req.context.shop },
    req.files,
  );
  return created(res, product, "Product created");
}

export async function updateProduct(req, res) {
  const product = await productService.updateProduct(req.params.id, req.context.shop, req.body);
  if (!product) return notFound(res, "Product not found");
  return ok(res, product, "Product updated");
}

export async function toggleActive(req, res) {
  const product = await productService.toggleActive(req.params.id, req.context.shop);
  if (!product) return notFound(res, "Product not found");
  const status = product.isActive ? "activated" : "deactivated";
  return ok(res, product, `Product ${status}`);
}

export async function removeImage(req, res) {
  const { imageUrl } = req.body;
  if (!imageUrl) return badRequest(res, "imageUrl is required");

  const result = await productService.removeImage(req.params.id, req.context.shop, imageUrl);
  if (result.error === "not_found") return notFound(res, "Product not found");
  if (result.error === "image_not_found") return notFound(res, "Image not found");
  return ok(res, result.data, "Image removed");
}
