import { Router } from "express";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";
import { validate } from "#utils/http/validate.js";

import {
  listPromotionsRules,
  getPromotionRules,
  createPromotionRules,
  updatePromotionRules,
  toggleActiveRules,
} from "./promotion.validators.js";

import * as promotionController from "./promotion.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", validate(listPromotionsRules), promotionController.listPromotions);

router.get(
  "/:id",
  authorize("shop:settings"),
  validate(getPromotionRules),
  promotionController.getPromotion,
);

router.post(
  "/",
  authorize("shop:settings"),
  validate(createPromotionRules),
  promotionController.createPromotion,
);

router.patch(
  "/:id",
  authorize("shop:settings"),
  validate(updatePromotionRules),
  promotionController.updatePromotion,
);

router.patch(
  "/:id/toggle-active",
  authorize("promotions:write"),
  validate(toggleActiveRules),
  promotionController.toggleActive,
);

export default router;
