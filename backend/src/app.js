import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import accountRoutes from "./modules/account/account.routes.js";
import categoryRoutes from "./modules/catalog/category/category.routes.js";
import { notFound } from "./utils/http/apiResponse.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { MS_PER_MINUTE } from "./utils/constants.js";

const app = express();

app.use(helmet());
app.use(hpp());
app.use(mongoSanitize());
app.use(
  rateLimit({
    windowMs: 15 * MS_PER_MINUTE,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:4200", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/categories", categoryRoutes);

app.use((_req, res) => notFound(res, "Route not found"));
app.use(errorHandler);

export default app;
