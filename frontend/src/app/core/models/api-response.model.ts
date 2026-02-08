export interface ApiResponse<T = unknown> {
  message: string;
  status: string;
  statusCode: number;
  timestamp: string;
  data?: T;
  error?: unknown;
}
