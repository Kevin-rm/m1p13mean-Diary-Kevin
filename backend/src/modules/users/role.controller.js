import { ok } from "#utils/http/apiResponse.js";
import * as roleService from "./role.service.js";

export async function select(_req, res) {
  const roles = await roleService.select();
  return ok(res, roles);
}
