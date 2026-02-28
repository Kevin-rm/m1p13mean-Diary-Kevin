import { ok, notFound, badRequest } from "#utils/http/apiResponse.js";
import * as memberService from "./member.service.js";

export async function list(req, res) {
  const members = await memberService.list(req.user.shop);
  return ok(res, members);
}

export async function update(req, res) {
  const result = await memberService.update(req.params.memberId, req.user.shop, req.body);
  if (result.error === "not_found") return notFound(res, "Member not found");
  if (result.error === "owner_protected") return badRequest(res, "Cannot modify the owner");
  if (result.error === "invalid_role") return badRequest(res, "Invalid role");
  return ok(res, result.data, "Member updated");
}

export async function toggleActive(req, res) {
  const result = await memberService.toggleActive(req.params.memberId, req.user.shop);
  if (result.error === "not_found") return notFound(res, "Member not found");
  if (result.error === "owner_protected") return badRequest(res, "Cannot modify the owner");
  return ok(res, result.data, result.data.isActive ? "Member activated" : "Member deactivated");
}

export async function remove(req, res) {
  const result = await memberService.remove(req.params.memberId, req.user.shop);
  if (result.error === "not_found") return notFound(res, "Member not found");
  if (result.error === "owner_protected") return badRequest(res, "Cannot remove the owner");
  return ok(res, null, "Member removed");
}
