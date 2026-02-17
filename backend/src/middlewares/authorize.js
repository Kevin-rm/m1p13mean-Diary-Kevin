import UserContext from "../modules/users/userContext.model.js";
import { forbidden } from "../utils/http/apiResponse.js";

export function authorize(...requiredPermissions) {
  return async (req, res, next) => {
    const context = await UserContext.findById(req.user.contextId).populate("profile");
    if (!context) return forbidden(res, "No active context found");

    const userPermissions = context.profile.permissions ?? [];
    const hasAll = requiredPermissions.every(p => userPermissions.includes(p));
    if (!hasAll) return forbidden(res, "Insufficient permissions");

    req.context = context;
    next();
  };
}
