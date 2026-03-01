import multer, { MulterError } from "multer";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MB = 1024 * 1024;
const MAX_FILE_SIZE = 5 * MB;

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
  cb(new MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } });

export function singleImage(fieldName) {
  return upload.single(fieldName);
}

export function multipleImages(fieldName, maxCount = 5) {
  return upload.array(fieldName, maxCount);
}

export const MULTER_ERROR_MESSAGES = {
  LIMIT_FILE_SIZE: `File too large (max ${MAX_FILE_SIZE / MB} MB)`,
  LIMIT_FILE_COUNT: "Too many files",
  LIMIT_UNEXPECTED_FILE: "Invalid file type (accepted: JPEG, PNG, WebP)",
};
