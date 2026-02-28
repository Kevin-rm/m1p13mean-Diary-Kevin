import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { authorize } from "#middlewares/authorize.js";
import { inviteRules, invitationIdRules } from "./invitation.validators.js";
import * as invitationController from "./invitation.controller.js";

const router = Router();

router.post("/", authorize("members:manage"), validate(inviteRules), invitationController.invite);
router.get("/", authorize("members:read"), invitationController.list);
router.delete(
  "/:id",
  authorize("members:manage"),
  validate(invitationIdRules),
  invitationController.cancel,
);

export default router;
