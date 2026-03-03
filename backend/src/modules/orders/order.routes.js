import { Router } from "express";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";
import { validate } from "#utils/http/validate.js";
import {
  listRules,
  getRules,
  confirmRules,
  refuseRules,
  cancelRules,
  customerListRules,
  customerGetRules,
  checkoutRules,
} from "./order.validators.js";
import * as orderController from "./order.controller.js";

const router = Router();

router.use(authenticate);

// Stats (shop-scoped via stats:read, global via stats:global)
router.get("/stats", authorize("stats:read"), orderController.stats);

// Customer (authentication only — routes filter by req.user.userId)
router.get("/customer", validate(customerListRules), orderController.customerList);
router.post("/customer/checkout", validate(checkoutRules), orderController.customerCheckout);
router.get("/customer/:id", validate(customerGetRules), orderController.customerGet);

// Shop-side
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
