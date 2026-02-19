import { ok, created, notFound } from "../../../utils/http/apiResponse.js";
import * as categoryService from "./category.service.js";

export async function listCategories(req, res) {
  const result = await categoryService.listCategories(req.query);
  return ok(res, result.data, undefined, result.meta);
}

export async function getCategory(req, res) {
  const category = await categoryService.getCategoryById(req.params.id);
  if (!category) return notFound(res, "Category not found");
  return ok(res, category);
}

export async function createCategory(req, res) {
  const category = await categoryService.createCategory(req.body);
  return created(res, category, "Category created");
}

export async function updateCategory(req, res) {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  if (!category) return notFound(res, "Category not found");
  return ok(res, category, "Category updated");
}

export async function toggleActive(req, res) {
  const category = await categoryService.toggleActive(req.params.id);
  if (!category) return notFound(res, "Category not found");
  const status = category.isActive ? "activated" : "deactivated";
  return ok(res, category, `Category ${status}`);
}
