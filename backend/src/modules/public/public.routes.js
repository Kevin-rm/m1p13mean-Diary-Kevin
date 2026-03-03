import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { ok } from "#utils/http/apiResponse.js";
import * as rules from "./public.validators.js";
import * as service from "./public.service.js";
import * as reviewController from "#modules/reviews/review.controller.js";
import { shopReviewsRules } from "#modules/reviews/review.validators.js";

const router = Router();

// Shops
router.get("/shops", validate(rules.listShopsRules), async (req, res) => {
  const result = await service.listShops(req.query);
  return ok(res, result.data, undefined, result.meta);
});

router.get("/shops/:id", validate(rules.getByIdRules), async (req, res) => {
  const shop = await service.getShop(req.params.id);
  return ok(res, shop);
});

router.get("/shops/:id/reviews", validate(shopReviewsRules), reviewController.listByShop);

router.get("/shops/:id/products", validate(rules.shopProductsRules), async (req, res) => {
  const result = await service.listShopProducts(req.params.id, req.query);
  return ok(res, result.data, undefined, result.meta);
});

// Products
router.get("/products", validate(rules.listProductsRules), async (req, res) => {
  const result = await service.listProducts(req.query);
  return ok(res, result.data, undefined, result.meta);
});

router.get("/products/:id", validate(rules.getByIdRules), async (req, res) => {
  const product = await service.getProduct(req.params.id);
  return ok(res, product);
});

// Categories
router.get("/categories", async (_req, res) => {
  const categories = await service.listCategories();
  return ok(res, categories);
});

export default router;
