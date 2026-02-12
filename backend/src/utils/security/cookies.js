import { accessTokenConfig, refreshTokenConfig } from "../../config/auth.js";

const isProduction = process.env.NODE_ENV === "production";

const ACCESS_COOKIE_NAME = "accessToken";
const ACCESS_COOKIE_PATH = "/";
const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_PATH = "/api/auth";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict",
};

export function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie(ACCESS_COOKIE_NAME, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: accessTokenConfig.maxAgeMs,
    path: ACCESS_COOKIE_PATH,
  });
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: refreshTokenConfig.maxAgeMs,
    path: REFRESH_COOKIE_PATH,
  });
}

export function clearAuthCookies(res) {
  res.clearCookie(ACCESS_COOKIE_NAME, { path: ACCESS_COOKIE_PATH });
  res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
}
