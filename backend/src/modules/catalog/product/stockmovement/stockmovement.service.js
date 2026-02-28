import { StockMovement } from "./stockmovement.model.js";
import Product from "../product/product.model.js";
import { paginate } from "#utils/db/paginate.js";
import { err, success } from "#utils/objects.js";

export async function listStockMovements({ shop, product, page, limit }) {
  const filter = { shop };
  if (product) filter.product = product;

  return paginate(StockMovement, {
    filter,
    page,
    limit,
    populate: [
      { path: "product", select: "name" },
      { path: "performedBy", select: "firstName lastName email" },
    ],
  });
}

export async function getStockMovementById(id, shop) {
  return StockMovement.findOne({ _id: id, shop })
    .populate("product", "name")
    .populate("performedBy", "firstName lastName email");
}

export async function createStockMovement({ productId, type, quantity, reason }, shop, userId) {
  const product = await Product.findOne({ _id: productId, shop });
  if (!product) return err("not_found");

  const previousStock = product.stock;
  let newStock = previousStock;

  if (type === "in") {
    newStock += quantity;
  }

  if (type === "out") {
    if (previousStock < quantity) return err("insufficient_stock");
    newStock -= quantity;
  }

  if (type === "adjustment") {
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

  return success(
    await movement.populate([
      { path: "product", select: "name" },
      { path: "performedBy", select: "firstName lastName email" },
    ]),
  );
}
