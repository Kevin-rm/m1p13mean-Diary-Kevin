import { body } from "express-validator";
import { paramIdRules, queryIdRules, paginationRules } from "#utils/validators.js";
import { MOVEMENT_TYPES } from "./stock-movement.model.js";

export const listRules = [queryIdRules("product").optional(), ...paginationRules];

export const getRules = [paramIdRules()];

export const createRules = [
  body("date").optional().isISO8601().withMessage("Invalid date format").toDate(),
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(MOVEMENT_TYPES)
    .withMessage(`Invalid type. Must be one of: ${MOVEMENT_TYPES.join(", ")}`),
  body("note").optional().isString().trim(),
  body("lines").isArray({ min: 1 }).withMessage("At least one line is required"),
  body("lines.*.productId")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid product id"),
  body("lines.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer")
    .toInt(),
];
