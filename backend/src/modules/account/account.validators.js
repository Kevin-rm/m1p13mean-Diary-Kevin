import { body } from "express-validator";
import { nameRules, passwordRules } from "#utils/validators.js";

export const updateProfileRules = [...nameRules];

export const changePasswordRules = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  passwordRules("newPassword"),
];
