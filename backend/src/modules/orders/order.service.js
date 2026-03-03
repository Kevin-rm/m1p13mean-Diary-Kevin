import mongoose from "mongoose";
import { paginate } from "#utils/db/paginate.js";
import { transitionStatus } from "#utils/db/status.js";
import { NotFoundError, BadRequestError } from "#utils/http/errors.js";
import Product from "#modules/catalog/product/product.model.js";
import Order from "./order.model.js";

const BUYER_POPULATE = { path: "buyer", select: "firstName lastName email" };
const SHOP_POPULATE = { path: "shop", select: "name logoUrl" };

export async function list({ shop, search, status, page, limit }) {
  const filter = { shop };
  if (search) filter.orderNumber = { $regex: search, $options: "i" };
  if (status) filter.status = status;

  return paginate(Order, { filter, page, limit, populate: BUYER_POPULATE });
}

export async function getById(id, shop) {
  const order = await Order.findOne({ _id: id, shop }).populate(BUYER_POPULATE);
  if (!order) throw new NotFoundError(Order.modelName);
  return order;
}

export async function confirm(id, shop, userId) {
  return transitionStatus(
    Order,
    { filter: { _id: id, shop }, fromStatus: "pending", toStatus: "confirmed" },
    {
      beforeSave: doc =>
        doc.statusHistory.push({ from: "pending", to: "confirmed", changedBy: userId }),
    },
  );
}

export async function refuse(id, shop, userId, reason) {
  return transitionStatus(
    Order,
    { filter: { _id: id, shop }, fromStatus: "pending", toStatus: "refused" },
    {
      beforeSave: doc =>
        doc.statusHistory.push({ from: "pending", to: "refused", changedBy: userId, reason }),
    },
  );
}

export async function cancel(id, shop, userId, reason) {
  return transitionStatus(
    Order,
    { filter: { _id: id, shop }, fromStatus: "confirmed", toStatus: "cancelled" },
    {
      beforeSave: doc =>
        doc.statusHistory.push({ from: "confirmed", to: "cancelled", changedBy: userId, reason }),
    },
  );
}

export async function stats(shopId) {
  const match = shopId ? { shop: new mongoose.Types.ObjectId(shopId) } : {};

  const [ordersByStatus, revenue, recentOrders] = await Promise.all([
    Order.aggregate([{ $match: match }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { ...match, status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    shopId
      ? Order.find(match)
          .sort({ createdAt: -1 })
          .limit(5)
          .populate(BUYER_POPULATE)
          .populate(SHOP_POPULATE)
      : Promise.resolve([]),
  ]);

  const byStatus = Object.fromEntries(ordersByStatus.map(s => [s._id, s.count]));

  return {
    total: Object.values(byStatus).reduce((sum, c) => sum + c, 0),
    byStatus,
    revenue: revenue[0]?.total ?? 0,
    recentOrders,
  };
}

// ── Customer ─────────────────────────────────────────────────────────────────

export async function listByBuyer({ buyer, search, status, page, limit }) {
  const filter = { buyer };
  if (search) filter.orderNumber = { $regex: search, $options: "i" };
  if (status) filter.status = status;

  return paginate(Order, { filter, page, limit, populate: SHOP_POPULATE });
}

export async function getByBuyer(id, buyer) {
  const order = await Order.findOne({ _id: id, buyer }).populate(SHOP_POPULATE);
  if (!order) throw new NotFoundError(Order.modelName);
  return order;
}

export async function checkout(userId, items, note) {
  if (!items?.length) throw new BadRequestError("Le panier est vide");

  const productIds = items.map(i => i.product);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true }).populate(
    "shop",
    "name status",
  );

  if (products.length !== new Set(productIds).size) {
    throw new BadRequestError("Certains produits ne sont plus disponibles");
  }

  const productMap = new Map(products.map(p => [p.id, p]));
  const itemsByShop = {};

  for (const item of items) {
    const product = productMap.get(item.product);
    if (product.shop.status !== "active") {
      throw new BadRequestError(`La boutique ${product.shop.name} n'est plus active`);
    }
    const shopId = product.shop._id.toString();
    if (!itemsByShop[shopId]) itemsByShop[shopId] = [];
    itemsByShop[shopId].push({
      product: product._id,
      productName: product.name,
      productPrice: product.price,
      productImageUrl: product.images?.[0],
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    });
  }

  const checkoutRef = `CHK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const orders = [];

  for (const [shopId, orderItems] of Object.entries(itemsByShop)) {
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const totalAmount = orderItems.reduce((sum, i) => sum + i.subtotal, 0);

    const order = await Order.create({
      orderNumber,
      buyer: userId,
      shop: shopId,
      items: orderItems,
      totalAmount,
      note,
      checkoutRef,
    });
    orders.push(order);
  }

  return orders;
}
