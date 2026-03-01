import { Router } from "express";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";
import { validate } from "#utils/http/validate.js";
import { listRules, getRules, confirmRules, refuseRules, cancelRules } from "./order.validators.js";
import * as orderController from "./order.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("orders:read"), validate(listRules), orderController.list);
router.get("/:id", authorize("orders:read"), validate(getRules), orderController.get);
router.patch(
  "/:id/confirm",
  authorize("orders:manage"),
  validate(confirmRules),
  orderController.confirm,
);
router.patch(
  "/:id/refuse",
  authorize("orders:manage"),
  validate(refuseRules),
  orderController.refuse,
);
router.patch(
  "/:id/cancel",
  authorize("orders:manage"),
  validate(cancelRules),
  orderController.cancel,
);

export default router;
