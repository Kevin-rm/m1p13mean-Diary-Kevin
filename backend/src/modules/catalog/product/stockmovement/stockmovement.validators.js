import { body, query } from "express-validator";
import { paramIdRules, paginationRules } from "#utils/validators.js";
import { STOCK_MOVEMENT_TYPES } from "./stockmovement.model.js";

export const listRules = [
  query("product").optional().isMongoId().withMessage("Invalid product id"),
  ...paginationRules,
];

export const getRules = [paramIdRules()];

export const createRules = [
  body("productId")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid product id"),
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(STOCK_MOVEMENT_TYPES)
    .withMessage(`Invalid type. Must be one of: ${STOCK_MOVEMENT_TYPES.join(", ")}`),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer")
    .toInt(),
  body("reason").optional().isString().trim(),
];
