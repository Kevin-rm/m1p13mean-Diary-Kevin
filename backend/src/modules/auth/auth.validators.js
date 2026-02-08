import { body } from "express-validator";

const baseRules = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export const buyerRegistrationRules = [...baseRules];

export const shopRegistrationRules = [
  ...baseRules,
  body("shopName").trim().notEmpty().withMessage("Shop name is required"),
  body("shopDescription").trim().notEmpty().withMessage("Shop description is required"),
];
