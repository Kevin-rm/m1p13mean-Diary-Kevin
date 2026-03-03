import { Router } from "express";
import { authenticate } from "#middlewares/authenticate.js";
import { validate } from "#utils/http/validate.js";
import { createRules, getMyReviewRules } from "./review.validators.js";
import * as reviewController from "./review.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", validate(createRules), reviewController.create);
router.get("/mine/:shopId", validate(getMyReviewRules), reviewController.getMyReview);

export default router;
