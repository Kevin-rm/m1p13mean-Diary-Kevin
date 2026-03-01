import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import accountRoutes from "./modules/account/account.routes.js";
import categoryRoutes from "./modules/catalog/category/category.routes.js";
import shopRoutes from "./modules/shops/shop.routes.js";
import productRoutes from "./modules/catalog/product/product.routes.js";
import promotionRoutes from "./modules/catalog/promotion/promotion.routes.js";
import stockMovementRoutes from "./modules/catalog/stock-movement/stock-movement.routes.js";
import cartRoutes from "./modules/orders/cart/cart.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";
import roleRoutes from "./modules/users/role.routes.js";
import { notFound } from "./utils/http/apiResponse.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { createRateLimiter } from "./utils/http/rateLimiter.js";

const app = express();

app.use(helmet());
app.use(createRateLimiter({ limit: 100 }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:4200", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/stock-movements", stockMovementRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/roles", roleRoutes);

app.use((_req, res) => notFound(res, "Route not found"));
app.use(errorHandler);

export default app;
