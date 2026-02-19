import logger from "../config/logger.js";
import { badRequest, internal } from "../utils/http/apiResponse.js";
import { DuplicateKeyError } from "../utils/db/errors.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof DuplicateKeyError) return badRequest(res, err.message);

  logger.error(err);
  return internal(res);
}
