import { body } from "express-validator";
import { mongoIdRules, emailRules } from "#utils/validators.js";

export const inviteRules = [emailRules(), body("roleId").isMongoId().withMessage("Invalid role")];

export const invitationIdRules = [mongoIdRules()];
