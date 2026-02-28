import Promotion from "./promotion.model.js";
import Product from "../product/product.model.js";
import { paginate } from "#utils/db/paginate.js";
import { err, success } from "#utils/objects.js";

export async function listPromotions({ shop, product, isActive, page, limit }) {
  const filter = { shop };
  if (product) filter.product = product;
  if (isActive !== undefined) filter.isActive = isActive;

  return paginate(Promotion, {
    filter,
    page,
    limit,
    populate: { path: "product", select: "name price" },
  });
}

export async function getPromotionById(id, shop) {
  return Promotion.findOne({ _id: id, shop }).populate("product", "name price");
}

export async function createPromotion(data, shop) {
  const { productId, type, value, startDate, endDate } = data;

  const product = await Product.findOne({ _id: productId, shop });
  if (!product) return err("not_found");

  if (endDate <= startDate) return err("invalid_dates");

  const promotion = await Promotion.create({
    product: productId,
    shop,
    type,
    value,
    startDate,
    endDate,
  });

  return success(await promotion.populate("product", "name price"));
}

export async function updatePromotion(id, shop, data) {
  const promotion = await Promotion.findOneAndUpdate({ _id: id, shop }, data, {
    new: true,
    runValidators: true,
  }).populate("product", "name price");

  return promotion;
}

export async function toggleActive(id, shop) {
  const promotion = await Promotion.findOne({ _id: id, shop });
  if (!promotion) return null;

  promotion.isActive = !promotion.isActive;
  await promotion.save();

  return promotion.populate("product", "name price");
}
