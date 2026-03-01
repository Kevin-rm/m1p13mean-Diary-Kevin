import { ok, created } from "#utils/http/apiResponse.js";
import { activeLabel } from "#utils/objects.js";
import * as categoryService from "./category.service.js";

export async function list(req, res) {
  const result = await categoryService.list(req.query);
  return ok(res, result.data, undefined, result.meta);
}

export async function select(_req, res) {
  const categories = await categoryService.select();
  return ok(res, categories);
}

export async function get(req, res) {
  const category = await categoryService.getById(req.params.id);
  return ok(res, category);
}

export async function create(req, res) {
  const category = await categoryService.create(req.body);
  return created(res, category, "Category created");
}

export async function update(req, res) {
  const category = await categoryService.update(req.params.id, req.body);
  return ok(res, category, "Category updated");
}

export async function toggleActive(req, res) {
  const category = await categoryService.toggleActive(req.params.id);
  return ok(res, category, `Category ${activeLabel(category.isActive)}`);
}
