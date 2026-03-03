import { HttpErrorResponse } from "@angular/common/http";
import { ApiResponse } from "../common/models/api-response";

export function extractErrorMessage(error: unknown, fallback = "Une erreur est survenue"): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as ApiResponse;
    return body?.message || fallback;
  }
  return fallback;
}
