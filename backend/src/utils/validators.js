import { body, param, query } from "express-validator";

// Auth
export const emailRules = (field = "email") =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail();

export const nameRules = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
];

export const passwordRules = (field = "password") =>
  body(field)
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters");

// List queries
export const searchRule = query("search").optional().trim();

export const isActiveRule = query("isActive")
  .optional()
  .isBoolean()
  .withMessage("isActive must be a boolean")
  .toBoolean();

export const paginationRules = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer").toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
];

// Common
export const mongoIdRules = (paramName = "id") =>
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`);

export const resourceNameRules = label => {
  const base = chain => chain.trim().notEmpty();
  return {
    required: base(body("name")).withMessage(`${label} is required`),
    optional: base(body("name").optional()).withMessage(`${label} cannot be empty`),
  };
};

export const descriptionRule = body("description").optional().trim();
