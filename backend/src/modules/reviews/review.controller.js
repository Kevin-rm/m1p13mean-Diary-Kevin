import { ok, created } from "#utils/http/apiResponse.js";
import * as reviewService from "./review.service.js";

export async function create(req, res) {
  const review = await reviewService.create(req.user.userId, req.body);
  return created(res, review, "Avis créé");
}

export async function getMyReview(req, res) {
  const review = await reviewService.getByUserAndShop(req.user.userId, req.params.shopId);
  return ok(res, review);
}

export async function listByShop(req, res) {
  const result = await reviewService.listByShop(req.params.id, req.query);
  return ok(res, result.data, undefined, result.meta);
}
