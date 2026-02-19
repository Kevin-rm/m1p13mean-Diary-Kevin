import { Router } from "express";
import { validate } from "../../utils/http/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { updateProfileRules, changePasswordRules } from "./account.validators.js";
import * as accountController from "./account.controller.js";

const router = Router();

router.patch(
  "/profile",
  authenticate,
  validate(updateProfileRules),
  accountController.updateProfile,
);
router.patch(
  "/password",
  authenticate,
  validate(changePasswordRules),
  accountController.changePassword,
);

export default router;
