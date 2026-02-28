import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { authenticate } from "#middlewares/authenticate.js";
import { createRateLimiter } from "#utils/http/rateLimiter.js";
import { customerRegistrationRules, shopRegistrationRules, loginRules } from "./auth.validators.js";
import * as authController from "./auth.controller.js";

const router = Router();

const authLimiter = createRateLimiter({
  limit: 10,
  message: "Too many attempts, please try again later",
});

router.post(
  "/register/customer",
  authLimiter,
  validate(customerRegistrationRules),
  authController.registerCustomer,
);
router.post(
  "/register/shop",
  authLimiter,
  validate(shopRegistrationRules),
  authController.registerShop,
);
router.post("/login", authLimiter, validate(loginRules), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);
router.get("/me", authenticate, authController.getMe);

export default router;
