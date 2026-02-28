import { ok, created, okOrNotFound, notFound, badRequest } from "#utils/http/apiResponse.js";
import { activeLabel } from "#utils/objects.js";
import * as productService from "./product.service.js";

export async function list(req, res) {
  const result = await productService.list({
    ...req.query,
    shop: req.user.shop,
  });
  return ok(res, result.data, undefined, result.meta);
}

export async function get(req, res) {
  const product = await productService.getById(req.params.id, req.user.shop);
  return okOrNotFound(res, product, { entityName: "Product" });
}

export async function create(req, res) {
  const product = await productService.create({ ...req.body, shop: req.user.shop }, req.files);
  return created(res, product, "Product created");
}

export async function update(req, res) {
  const product = await productService.update(req.params.id, req.user.shop, req.body);
  return okOrNotFound(res, product, { message: "Product updated", entityName: "Product" });
}

export async function toggleActive(req, res) {
  const product = await productService.toggleActive(req.params.id, req.user.shop);
  return okOrNotFound(res, product, {
    message: `Product ${activeLabel(product?.isActive)}`,
    entityName: "Product",
  });
}

export async function addImages(req, res) {
  if (!req.files?.length) return badRequest(res, "At least one image is required");

  const result = await productService.addImages(req.params.id, req.user.shop, req.files);
  if (result.error === "not_found") return notFound(res, "Product not found");
  return ok(res, result.data, "Images added");
}

export async function removeImage(req, res) {
  const { imageUrl } = req.body;
  if (!imageUrl) return badRequest(res, "imageUrl is required");

  const result = await productService.removeImage(req.params.id, req.user.shop, imageUrl);
  if (result.error === "not_found") return notFound(res, "Product not found");
  if (result.error === "image_not_found") return notFound(res, "Image not found");
  return ok(res, result.data, "Image removed");
}
