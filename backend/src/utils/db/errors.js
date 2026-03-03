const MONGO_DUPLICATE_KEY = 11000;

export class DuplicateKeyError extends Error {
  constructor(message) {
    super(message);
    this.name = "DuplicateKeyError";
  }
}

export function throwIfDuplicateKey(error, fieldMessages) {
  if (error.code === MONGO_DUPLICATE_KEY) {
    const field = Object.keys(error.keyPattern ?? {})[0];
    const message = fieldMessages[field];
    if (message) throw new DuplicateKeyError(message);
  }
  throw error;
}
