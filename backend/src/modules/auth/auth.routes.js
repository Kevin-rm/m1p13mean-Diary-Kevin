import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "#utils/http/validate.js";
import { authenticate } from "#middlewares/authenticate.js";
import { MS_PER_MINUTE } from "#utils/constants.js";
import { customerRegistrationRules, shopRegistrationRules, loginRules } from "./auth.validators.js";
import * as authController from "./auth.controller.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * MS_PER_MINUTE,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Trop de tentatives, veuillez réessayer plus tard" },
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
