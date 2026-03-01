import StockMovement from "./stock-movement.model.js";
import Product from "../product/product.model.js";
import { paginate } from "#utils/db/paginate.js";
import { withTransaction } from "#utils/db/withTransaction.js";
import { NotFoundError, BadRequestError } from "#utils/http/errors.js";

const POPULATE = [
  { path: "lines.product", select: "name" },
  { path: "performedBy", select: "firstName lastName email" },
];

export async function list({ shop, product, page, limit }) {
  const filter = { shop };
  if (product) filter["lines.product"] = product;

  return paginate(StockMovement, { filter, page, limit, populate: POPULATE });
}

export async function getById(id, shop) {
  const movement = await StockMovement.findOne({ _id: id, shop }).populate(POPULATE);
  if (!movement) throw new NotFoundError(StockMovement.modelName);
  return movement;
}

export async function create({ date, type, lines, reason }, shop, userId) {
  const uniqueIds = [...new Set(lines.map(l => l.productId))];
  if (uniqueIds.length !== lines.length) {
    throw new BadRequestError("Duplicate products are not allowed");
  }

  return withTransaction(async session => {
    const products = await Product.find({ _id: { $in: uniqueIds }, shop }).session(session);
    if (products.length !== uniqueIds.length) throw new NotFoundError(Product.modelName);

    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    const movementLines = lines.map(line => {
      const product = productMap.get(line.productId);
      const previousStock = product.stock;
      let newStock;

      if (type === "in") {
        newStock = previousStock + line.quantity;
      } else if (type === "out") {
        if (previousStock < line.quantity) {
          throw new BadRequestError(`Insufficient stock for ${product.name}`);
        }
        newStock = previousStock - line.quantity;
      } else {
        newStock = line.quantity;
      }

      return { product: product._id, quantity: line.quantity, previousStock, newStock };
    });

    await Product.bulkWrite(
      movementLines.map(line => ({
        updateOne: {
          filter: { _id: line.product },
          update: { $set: { stock: line.newStock } },
        },
      })),
      { session },
    );

    const [movement] = await StockMovement.create(
      [{ shop, performedBy: userId, date, type, reason, lines: movementLines }],
      { session },
    );

    return movement.populate(POPULATE);
  });
}
