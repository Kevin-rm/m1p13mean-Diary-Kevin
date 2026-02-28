import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { authorize } from "#middlewares/authorize.js";
import { memberIdRules, updateRules } from "./member.validators.js";
import * as memberController from "./member.controller.js";
import invitationRoutes from "./invitations/invitation.routes.js";

const router = Router();

router.get("/", authorize("members:read"), memberController.list);
router.patch(
  "/:memberId",
  authorize("members:manage"),
  validate(updateRules),
  memberController.update,
);
router.patch(
  "/:memberId/toggle-active",
  authorize("members:manage"),
  validate(memberIdRules),
  memberController.toggleActive,
);
router.delete(
  "/:memberId",
  authorize("members:manage"),
  validate(memberIdRules),
  memberController.remove,
);

router.use("/invitations", invitationRoutes);

export default router;
