import { body } from "express-validator";

export const addItemCartRules = [
  body("productId")
    .exists()
    .isMongoId()
    .withMessage("productId is required and must be a valid ID"),
  body("shopId").exists().isMongoId().withMessage("shopId is required and must be a valid ID"),
  body("quantity").optional().isInt({ min: 1 }).withMessage("quantity must be a positive integer"),
];

export const removeItemCartRules = [
  body("productId")
    .exists()
    .isMongoId()
    .withMessage("productId is required and must be a valid ID"),
  body("shopId").exists().isMongoId().withMessage("shopId is required and must be a valid ID"),
];
