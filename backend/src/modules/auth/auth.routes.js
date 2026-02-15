import { Router } from "express";
import { validate } from "../../utils/http/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { customerRegistrationRules, shopRegistrationRules, loginRules } from "./auth.validators.js";
import * as authController from "./auth.controller.js";

const router = Router();

router.post(
  "/register/customer",
  validate(customerRegistrationRules),
  authController.registerCustomer,
);
router.post("/register/shop", validate(shopRegistrationRules), authController.registerShop);
router.post("/login", validate(loginRules), authController.login);
router.get("/me", authenticate, authController.getMe);

export default router;
