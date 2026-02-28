import { body, query } from "express-validator";
import { SHOP_STATUSES, DAYS_OF_WEEK } from "./shop.model.js";
import { mongoIdRules, searchRule, paginationRules, descriptionRule } from "#utils/validators.js";

export const listRules = [
  searchRule,
  query("status")
    .optional()
    .isIn(SHOP_STATUSES)
    .withMessage(`Status must be one of: ${SHOP_STATUSES.join(", ")}`),
  ...paginationRules,
];

export const getRules = [mongoIdRules()];

export const validateRules = [mongoIdRules()];

export const suspendRules = [mongoIdRules()];

export const updateRules = [
  descriptionRule,
  body("contactEmail")
    .optional({ values: "falsy" })
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),
  body("contactPhone").optional({ values: "falsy" }).isString().trim(),
  body("schedule").optional().isArray(),
  body("schedule.*.day")
    .isIn(DAYS_OF_WEEK)
    .withMessage(`Day must be one of: ${DAYS_OF_WEEK.join(", ")}`),
  body("schedule.*.openTime")
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("Invalid time format (HH:mm)"),
  body("schedule.*.closeTime")
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("Invalid time format (HH:mm)"),
];
