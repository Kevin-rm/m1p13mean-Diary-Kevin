import Shop from "#modules/shops/shop.model.js";
import Product from "#modules/catalog/product/product.model.js";
import Category from "#modules/catalog/category/category.model.js";
import { paginate } from "#utils/db/paginate.js";
import { NotFoundError } from "#utils/http/errors.js";

const ACTIVE_SHOP_FILTER = { status: "active" };
const ACTIVE_PRODUCT_FILTER = { isActive: true };
const ACTIVE_CATEGORY_FILTER = { isActive: true };

const searchFilter = value => ({ $regex: value, $options: "i" });

const PRODUCT_POPULATE = [
  { path: "category", select: "name" },
  { path: "shop", select: "name logoUrl" },
];

// Shops

const SHOP_SORT_MAP = {
  name: { name: 1 },
  "-name": { name: -1 },
  rating: { averageRating: 1 },
  "-rating": { averageRating: -1 },
};

export async function listShops({ search, minRating, sort, page, limit }) {
  const filter = { ...ACTIVE_SHOP_FILTER };
  if (search) filter.name = searchFilter(search);
  if (minRating) filter.averageRating = { $gte: Number(minRating) };

  return paginate(Shop, {
    filter,
    sort: SHOP_SORT_MAP[sort] ?? { createdAt: -1 },
    page,
    limit,
    populate: { path: "owner", select: "firstName lastName" },
  });
}

export async function getShop(id) {
  const shop = await Shop.findOne({ _id: id, ...ACTIVE_SHOP_FILTER }).populate(
    "owner",
    "firstName lastName",
  );
  if (!shop) throw new NotFoundError(Shop.modelName);
  return shop;
}

export async function listShopProducts(shopId, { search, category, page, limit }) {
  await getShop(shopId);

  const filter = { shop: shopId, ...ACTIVE_PRODUCT_FILTER };
  if (search) filter.name = searchFilter(search);
  if (category) filter.category = category;

  return paginate(Product, { filter, page, limit, populate: PRODUCT_POPULATE });
}

// Products

async function getActiveShopIds() {
  const shops = await Shop.find(ACTIVE_SHOP_FILTER).select("_id").lean();
  return shops.map(s => s._id);
}

const PRODUCT_SORT_MAP = {
  name: { name: 1 },
  "-name": { name: -1 },
  price: { price: 1 },
  "-price": { price: -1 },
  newest: { createdAt: -1 },
};

export async function listProducts({
  search,
  category,
  shop,
  minPrice,
  maxPrice,
  sort,
  page,
  limit,
}) {
  const filter = { ...ACTIVE_PRODUCT_FILTER };
  if (search) filter.name = searchFilter(search);
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (shop) {
    const activeShop = await Shop.exists({ _id: shop, ...ACTIVE_SHOP_FILTER });
    if (!activeShop) return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    filter.shop = shop;
  } else {
    filter.shop = { $in: await getActiveShopIds() };
  }

  return paginate(Product, {
    filter,
    sort: PRODUCT_SORT_MAP[sort] ?? { createdAt: -1 },
    page,
    limit,
    populate: PRODUCT_POPULATE,
  });
}

export async function getProduct(id) {
  const product = await Product.findOne({ _id: id, ...ACTIVE_PRODUCT_FILTER })
    .populate("category", "name")
    .populate("shop", "name logoUrl status");

  if (!product || product.shop?.status !== "active") throw new NotFoundError(Product.modelName);

  const result = product.toJSON();
  if (result.shop) delete result.shop.status;
  return result;
}

// Categories

export async function listCategories() {
  return Category.find(ACTIVE_CATEGORY_FILTER).sort({ name: 1 });
}
