import Shop from "./shop.model.js";
import User from "#modules/users/user.model.js";
import { paginate } from "#utils/db/paginate.js";

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

export async function getShopByOwnerEmail(email) {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return null;
  }
  const shop = await Shop.findOne({ owner: user._id });
  return shop;
}

export async function validateShop(id) {
  const shop = await Shop.findById(id);
  if (!shop) return { error: "not_found" };
  if (shop.status !== "pending") return { error: "invalid_status" };

  shop.status = "active";
  await shop.save();
  return { data: shop };
}

export async function suspendShop(id) {
  const shop = await Shop.findById(id);
  if (!shop) return { error: "not_found" };
  if (shop.status !== "active") return { error: "invalid_status" };

  shop.status = "suspended";
  await shop.save();
  return { data: shop };
}
