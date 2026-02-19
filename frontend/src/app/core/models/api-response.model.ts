export interface ApiResponse<T = unknown> {
  message: string;
  status: string;
  statusCode: number;
  timestamp: string;
  meta?: Record<string, unknown>;
  data?: T;
  error?: unknown;
}
