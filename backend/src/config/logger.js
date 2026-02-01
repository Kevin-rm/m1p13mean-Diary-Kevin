import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const baseFormat = combine(
  errors({ stack: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(
    ({ level, message, timestamp, stack }) =>
      `${timestamp} [${level}]: ${message}${stack ? `\n${stack}` : ""}`,
  ),
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: baseFormat,
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), baseFormat),
    }),
  ],
});

if (process.env.NODE_ENV === "production") {
  logger.add(new winston.transports.File({ filename: "logs/error.log", level: "error" }));
  logger.add(new winston.transports.File({ filename: "logs/combined.log" }));
}

export default logger;
