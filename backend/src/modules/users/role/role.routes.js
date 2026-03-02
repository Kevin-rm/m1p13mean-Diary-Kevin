import { Router } from "express";
import { authenticate } from "#middlewares/authenticate.js";
import * as roleController from "./role.controller.js";

const router = Router();

router.use(authenticate);

router.get("/select", roleController.select);

export default router;
