import { SignJWT, jwtVerify } from "jose";
import { accessTokenConfig, refreshTokenConfig } from "#config/auth.js";
import { MS_PER_SECOND } from "../constants.js";

function sign(payload, config) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(Math.floor(Date.now() / MS_PER_SECOND) + config.expiry)
    .sign(config.secret);
}

async function verify(token, config) {
  const { payload } = await jwtVerify(token, config.secret);
  return payload;
}

export function generateAccessToken(payload) {
  return sign(payload, accessTokenConfig);
}

export function generateRefreshToken(payload) {
  return sign(payload, refreshTokenConfig);
}

export function verifyAccessToken(token) {
  return verify(token, accessTokenConfig);
}

export function verifyRefreshToken(token) {
  return verify(token, refreshTokenConfig);
}
