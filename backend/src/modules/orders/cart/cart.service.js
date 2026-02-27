import Cart from "./cart.model.js";
import Order from "../order.model.js";
import { err, success } from "#utils/objects.js";

export async function getCartOrder(userId) {
  const cart = await Cart.findOne({ user: userId })
    .populate("items.product", "name price imageUrl")
    .populate("items.shop", "name");

  if (!cart) return success({ items: [] });

  return success(cart);
}

export async function addItemCart(userId, { productId, shopId, quantity = 1 }) {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  // Vérifier si le produit existe déjà dans le panier
  const existingItem = cart.items.find(
    item => item.product.toString() === productId && item.shop.toString() === shopId,
  );

  if (existingItem) {
    // Si le produit existe déjà, on incrémente la quantité
    existingItem.quantity += quantity;
  } else {
    // Ajouter le produit
    cart.items.push({
      product: productId,
      shop: shopId,
      quantity,
    });
  }

  await cart.save();
  return success(cart);
}

export async function removeItemCart(userId, { productId, shopId }) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return err("Cart not found");

  cart.items = cart.items.filter(
    item => !(item.product.toString() === productId && item.shop.toString() === shopId),
  );

  await cart.save();
  return success(cart);
}

export async function validateCart(userId) {
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name price imageUrl",
  );

  if (!cart || cart.items.length === 0) {
    return err("Cart is empty");
  }

  // Pour chaque shop, créer une commande séparée
  const orders = [];
  const itemsByShop = {};

  cart.items.forEach(item => {
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
  });

  for (const shopId in itemsByShop) {
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const items = itemsByShop[shopId];
    const totalAmount = items.reduce((sum, i) => sum + i.subtotal, 0);

    const order = new Order({
      orderNumber,
      buyer: userId,
      shop: shopId,
      items,
      totalAmount,
      status: "pending",
      statusHistory: [],
    });

    await order.save();
    orders.push(order);
  }

  cart.items = [];
  await cart.save();

  return success({ orders });
}
