import { created, badRequest } from "../../shared/utils/apiResponse.js";
import * as authService from "./auth.service.js";

export async function registerBuyer(req, res) {
  try {
    const result = await authService.registerBuyer(req.body);
    return created(res, result, "Registration successful");
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return badRequest(res, "Email already in use");
    }
    throw error;
  }
}

export async function registerShop(req, res) {
  try {
    const result = await authService.registerShop(req.body);
    return created(res, result, "Registration successful");
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.email) return badRequest(res, "Email already in use");
      if (error.keyPattern?.name) return badRequest(res, "Shop name already taken");
    }
    throw error;
  }
}
