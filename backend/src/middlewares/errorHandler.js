import { MulterError } from "multer";
import logger from "#config/logger.js";
import { apiResponse } from "#utils/http/apiResponse.js";
import { AppError } from "#utils/http/errors.js";
import { DuplicateKeyError } from "#utils/db/errors.js";
import { MULTER_ERROR_MESSAGES } from "#utils/upload/multer.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return apiResponse(res, err.statusCode, { message: err.message });
  }

  if (err instanceof DuplicateKeyError) {
    return apiResponse(res, 400, { message: err.message });
  }

  if (err instanceof MulterError) {
    return apiResponse(res, 400, {
      message: MULTER_ERROR_MESSAGES[err.code] || "File upload error",
    });
  }

  logger.error(err);
  return apiResponse(res, 500, { message: "Internal server error" });
}
