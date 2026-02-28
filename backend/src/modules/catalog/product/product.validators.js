import { body, query } from "express-validator";
import {
  mongoIdRules,
  searchRule,
  isActiveRule,
  paginationRules,
  resourceNameRules,
  descriptionRule,
} from "#utils/validators.js";

const productName = resourceNameRules("Product name");

export const listProductsRules = [
  searchRule,
  query("category").optional().isMongoId().withMessage("Invalid category"),
  isActiveRule,
  ...paginationRules,
];

export const getProductRules = [mongoIdRules()];

export const createProductRules = [
  productName.required,
  descriptionRule,
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")
    .toFloat(),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category"),
];

export const updateProductRules = [
  mongoIdRules(),
  productName.optional,
  descriptionRule,
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")
    .toFloat(),
  body("category").optional().isMongoId().withMessage("Invalid category"),
];

export const toggleActiveRules = [mongoIdRules()];

export const removeImageRules = [mongoIdRules()];
