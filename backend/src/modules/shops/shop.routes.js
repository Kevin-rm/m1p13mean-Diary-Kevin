import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";
import { singleImage, multipleImages, handleMulterError } from "#utils/upload/multer.js";
import {
  listRules,
  getRules,
  updateRules,
  validateRules,
  suspendRules,
} from "./shop.validators.js";
import * as shopController from "./shop.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", validate(listRules), shopController.list);

const meRouter = Router();
meRouter.use(authorize("shops:manage"), shopController.resolveMyShop);
meRouter.get("/", shopController.get);
meRouter.patch("/", validate(updateRules), shopController.update);
meRouter.post("/logo", singleImage("logo"), handleMulterError, shopController.setLogo);
meRouter.post("/images", multipleImages("images", 5), handleMulterError, shopController.addImages);
meRouter.delete("/images", shopController.removeImage);
router.use("/me", meRouter);

router.get("/:id", validate(getRules), shopController.get);

router.patch(
  "/:id/validate",
  authorize("shops:validate"),
  validate(validateRules),
  shopController.validateStatus,
);

router.patch(
  "/:id/suspend",
  authorize("shops:suspend"),
  validate(suspendRules),
  shopController.suspend,
);

export default router;
