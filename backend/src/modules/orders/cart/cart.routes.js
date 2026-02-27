import { Router } from "express";
import { authenticate } from "#middlewares/authenticate.js";
import { validate } from "#utils/http/validate.js";
import * as cartController from "./cart.controller.js";
import { addItemCartRules, removeItemCartRules } from "./cart.validators.js";

const router = Router();
router.use(authenticate);
router.get("/", cartController.getCart);

router.post("/add", validate(addItemCartRules), cartController.addItemCart);

router.post("/remove", validate(removeItemCartRules), cartController.removeItemCart);

router.post("/validate", cartController.validateCart);

export default router;
