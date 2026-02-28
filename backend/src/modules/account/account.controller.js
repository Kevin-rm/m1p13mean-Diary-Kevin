import { ok, okOrNotFound, notFound, badRequest } from "#utils/http/apiResponse.js";
import { setAuthCookies } from "#utils/security/cookies.js";
import * as accountService from "./account.service.js";

export async function updateProfile(req, res) {
  const user = await accountService.updateProfile(req.user.userId, req.body);
  return okOrNotFound(res, user, { entityName: "User", message: "Profile updated" });
}

export async function updateAvatar(req, res) {
  if (!req.file) return badRequest(res, "No file provided");
  const user = await accountService.updateAvatar(req.user.userId, req.file);
  return okOrNotFound(res, user, { entityName: "User", message: "Avatar updated" });
}

export async function changePassword(req, res) {
  const result = await accountService.changePassword(req.user.userId, req.body);
  if (result.error === "not_found") return notFound(res, "User not found");
  if (result.error === "wrong_password") return badRequest(res, "Current password is incorrect");
  return ok(res, null, "Password changed");
}

export async function listInvitations(req, res) {
  const invitations = await accountService.listInvitations(req.user.userId);
  return ok(res, invitations);
}

export async function acceptInvitation(req, res) {
  const result = await accountService.acceptInvitation(req.params.id, req.user.userId);
  if (result.error === "not_found") return notFound(res, "Invitation not found");
  setAuthCookies(res, result.data);
  return ok(res, { user: result.data.user, context: result.data.context }, "Invitation accepted");
}

export async function declineInvitation(req, res) {
  const result = await accountService.declineInvitation(req.params.id, req.user.userId);
  if (result.error === "not_found") return notFound(res, "Invitation not found");
  return ok(res, result.data, "Invitation declined");
}
