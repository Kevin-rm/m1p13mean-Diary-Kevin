import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";
import { multipleImages, handleMulterError } from "#utils/upload/multer.js";
import {
  listProductsRules,
  getProductRules,
  createProductRules,
  updateProductRules,
  toggleActiveRules,
  removeImageRules,
} from "./product.validators.js";
import * as productController from "./product.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("products:read"),
  validate(listProductsRules),
  productController.listProducts,
);

router.get(
  "/:id",
  authorize("products:read"),
  validate(getProductRules),
  productController.getProduct,
);

router.post(
  "/",
  authorize("products:write"),
  multipleImages("images", 5),
  handleMulterError,
  validate(createProductRules),
  productController.createProduct,
);

router.patch(
  "/:id",
  authorize("products:write"),
  validate(updateProductRules),
  productController.updateProduct,
);

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
  handleMulterError,
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
