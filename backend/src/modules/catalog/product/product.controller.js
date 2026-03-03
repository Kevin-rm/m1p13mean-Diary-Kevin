import { ok, created, badRequest } from "#utils/http/apiResponse.js";
import { activeLabel } from "#utils/objects.js";
import * as productService from "./product.service.js";

export async function list(req, res) {
  const result = await productService.list({
    ...req.query,
    shop: req.user.shop,
  });
  return ok(res, result.data, undefined, result.meta);
}

export async function select(req, res) {
  const products = await productService.select(req.user.shop, req.query.search);
  return ok(res, products);
}

export async function get(req, res) {
  const product = await productService.getById(req.params.id, req.user.shop);
  return ok(res, product);
}

export async function create(req, res) {
  const product = await productService.create({ ...req.body, shop: req.user.shop }, req.files);
  return created(res, product, "Product created");
}

export async function update(req, res) {
  const product = await productService.update(req.params.id, req.user.shop, req.body);
  return ok(res, product, "Product updated");
}

export async function toggleActive(req, res) {
  const product = await productService.toggleActive(req.params.id, req.user.shop);
  return ok(res, product, `Product ${activeLabel(product.isActive)}`);
}

export async function addImages(req, res) {
  if (!req.files?.length) return badRequest(res, "At least one image is required");
  const product = await productService.addImages(req.params.id, req.user.shop, req.files);
  return ok(res, product, "Images added");
}

export async function removeImage(req, res) {
  const { imageUrl } = req.body;
  if (!imageUrl) return badRequest(res, "imageUrl is required");
  const product = await productService.removeImage(req.params.id, req.user.shop, imageUrl);
  return ok(res, product, "Image removed");
}

export async function stats(req, res) {
  const result = await productService.stats(req.user.shop);
  return ok(res, result);
}
