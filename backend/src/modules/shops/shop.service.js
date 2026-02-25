import Shop from "./shop.model.js";
import { paginate } from "#utils/db/paginate.js";
import { err, success } from "#utils/objects.js";

export async function listShops({ search, status, page, limit }) {
  const filter = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (status) filter.status = status;

  return paginate(Shop, {
    filter,
    page,
    limit,
    populate: { path: "owner", select: "firstName lastName email" },
  });
}

export async function getShopById(id) {
  return Shop.findById(id).populate("owner", "firstName lastName email");
}

async function transitionStatus(id, fromStatus, toStatus) {
  const shop = await Shop.findById(id);
  if (!shop) return err("not_found");
  if (shop.status !== fromStatus) return err("invalid_status");

  shop.status = toStatus;
  await shop.save();
  return success(shop);
}

export async function validateShop(id) {
  return transitionStatus(id, "pending", "active");
}

export async function suspendShop(id) {
  return transitionStatus(id, "active", "suspended");
}
