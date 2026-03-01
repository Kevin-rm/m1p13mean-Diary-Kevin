import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";
import { listRules, getRules, createRules } from "./stock-movement.validators.js";
import * as stockMovementController from "./stock-movement.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("products:read"), validate(listRules), stockMovementController.list);
router.get("/:id", authorize("products:read"), validate(getRules), stockMovementController.get);
router.post(
  "/",
  authorize("products:write"),
  validate(createRules),
  stockMovementController.create,
);

export default router;
