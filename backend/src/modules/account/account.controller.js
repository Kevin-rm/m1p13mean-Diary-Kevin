import { ok, badRequest, unauthorized } from "#utils/http/apiResponse.js";
import * as accountService from "./account.service.js";

export async function updateProfile(req, res) {
  const user = await accountService.updateProfile(req.user.userId, req.body);
  if (!user) return unauthorized(res, "User not found");
  return ok(res, user, "Profile updated");
}

export async function updateAvatar(req, res) {
  if (!req.file) return badRequest(res, "No file provided");
  const user = await accountService.updateAvatar(req.user.userId, req.file);
  if (!user) return unauthorized(res, "User not found");
  return ok(res, user, "Avatar updated");
}

export async function changePassword(req, res) {
  const result = await accountService.changePassword(req.user.userId, req.body);
  if (!result) return badRequest(res, "Current password is incorrect");
  return ok(res, null, "Password changed");
}
