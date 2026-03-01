import { paramIdRules, bodyIdRules } from "#utils/validators.js";

export const memberIdRules = [paramIdRules("memberId")];

export const updateRules = [paramIdRules("memberId"), bodyIdRules("roleId")];
