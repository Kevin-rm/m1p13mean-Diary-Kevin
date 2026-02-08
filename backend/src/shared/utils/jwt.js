import { SignJWT, jwtVerify } from "jose";

const accessSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

const accessExpiry = process.env.JWT_ACCESS_EXPIRY || "15m";
const refreshExpiry = process.env.JWT_REFRESH_EXPIRY || "7d";

export async function generateAccessToken({ userId, contextId, profileCode }) {
  return new SignJWT({ userId, contextId, profileCode })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(accessExpiry)
    .sign(accessSecret);
}

export async function generateRefreshToken({ userId, contextId }) {
  return new SignJWT({ userId, contextId, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(refreshExpiry)
    .sign(refreshSecret);
}

export async function verifyAccessToken(token) {
  const { payload } = await jwtVerify(token, accessSecret);
  return payload;
}

export async function verifyRefreshToken(token) {
  const { payload } = await jwtVerify(token, refreshSecret);
  return payload;
}

export async function getRefreshTokenExpiryDate(token) {
  const { payload } = await jwtVerify(token, refreshSecret);
  return new Date(payload.exp * 1000);
}
