import { MS_PER_SECOND } from "#utils/constants.js";

const encoder = new TextEncoder();

const accessExpiry = Number(process.env.JWT_ACCESS_EXPIRY) || 900;
const refreshExpiry = Number(process.env.JWT_REFRESH_EXPIRY) || 604800;

export const accessTokenConfig = {
  secret: encoder.encode(process.env.JWT_ACCESS_SECRET),
  expiry: accessExpiry,
  maxAgeMs: accessExpiry * MS_PER_SECOND,
};

export const refreshTokenConfig = {
  secret: encoder.encode(process.env.JWT_REFRESH_SECRET),
  expiry: refreshExpiry,
  maxAgeMs: refreshExpiry * MS_PER_SECOND,
};
