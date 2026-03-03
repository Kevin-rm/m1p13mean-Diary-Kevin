import { forbidden } from "#utils/http/apiResponse.js";

export function authorize(...requiredPermissions) {
  return (req, res, next) => {
    const userPermissions = req.user.permissions ?? [];
    const hasAll = requiredPermissions.every(p => userPermissions.includes(p));
    if (!hasAll) return forbidden(res, "Insufficient permissions");

    next();
  };
}
