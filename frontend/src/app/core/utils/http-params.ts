export function buildQueryParams<T extends object>(params: T): Record<string, string> {
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") clean[k] = String(v);
  }
  return clean;
}
