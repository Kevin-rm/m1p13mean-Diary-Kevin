import { body, query } from "express-validator";
import { mongoIdRules, paginationRules, isActiveRule } from "#utils/validators.js";

import { PROMOTION_TYPES } from "./promotion.model.js";

export const listPromotionsRules = [
  query("product").optional().isMongoId().withMessage("Invalid product id"),
  isActiveRule,
  ...paginationRules,
];

export const getPromotionRules = [mongoIdRules()];

export const createPromotionRules = [
  body("productId")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid product id"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(PROMOTION_TYPES)
    .withMessage(`Invalid promotion type. Must be one of: ${PROMOTION_TYPES.join(", ")}`),

  body("value")
    .notEmpty()
    .withMessage("Value is required")
    .isFloat({ min: 0 })
    .withMessage("Value must be positive")
    .toFloat(),

  body("startDate").notEmpty().isISO8601(),
  body("endDate").notEmpty().isISO8601(),
];

export const updatePromotionRules = [
  mongoIdRules(),
  body("type").optional().isIn(PROMOTION_TYPES),
  body("value").optional().isFloat({ min: 0 }).toFloat(),
  body("startDate").optional().isISO8601(),
  body("endDate").optional().isISO8601(),
];

export const toggleActiveRules = [mongoIdRules()];
