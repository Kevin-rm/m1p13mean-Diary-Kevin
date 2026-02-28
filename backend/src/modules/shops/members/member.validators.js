import { body } from "express-validator";
import { mongoIdRules } from "#utils/validators.js";

export const memberIdRules = [mongoIdRules("memberId")];

export const updateRules = [
  mongoIdRules("memberId"),
  body("roleId").isMongoId().withMessage("Invalid role"),
];
