import { verifyAccessToken } from "#utils/security/jwt.js";
import { unauthorized } from "#utils/http/apiResponse.js";

export async function authenticate(req, res, next) {
  const token = req.cookies?.accessToken;
  if (!token) return unauthorized(res, "Authentication required");

  try {
    req.user = await verifyAccessToken(token);
    next();
  } catch {
    return unauthorized(res, "Invalid or expired token");
  }
}
