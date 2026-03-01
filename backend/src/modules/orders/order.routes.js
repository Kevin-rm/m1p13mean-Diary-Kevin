import { authenticate } from "#middlewares/authenticate.js";
import { validate } from "#utils/http/validate.js";
import { Router } from "express";
import {
  listOrdersRules,
  getOrderRules,
  confirmOrderRules,
  refuseOrderRules,
  cancelOrderRules,
} from "./order.validators";
import * as orderController from "./order.controller.js";
import { authorize } from "#middlewares/authorize.js";

const router = Router();
router.use(authenticate);

router.get("/", validate(listOrdersRules), orderController.listOrders);
router.get("/:id", authorize("shop:settings"), validate(getOrderRules), orderController.getOrder);
router.patch(
  "/:id/confirm",
  authorize("shops:validate"),
  validate(confirmOrderRules),
  orderController.confirmOrder,
);

router.patch(
  "/:id/suspend",
  authorize("shops:suspend"),
  validate(refuseOrderRules),
  orderController.refuseOrder,
);

router.patch(
  "/:id/cancel",
  authorize("shops:suspend"),
  validate(cancelOrderRules),
  orderController.cancelOrder,
);

export default router;
