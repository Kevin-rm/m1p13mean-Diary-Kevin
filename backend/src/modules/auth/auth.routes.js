import { Router } from "express";
import { validate } from "../../shared/utils/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { buyerRegistrationRules, shopRegistrationRules, loginRules } from "./auth.validators.js";
import * as authController from "./auth.controller.js";

const router = Router();

router.post("/register/buyer", validate(buyerRegistrationRules), authController.registerBuyer);
router.post("/register/shop", validate(shopRegistrationRules), authController.registerShop);
router.post("/login", validate(loginRules), authController.login);
router.get("/me", authenticate, authController.getMe);

export default router;
