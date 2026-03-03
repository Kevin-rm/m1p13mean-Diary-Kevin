import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";
import {
  listRules,
  getRules,
  createRules,
  updateRules,
  toggleActiveRules,
} from "./category.validators.js";
import * as categoryController from "./category.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("categories:read"), validate(listRules), categoryController.list);
router.get("/select", categoryController.select);
router.get("/:id", authorize("categories:read"), validate(getRules), categoryController.get);

router.post("/", authorize("categories:write"), validate(createRules), categoryController.create);

router.patch(
  "/:id",
  authorize("categories:write"),
  validate(updateRules),
  categoryController.update,
);

router.patch(
  "/:id/toggle-active",
  authorize("categories:write"),
  validate(toggleActiveRules),
  categoryController.toggleActive,
);

export default router;
