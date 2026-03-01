import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";

import {
  listStockMovementsRules,
  getStockMovementRules,
  createStockMovementRules,
} from "./stockmovement.validators.js";

import * as stockController from "./stockmovement.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("shop:settings"),
  validate(listStockMovementsRules),
  stockController.listStockMovements,
);

router.get(
  "/:id",
  authorize("shop:settings"),
  validate(getStockMovementRules),
  stockController.getStockMovement,
);

router.post(
  "/",
  authorize("shop:settings"),
  validate(createStockMovementRules),
  stockController.createStockMovement,
);

export default router;
