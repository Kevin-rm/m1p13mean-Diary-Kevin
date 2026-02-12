import { STATUS_CODES } from "http";

export const apiResponse = (res, statusCode, { message, data, error, meta } = {}) => {
  return res.status(statusCode).json({
    message,
    status: STATUS_CODES[statusCode],
    statusCode,
    timestamp: new Date().toISOString(),
    meta,
    data: statusCode < 400 ? data : undefined,
    error: statusCode >= 400 ? error : undefined,
  });
};

// Success
export const ok = (res, data, message, meta) => apiResponse(res, 200, { data, message, meta });
export const created = (res, data, message = "Resource created") =>
  apiResponse(res, 201, { data, message });

// Errors
export const badRequest = (res, message = "Bad request", error) =>
  apiResponse(res, 400, { message, error });
export const unauthorized = (res, message = "Unauthorized", error) =>
  apiResponse(res, 401, { message, error });
export const notFound = (res, message = "Resource not found", error) =>
  apiResponse(res, 404, { message, error });
export const internal = (res, message = "Internal server error", error) =>
  apiResponse(res, 500, { message, error });
