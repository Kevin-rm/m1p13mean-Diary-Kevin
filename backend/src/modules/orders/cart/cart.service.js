import Cart from "./cart.model.js";
import Order from "../order.model.js";
import { NotFoundError, BadRequestError } from "#utils/http/errors.js";

export async function get(userId) {
  const cart = await Cart.findOne({ user: userId })
    .populate("items.product", "name price imageUrl")
    .populate("items.shop", "name");

  return cart ?? { items: [] };
}

export async function addItem(userId, { productId, shopId, quantity = 1 }) {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    item => item.product.toString() === productId && item.shop.toString() === shopId,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, shop: shopId, quantity });
  }

  await cart.save();
  return cart;
}

export async function removeItem(userId, { productId, shopId }) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new NotFoundError(Cart.modelName);

  cart.items = cart.items.filter(
    item => !(item.product.toString() === productId && item.shop.toString() === shopId),
  );

  await cart.save();
  return cart;
}

export async function validate(userId) {
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name price imageUrl",
  );

  if (!cart || cart.items.length === 0) {
    throw new BadRequestError("Cart is empty");
  }

  const itemsByShop = {};
  for (const item of cart.items) {
    const shopId = item.shop.toString();
    if (!itemsByShop[shopId]) itemsByShop[shopId] = [];
    itemsByShop[shopId].push({
      product: item.product._id,
      productName: item.product.name,
      productPrice: item.product.price,
      productImageUrl: item.product.imageUrl,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
    });
  }

  const orders = [];
  for (const shopId in itemsByShop) {
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const items = itemsByShop[shopId];
    const totalAmount = items.reduce((sum, i) => sum + i.subtotal, 0);

    const order = await Order.create({
      orderNumber,
      buyer: userId,
      shop: shopId,
      items,
      totalAmount,
    });
    orders.push(order);
  }

  cart.items = [];
  await cart.save();

  return { orders };
}
