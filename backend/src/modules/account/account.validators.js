import { body } from "express-validator";
import { nameRules, passwordRules } from "../../utils/validators.js";

export const updateProfileRules = [
  ...nameRules,
  body("avatarUrl")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Avatar URL must be a valid URL"),
];

export const changePasswordRules = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  passwordRules("newPassword"),
];
