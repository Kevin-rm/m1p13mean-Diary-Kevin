import { verifyAccessToken } from "../shared/utils/jwt.js";
import { unauthorized } from "../shared/utils/apiResponse.js";

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
