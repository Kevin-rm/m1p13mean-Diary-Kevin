import { validationResult } from "express-validator";
import { badRequest } from "./apiResponse.js";

export function validate(rules) {
  return async (req, res, next) => {
    await Promise.all(rules.map(rule => rule.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const details = errors.array().map(({ path, msg }) => ({ field: path, message: msg }));
    return badRequest(res, "Validation failed", details);
  };
}
