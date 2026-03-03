import { ok, badRequest } from "#utils/http/apiResponse.js";
import { setAuthCookies } from "#utils/security/cookies.js";
import * as accountService from "./account.service.js";

export async function updateProfile(req, res) {
  const user = await accountService.updateProfile(req.user.userId, req.body);
  return ok(res, user, "Profile updated");
}

export async function updateAvatar(req, res) {
  if (!req.file) return badRequest(res, "No file provided");
  const user = await accountService.updateAvatar(req.user.userId, req.file);
  return ok(res, user, "Avatar updated");
}

export async function changePassword(req, res) {
  await accountService.changePassword(req.user.userId, req.body);
  return ok(res, null, "Password changed");
}

export async function listInvitations(req, res) {
  const invitations = await accountService.listInvitations(req.user.userId);
  return ok(res, invitations);
}

export async function acceptInvitation(req, res) {
  const { user, context, accessToken, refreshToken } = await accountService.acceptInvitation(
    req.params.id,
    req.user.userId,
  );
  setAuthCookies(res, { accessToken, refreshToken });
  return ok(res, { user, context }, "Invitation accepted");
}

export async function declineInvitation(req, res) {
  const invitation = await accountService.declineInvitation(req.params.id, req.user.userId);
  return ok(res, invitation, "Invitation declined");
}
