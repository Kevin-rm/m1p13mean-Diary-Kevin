import { ok, notFound, badRequest } from "#utils/http/apiResponse.js";
import * as invitationService from "./invitation.service.js";

export async function list(req, res) {
  const invitations = await invitationService.listByShop(req.user.shop);
  return ok(res, invitations);
}

export async function invite(req, res) {
  const result = await invitationService.invite(req.user.shop, req.body, req.user.userId);
  if (result.error === "user_not_found") return notFound(res, "User not found");
  if (result.error === "already_member") return badRequest(res, "User is already a member");
  if (result.error === "already_invited") return badRequest(res, "Invitation already pending");
  if (result.error === "invalid_role") return badRequest(res, "Invalid role");
  return ok(res, result.data, "Invitation sent");
}

export async function cancel(req, res) {
  const result = await invitationService.cancel(req.params.id, req.user.shop);
  if (result.error === "not_found") return notFound(res, "Invitation not found");
  return ok(res, result.data, "Invitation cancelled");
}
