import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { authenticate } from "#middlewares/authenticate.js";
import { singleImage, handleMulterError } from "#utils/upload/multer.js";
import { mongoIdRules } from "#utils/validators.js";
import { updateProfileRules, changePasswordRules } from "./account.validators.js";
import * as accountController from "./account.controller.js";

const router = Router();

router.use(authenticate);

router.patch("/profile", validate(updateProfileRules), accountController.updateProfile);
router.patch("/avatar", singleImage("avatar"), handleMulterError, accountController.updateAvatar);
router.patch("/password", validate(changePasswordRules), accountController.changePassword);

router.get("/invitations", accountController.listInvitations);
router.post(
  "/invitations/:id/accept",
  validate([mongoIdRules()]),
  accountController.acceptInvitation,
);
router.post(
  "/invitations/:id/decline",
  validate([mongoIdRules()]),
  accountController.declineInvitation,
);

export default router;
