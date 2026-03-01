import { ok } from "#utils/http/apiResponse.js";
import * as invitationService from "./invitation.service.js";

export async function list(req, res) {
  const invitations = await invitationService.listByShop(req.user.shop);
  return ok(res, invitations);
}

export async function invite(req, res) {
  const invitation = await invitationService.invite(req.user.shop, req.body, req.user.userId);
  return ok(res, invitation, "Invitation sent");
}

export async function cancel(req, res) {
  const invitation = await invitationService.cancel(req.params.id, req.user.shop);
  return ok(res, invitation, "Invitation cancelled");
}
