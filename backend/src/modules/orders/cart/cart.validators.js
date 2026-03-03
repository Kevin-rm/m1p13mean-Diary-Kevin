import { body } from "express-validator";

export const addItemRules = [
  body("productId")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid product id"),
  body("shopId")
    .notEmpty()
    .withMessage("Shop is required")
    .isMongoId()
    .withMessage("Invalid shop id"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer")
    .toInt(),
];

export const removeItemRules = [
  body("productId")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid product id"),
  body("shopId")
    .notEmpty()
    .withMessage("Shop is required")
    .isMongoId()
    .withMessage("Invalid shop id"),
];
