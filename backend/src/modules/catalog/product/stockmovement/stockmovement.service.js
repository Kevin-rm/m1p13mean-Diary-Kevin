import StockMovement from "./stockmovement.model.js";
import Product from "../product.model.js";
import { paginate } from "#utils/db/paginate.js";
import { NotFoundError, BadRequestError } from "#utils/http/errors.js";

const POPULATE = [
  { path: "product", select: "name" },
  { path: "performedBy", select: "firstName lastName email" },
];

export async function list({ shop, product, page, limit }) {
  const filter = { shop };
  if (product) filter.product = product;

  return paginate(StockMovement, { filter, page, limit, populate: POPULATE });
}

export async function getById(id, shop) {
  const movement = await StockMovement.findOne({ _id: id, shop }).populate(POPULATE);
  if (!movement) throw new NotFoundError(StockMovement.modelName);
  return movement;
}

export async function create({ productId, type, quantity, reason }, shop, userId) {
  const product = await Product.findOne({ _id: productId, shop });
  if (!product) throw new NotFoundError(Product.modelName);

  const previousStock = product.stock;
  let newStock;

  if (type === "in") {
    newStock = previousStock + quantity;
  } else if (type === "out") {
    if (previousStock < quantity) throw new BadRequestError("Insufficient stock");
    newStock = previousStock - quantity;
  } else {
    newStock = quantity;
  }

  product.stock = newStock;
  await product.save();

  const movement = await StockMovement.create({
    product: product._id,
    shop,
    type,
    quantity,
    reason,
    performedBy: userId,
    previousStock,
    newStock,
  });

  return movement.populate(POPULATE);
}
