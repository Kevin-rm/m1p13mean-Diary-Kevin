import { body } from "express-validator";
import { emailRules, nameRules, passwordRules } from "#utils/validators.js";

const registrationRules = [...nameRules, emailRules(), passwordRules()];

export const customerRegistrationRules = [...registrationRules];

export const shopRegistrationRules = [
  ...registrationRules,
  body("shopName").trim().notEmpty().withMessage("Shop name is required"),
  body("shopDescription").trim().notEmpty().withMessage("Shop description is required"),
];

export const loginRules = [
  emailRules(),
  body("password").notEmpty().withMessage("Password is required"),
];
