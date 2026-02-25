import { query } from "express-validator";
import { SHOP_STATUSES } from "./shop.model.js";
import { mongoIdRules, searchRule, paginationRules } from "#utils/validators.js";

export const listShopsRules = [
  searchRule,
  query("status")
    .optional()
    .isIn(SHOP_STATUSES)
    .withMessage(`Status must be one of: ${SHOP_STATUSES.join(", ")}`),
  ...paginationRules,
];

export const getShopRules = [mongoIdRules()];

export const validateShopRules = [mongoIdRules()];

export const suspendShopRules = [mongoIdRules()];
