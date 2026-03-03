import { body, query } from "express-validator";
import { paramIdRules, paginationRules, isActiveRule } from "#utils/validators.js";
import { PROMOTION_TYPES } from "./promotion.model.js";

export const listRules = [
  query("product").optional().isMongoId().withMessage("Invalid product id"),
  isActiveRule,
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
    .isIn(PROMOTION_TYPES)
    .withMessage(`Invalid promotion type. Must be one of: ${PROMOTION_TYPES.join(", ")}`),
  body("value")
    .notEmpty()
    .withMessage("Value is required")
    .isFloat({ min: 0 })
    .withMessage("Value must be positive")
    .toFloat(),
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Invalid start date"),
  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("Invalid end date")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
];

export const updateRules = [
  paramIdRules(),
  body("type").optional().isIn(PROMOTION_TYPES),
  body("value").optional().isFloat({ min: 0 }).toFloat(),
  body("startDate").optional().isISO8601(),
  body("endDate")
    .optional()
    .isISO8601()
    .custom((endDate, { req }) => {
      const startDate = req.body.startDate;
      if (startDate && new Date(endDate) <= new Date(startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
];

export const toggleActiveRules = [paramIdRules()];
