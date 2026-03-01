import { paramIdRules, bodyIdRules, emailRules } from "#utils/validators.js";

export const inviteRules = [emailRules(), bodyIdRules("roleId")];

export const invitationIdRules = [paramIdRules()];
