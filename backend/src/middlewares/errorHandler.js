import logger from "../config/logger.js";
import { internal } from "../utils/http/apiResponse.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err, _req, res, _next) {
  logger.error(err);
  return internal(res);
}
