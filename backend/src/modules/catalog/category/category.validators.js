import { body, query } from "express-validator";
import { mongoIdRules, paginationRules } from "../../../utils/validators.js";

export const listCategoriesRules = [
  query("search").optional().trim(),
  query("isActive").optional().isBoolean().withMessage("isActive must be a boolean").toBoolean(),
  ...paginationRules,
];

export const getCategoryRules = [mongoIdRules()];

export const createCategoryRules = [
  body("name").trim().notEmpty().withMessage("Category name is required"),
  body("description").optional().trim(),
];

export const updateCategoryRules = [
  mongoIdRules(),
  body("name").optional().trim().notEmpty().withMessage("Category name cannot be empty"),
  body("description").optional().trim(),
];

export const toggleActiveRules = [mongoIdRules()];
