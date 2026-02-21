import { Router } from "express";
import { validate } from "../../utils/http/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import {
  listShopsRules,
  getShopRules,
  validateShopRules,
  suspendShopRules,
} from "./shop.validators.js";
import * as shopController from "./shop.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("shops:validate"), validate(listShopsRules), shopController.listShops);

router.get("/:id", authorize("shops:validate"), validate(getShopRules), shopController.getShop);

router.patch(
  "/:id/validate",
  authorize("shops:validate"),
  validate(validateShopRules),
  shopController.validateShop,
);

router.patch(
  "/:id/suspend",
  authorize("shops:suspend"),
  validate(suspendShopRules),
  shopController.suspendShop,
);

export default router;
