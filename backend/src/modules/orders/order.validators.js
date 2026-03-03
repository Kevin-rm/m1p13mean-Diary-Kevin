import { paramIdRules, paginationRules, searchRule } from "#utils/validators.js";
import { body, query } from "express-validator";
import { ORDER_STATUSES } from "./order.model.js";

const statusFilter = query("status")
  .optional()
  .isIn(ORDER_STATUSES)
  .withMessage(`Status must be one of: ${ORDER_STATUSES.join(", ")}`);

export const listRules = [searchRule, statusFilter, ...paginationRules];

export const getRules = [paramIdRules()];
export const confirmRules = [paramIdRules()];
export const refuseRules = [paramIdRules(), body("reason").optional().isString().trim()];
export const cancelRules = [paramIdRules(), body("reason").optional().isString().trim()];

export const customerListRules = [searchRule, statusFilter, ...paginationRules];
export const customerGetRules = [paramIdRules()];
export const checkoutRules = [
  body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
  body("items.*.product").isMongoId().withMessage("Invalid product ID"),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("note").optional().isString().trim(),
];
