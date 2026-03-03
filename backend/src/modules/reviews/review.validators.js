import { body } from "express-validator";
import { bodyIdRules, paramIdRules, paginationRules } from "#utils/validators.js";

export const createRules = [
  bodyIdRules("shop"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Comment too long"),
];

export const getMyReviewRules = [paramIdRules("shopId")];

export const shopReviewsRules = [paramIdRules(), ...paginationRules];
