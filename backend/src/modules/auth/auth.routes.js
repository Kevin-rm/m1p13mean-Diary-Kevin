import { Router } from "express";
import { validate } from "../../shared/utils/validate.js";
import { buyerRegistrationRules, shopRegistrationRules } from "./auth.validators.js";
import * as authController from "./auth.controller.js";

const router = Router();

router.post("/register/buyer", validate(buyerRegistrationRules), authController.registerBuyer);
router.post("/register/shop", validate(shopRegistrationRules), authController.registerShop);

export default router;
