import { body, query } from "express-validator";
import {
  paramIdRules,
  searchRule,
  isActiveRule,
  paginationRules,
  resourceNameRules,
  descriptionRule,
} from "#utils/validators.js";

const productName = resourceNameRules("Product name");

export const listRules = [
  searchRule,
  query("category").optional().isMongoId().withMessage("Invalid category"),
  isActiveRule,
  ...paginationRules,
];

export const getRules = [paramIdRules()];

export const createRules = [
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

export const updateRules = [
  paramIdRules(),
  productName.optional,
  descriptionRule,
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")
    .toFloat(),
  body("category").optional().isMongoId().withMessage("Invalid category"),
];

export const toggleActiveRules = [paramIdRules()];

export const removeImageRules = [paramIdRules()];
