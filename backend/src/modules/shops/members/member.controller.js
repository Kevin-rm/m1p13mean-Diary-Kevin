import { ok } from "#utils/http/apiResponse.js";
import * as memberService from "./member.service.js";

export async function list(req, res) {
  const members = await memberService.list(req.user.shop);
  return ok(res, members);
}

export async function update(req, res) {
  const member = await memberService.update(req.params.memberId, req.user.shop, req.body);
  return ok(res, member, "Member updated");
}

export async function toggleActive(req, res) {
  const member = await memberService.toggleActive(req.params.memberId, req.user.shop);
  return ok(res, member, member.isActive ? "Member activated" : "Member deactivated");
}

export async function remove(req, res) {
  await memberService.remove(req.params.memberId, req.user.shop);
  return ok(res, null, "Member removed");
}
