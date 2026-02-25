import { ok, created, okOrNotFound } from "#utils/http/apiResponse.js";
import { activeLabel } from "#utils/objects.js";
import * as categoryService from "./category.service.js";

export async function listCategories(req, res) {
  const result = await categoryService.listCategories(req.query);
  return ok(res, result.data, undefined, result.meta);
}

export async function getCategory(req, res) {
  const category = await categoryService.getCategoryById(req.params.id);
  return okOrNotFound(res, category, { entityName: "Category" });
}

export async function createCategory(req, res) {
  const category = await categoryService.createCategory(req.body);
  return created(res, category, "Category created");
}

export async function updateCategory(req, res) {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  return okOrNotFound(res, category, { message: "Category updated", entityName: "Category" });
}

export async function toggleActive(req, res) {
  const category = await categoryService.toggleActive(req.params.id);
  return okOrNotFound(res, category, {
    message: `Category ${activeLabel(category?.isActive)}`,
    entityName: "Category",
  });
}
