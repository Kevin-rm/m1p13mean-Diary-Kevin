export function pickDefined(source, fields) {
  const result = {};
  for (const field of fields) {
    if (source[field] !== undefined) result[field] = source[field];
  }
  return result;
}

export const err = code => ({ error: code });
export const success = data => ({ data });

export const activeLabel = isActive => (isActive ? "activated" : "deactivated");
