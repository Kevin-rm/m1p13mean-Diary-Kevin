import { paginate } from "#utils/db/paginate.js";
import { NotFoundError, BadRequestError } from "#utils/http/errors.js";
import Shop from "#modules/shops/shop.model.js";
import Review from "./review.model.js";

const USER_POPULATE = { path: "user", select: "firstName lastName" };

export async function listByShop(shopId, { page, limit }) {
  return paginate(Review, {
    filter: { shop: shopId, status: "approved" },
    sort: { createdAt: -1 },
    page,
    limit,
    populate: USER_POPULATE,
  });
}

export async function getByUserAndShop(userId, shopId) {
  return Review.findOne({ user: userId, shop: shopId });
}

export async function create(userId, { shop, rating, comment }) {
  const activeShop = await Shop.findOne({ _id: shop, status: "active" });
  if (!activeShop) throw new NotFoundError(Shop.modelName);

  const existing = await Review.findOne({ user: userId, shop });
  if (existing) throw new BadRequestError("Vous avez déjà donné votre avis sur cette boutique");

  const review = await Review.create({
    user: userId,
    shop,
    rating,
    comment,
    status: "approved",
  });

  await updateShopRatingStats(shop);

  return review;
}

async function updateShopRatingStats(shopId) {
  const [result] = await Review.aggregate([
    { $match: { shop: shopId, status: "approved" } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  await Shop.findByIdAndUpdate(shopId, {
    averageRating: result ? Math.round(result.averageRating * 10) / 10 : 0,
    totalReviews: result?.totalReviews ?? 0,
  });
}
