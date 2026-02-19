import { ok, created, badRequest, unauthorized } from "../../utils/http/apiResponse.js";
import { setAuthCookies, clearAuthCookies } from "../../utils/security/cookies.js";
import * as authService from "./auth.service.js";

export async function registerCustomer(req, res) {
  try {
    const result = await authService.registerCustomer(req.body);
    setAuthCookies(res, result);
    return created(res, { user: result.user, context: result.context }, "Registration successful");
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
    setAuthCookies(res, result);
    return created(
      res,
      { user: result.user, context: result.context, shop: result.shop },
      "Registration successful",
    );
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.email) return badRequest(res, "Email already in use");
      if (error.keyPattern?.name) return badRequest(res, "Shop name already taken");
    }
    throw error;
  }
}

export async function login(req, res) {
  const result = await authService.login(req.body);
  if (!result) return unauthorized(res, "Invalid email or password");

  setAuthCookies(res, result);
  return ok(res, { user: result.user, context: result.context }, "Login successful");
}

export async function logout(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) await authService.logout(refreshToken);
  clearAuthCookies(res);
  return ok(res, null, "Logged out");
}

export async function refresh(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return unauthorized(res, "No refresh token");

  try {
    const result = await authService.refresh(refreshToken);
    if (!result) return unauthorized(res, "Invalid refresh token");
    setAuthCookies(res, result);
    return ok(res, null, "Token refreshed");
  } catch {
    clearAuthCookies(res);
    return unauthorized(res, "Invalid or expired refresh token");
  }
}

export async function getMe(req, res) {
  const result = await authService.getMe(req.user.userId, req.user.contextId);
  if (!result) return unauthorized(res, "User not found");
  return ok(res, result);
}
