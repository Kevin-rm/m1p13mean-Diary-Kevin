import { Router } from "express";
import { validate } from "#utils/http/validate.js";
import { authenticate } from "#middlewares/authenticate.js";
import { authorize } from "#middlewares/authorize.js";
import { listRules, getRules, createRules } from "./stockmovement.validators.js";
import * as stockController from "./stockmovement.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("products:read"), validate(listRules), stockController.list);
router.get("/:id", authorize("products:read"), validate(getRules), stockController.get);
router.post("/", authorize("products:write"), validate(createRules), stockController.create);

export default router;
