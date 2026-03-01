import { paramIdRules, paginationRules, searchRule } from "#utils/validators.js";
import { body, query } from "express-validator";
import { ORDER_STATUSES } from "./order.model.js";

export const listRules = [
  searchRule,
  query("status")
    .optional()
    .isIn(ORDER_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_STATUSES.join(", ")}`),
  ...paginationRules,
];

export const getRules = [paramIdRules()];
export const confirmRules = [paramIdRules()];
export const refuseRules = [paramIdRules(), body("reason").optional().isString().trim()];
export const cancelRules = [paramIdRules(), body("reason").optional().isString().trim()];
