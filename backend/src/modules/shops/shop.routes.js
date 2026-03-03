import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";
import { singleImage, multipleImages } from "#utils/upload/multer.js";
import {
  listRules,
  getRules,
  updateRules,
  validateRules,
  suspendRules,
} from "./shop.validators.js";
import * as shopController from "./shop.controller.js";
import memberRoutes from "./members/member.routes.js";

const router = Router();

router.use(authenticate);

router.get("/", validate(listRules), shopController.list);
router.get("/stats", authorize("stats:global"), shopController.stats);

const meRouter = Router();
meRouter.use(authorize("shops:manage"), (req, _res, next) => {
  req.resolvedId = req.user.shop;
  next();
});
meRouter.get("/", shopController.get);
meRouter.patch("/", validate(updateRules), shopController.update);
meRouter.post("/logo", singleImage("logo"), shopController.setLogo);
meRouter.post("/images", multipleImages("images", 5), shopController.addImages);
meRouter.delete("/images", shopController.removeImage);
router.use("/me", meRouter);

router.use("/me/members", memberRoutes);

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
