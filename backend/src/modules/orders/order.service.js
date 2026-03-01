import { paginate } from "#utils/db/paginate.js";
import { transitionStatus } from "#utils/db/status.js";
import { NotFoundError } from "#utils/http/errors.js";
import Order from "./order.model.js";

const BUYER_POPULATE = { path: "buyer", select: "firstName lastName email" };

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
