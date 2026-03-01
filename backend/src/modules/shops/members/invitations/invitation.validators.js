import { paramIdRules, bodyIdRules, emailRules } from "#utils/validators.js";

export const createRules = [emailRules(), bodyIdRules("roleId")];

export const cancelRules = [paramIdRules()];
