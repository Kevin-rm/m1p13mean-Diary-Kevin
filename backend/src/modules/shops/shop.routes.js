import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";
import { singleImage, handleMulterError } from "#utils/upload/multer.js";
import {
  listShopsRules,
  getShopRules,
  updateMyShopRules,
  validateShopRules,
  suspendShopRules,
} from "./shop.validators.js";
import * as shopController from "./shop.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", validate(listShopsRules), shopController.listShops);
router.get("/me", authorize("shop:settings"), shopController.getMyShop);
router.patch(
  "/me",
  authorize("shop:settings"),
  validate(updateMyShopRules),
  shopController.updateMyShop,
);
router.post(
  "/me/logo",
  authorize("shop:settings"),
  singleImage("logo"),
  handleMulterError,
  shopController.setMyShopLogo,
);
router.post(
  "/me/image",
  authorize("shop:settings"),
  singleImage("shopImage"),
  handleMulterError,
  shopController.addMyShopImage,
);

router.get("/:id", validate(getShopRules), shopController.getShop);
router.post(
  "/:id/image",
  authorize("shop:settings"),
  singleImage("shopImage"),
  handleMulterError,
  shopController.addShopImage,
);

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
