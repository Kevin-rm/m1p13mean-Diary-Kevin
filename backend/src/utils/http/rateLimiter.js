import rateLimit from "express-rate-limit";
import { MS_PER_MINUTE } from "#utils/constants.js";

export function createRateLimiter({ windowMs = 15 * MS_PER_MINUTE, limit, message } = {}) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    ...(message && { message: { message } }),
  });
}
