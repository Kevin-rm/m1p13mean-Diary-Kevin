import { HttpErrorResponse } from "@angular/common/http";
import { ApiResponse } from "../models/api-response";

export function extractErrorMessage(
  error: HttpErrorResponse,
  fallback = "Une erreur est survenue",
): string {
  const body = error.error as ApiResponse;
  return body?.message || fallback;
}
