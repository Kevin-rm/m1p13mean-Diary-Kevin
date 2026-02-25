import { body, query } from "express-validator";
import { mongoIdRules, isActiveRule, paginationRules } from "#utils/validators.js";

export const listProductsRules = [
  query("search").optional().trim(),
  query("category").optional().isMongoId().withMessage("Invalid category"),
  isActiveRule,
  ...paginationRules,
];

export const getProductRules = [mongoIdRules()];

export const createProductRules = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description").optional().trim(),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")
    .toFloat(),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer")
    .toInt(),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category"),
];

export const updateProductRules = [
  mongoIdRules(),
  body("name").optional().trim().notEmpty().withMessage("Product name cannot be empty"),
  body("description").optional().trim(),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")
    .toFloat(),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer")
    .toInt(),
  body("category").optional().isMongoId().withMessage("Invalid category"),
];

export const toggleActiveRules = [mongoIdRules()];

export const removeImageRules = [mongoIdRules()];
