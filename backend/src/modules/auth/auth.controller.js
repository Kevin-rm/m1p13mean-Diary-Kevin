import { ok, created, unauthorized } from "#utils/http/apiResponse.js";
import { setAuthCookies, clearAuthCookies } from "#utils/security/cookies.js";
import * as authService from "./auth.service.js";

export async function registerCustomer(req, res) {
  const { accessToken, refreshToken, ...data } = await authService.registerCustomer(req.body);
  setAuthCookies(res, { accessToken, refreshToken });
  return created(res, data, "Registration successful");
}

export async function registerShop(req, res) {
  const { accessToken, refreshToken, ...data } = await authService.registerShop(req.body);
  setAuthCookies(res, { accessToken, refreshToken });
  return created(res, data, "Registration successful");
}

export async function login(req, res) {
  const result = await authService.login(req.body);
  if (!result) return unauthorized(res, "Invalid email or password");

  const { accessToken, refreshToken, ...data } = result;
  setAuthCookies(res, { accessToken, refreshToken });
  return ok(res, data, "Login successful");
}

export async function logout(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    try {
      await authService.logout(refreshToken);
    } catch {
      // Intentionally ignored: cookies are cleared regardless
    }
  }
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
