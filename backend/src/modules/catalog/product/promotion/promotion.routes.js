import { Router } from "express";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";
import { validate } from "#utils/http/validate.js";
import {
  listRules,
  getRules,
  createRules,
  updateRules,
  toggleActiveRules,
} from "./promotion.validators.js";
import * as promotionController from "./promotion.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("products:read"), validate(listRules), promotionController.list);
router.get("/:id", authorize("products:read"), validate(getRules), promotionController.get);
router.post("/", authorize("products:write"), validate(createRules), promotionController.create);
router.patch(
  "/:id",
  authorize("products:write"),
  validate(updateRules),
  promotionController.update,
);
router.patch(
  "/:id/toggle-active",
  authorize("products:write"),
  validate(toggleActiveRules),
  promotionController.toggleActive,
);

export default router;
