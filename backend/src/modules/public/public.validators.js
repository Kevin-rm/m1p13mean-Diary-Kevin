import { query } from "express-validator";
import { paramIdRules, searchRule, paginationRules } from "#utils/validators.js";

export const listShopsRules = [
  searchRule,
  ...paginationRules,
  query("minRating").optional().isFloat({ min: 0, max: 5 }).withMessage("Invalid rating"),
  query("sort").optional().isIn(["name", "-name", "rating", "-rating"]).withMessage("Invalid sort"),
];

export const listProductsRules = [
  searchRule,
  ...paginationRules,
  query("category").optional().isMongoId().withMessage("Invalid category"),
  query("shop").optional().isMongoId().withMessage("Invalid shop"),
  query("minPrice").optional().isFloat({ min: 0 }).withMessage("Invalid min price"),
  query("maxPrice").optional().isFloat({ min: 0 }).withMessage("Invalid max price"),
  query("sort")
    .optional()
    .isIn(["name", "-name", "price", "-price", "newest"])
    .withMessage("Invalid sort"),
];

export const shopProductsRules = [
  paramIdRules(),
  searchRule,
  ...paginationRules,
  query("category").optional().isMongoId().withMessage("Invalid category"),
];

export const getByIdRules = [paramIdRules()];
