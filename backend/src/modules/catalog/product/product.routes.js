import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";
import { multipleImages } from "#utils/upload/multer.js";
import {
  listRules,
  getRules,
  createRules,
  updateRules,
  toggleActiveRules,
  removeImageRules,
} from "./product.validators.js";
import * as productController from "./product.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("products:read"), validate(listRules), productController.list);

router.get("/select", authorize("products:read"), productController.select);

router.get("/stats", authorize("products:read"), productController.stats);

router.get("/:id", authorize("products:read"), validate(getRules), productController.get);

router.post(
  "/",
  authorize("products:write"),
  multipleImages("images", 5),
  validate(createRules),
  productController.create,
);

router.patch("/:id", authorize("products:write"), validate(updateRules), productController.update);

router.patch(
  "/:id/toggle-active",
  authorize("products:write"),
  validate(toggleActiveRules),
  productController.toggleActive,
);

router.post(
  "/:id/images",
  authorize("products:write"),
  multipleImages("images", 5),
  validate(removeImageRules),
  productController.addImages,
);

router.delete(
  "/:id/images",
  authorize("products:write"),
  validate(removeImageRules),
  productController.removeImage,
);

export default router;
