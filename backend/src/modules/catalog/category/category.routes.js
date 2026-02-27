import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";
import {
  listCategoriesRules,
  getCategoryRules,
  createCategoryRules,
  updateCategoryRules,
  toggleActiveRules,
} from "./category.validators.js";
import * as categoryController from "./category.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("categories:read"),
  validate(listCategoriesRules),
  categoryController.listCategories,
);
router.get("/select", categoryController.selectCategories);
router.get(
  "/:id",
  authorize("categories:read"),
  validate(getCategoryRules),
  categoryController.getCategory,
);

router.post(
  "/",
  authorize("categories:write"),
  validate(createCategoryRules),
  categoryController.createCategory,
);

router.patch(
  "/:id",
  authorize("categories:write"),
  validate(updateCategoryRules),
  categoryController.updateCategory,
);

router.patch(
  "/:id/toggle-active",
  authorize("categories:write"),
  validate(toggleActiveRules),
  categoryController.toggleActive,
);

export default router;
