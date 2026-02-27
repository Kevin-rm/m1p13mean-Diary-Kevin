import { mongoIdRules, paginationRules, searchRule } from "#utils/validators.js";
import { body, query } from "express-validator";
import { ORDER_STATUSES } from "./order.model";

export const listOrdersRules = [
  searchRule,
  query("status")
    .optional()
    .isIn(ORDER_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_STATUSES.join(", ")}`),
  ...paginationRules,
];

export const getOrderRules = [mongoIdRules()];
export const confirmOrderRules = [mongoIdRules()];
export const refuseOrderRules = [mongoIdRules(), body("reason").optional().isString().trim()];
export const cancelOrderRules = [mongoIdRules(), body("reason").optional().isString().trim()];
