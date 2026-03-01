import { paginate } from "#utils/db/paginate.js";
import { err, success } from "#utils/objects.js";
import Order from "./order.model.js";

export async function listOrders({ shop, search, status, page, limit }) {
  const filter = { shop };
  if (search) filter.orderNumber = { $regex: search, $options: "i" };
  if (status) filter.status = status;

  return paginate(Order, {
    filter,
    page,
    limit,
    populate: { path: "buyer", select: "firstName lastName email" },
  });
}
export async function getOrderById(id, shop) {
  return Order.findByOne({ _id: id, shop }).populate("buyer", "firstName lastName email");
}

async function transitionStatusOrder(id, fromStatus, toStatus, changedBy, reason = null) {
  const order = await Order.findById(id);

  if (!order) return err("not_found");

  if (order.status !== fromStatus) {
    return err("invalid_status");
  }

  order.statusHistory.push({
    from: fromStatus,
    to: toStatus,
    changedBy,
    reason,
  });

  order.status = toStatus;

  await order.save();

  return success(order);
}

export async function confirmOrder(id, userId) {
  return transitionStatusOrder(id, "pending", "confirmed", userId);
}

export async function refuseOrder(id, userId, reason) {
  return transitionStatusOrder(id, "pending", "refused", userId, reason);
}

export async function cancelOrder(id, userId, reason) {
  return transitionStatusOrder(id, "confirmed", "cancelled", userId, reason);
}
