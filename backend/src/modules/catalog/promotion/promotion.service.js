import Promotion from "./promotion.model.js";
import Product from "../product/product.model.js";
import { paginate } from "#utils/db/paginate.js";
import { toggleActiveStatus } from "#utils/db/status.js";
import { NotFoundError } from "#utils/http/errors.js";

export async function list({ shop, product, isActive, page, limit }) {
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

export async function getById(id, shop) {
  const promotion = await Promotion.findOne({ _id: id, shop }).populate("product", "name price");
  if (!promotion) throw new NotFoundError(Promotion.modelName);
  return promotion;
}

export async function create(data, shop) {
  const { productId, type, value, startDate, endDate } = data;

  const product = await Product.findOne({ _id: productId, shop });
  if (!product) throw new NotFoundError(Product.modelName);

  const promotion = await Promotion.create({
    product: productId,
    shop,
    type,
    value,
    startDate,
    endDate,
  });

  return promotion.populate("product", "name price");
}

export async function update(id, shop, data) {
  const promotion = await Promotion.findOneAndUpdate({ _id: id, shop }, data, {
    new: true,
    runValidators: true,
  }).populate("product", "name price");
  if (!promotion) throw new NotFoundError(Promotion.modelName);
  return promotion;
}

export async function toggleActive(id, shop) {
  return toggleActiveStatus(
    Promotion,
    { _id: id, shop },
    { populate: { path: "product", select: "name price" } },
  );
}
