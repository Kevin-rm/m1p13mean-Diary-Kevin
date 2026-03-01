import { Router } from "express";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";
import { validate } from "#utils/http/validate.js";
import { addItemRules, removeItemRules } from "./cart.validators.js";
import * as cartController from "./cart.controller.js";

const router = Router();

router.use(authenticate, authorize("cart:manage"));

router.get("/", cartController.get);
router.post("/add", validate(addItemRules), cartController.addItem);
router.post("/remove", validate(removeItemRules), cartController.removeItem);
router.post("/validate", cartController.validate);

export default router;
