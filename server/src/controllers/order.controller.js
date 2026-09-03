import prisma from "../config/prisma.js";

const orderInclude = {
  items: { include: { product: { include: { category: true } } } }
};

export const getOrders = (userId, isAdmin = false) => prisma.order.findMany({
  where: isAdmin ? {} : { userId },
  include: { ...orderInclude, ...(isAdmin ? { user: { select: { id: true, name: true, email: true } } } : {}) },
  orderBy: { createdAt: "desc" }
});

export const getOrderById = (id, userId, isAdmin = false) => prisma.order.findFirst({
  where: { id, ...(isAdmin ? {} : { userId }) },
  include: orderInclude
});

export const createOrder = async (userId) => prisma.$transaction(async (tx) => {
  const cartItems = await tx.cartItem.findMany({ where: { userId }, include: { product: true } });
  if (!cartItems.length) return { error: "EMPTY_CART" };
  for (const item of cartItems) {
    if (item.quantity > item.product.stock) return { error: "INSUFFICIENT_STOCK", product: item.product.name };
  }
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const order = await tx.order.create({
    data: {
      userId,
      total,
      items: { create: cartItems.map((item) => ({ productId: item.productId, quantity: item.quantity, price: item.product.price })) }
    },
    include: orderInclude
  });
  for (const item of cartItems) {
    await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
  }
  await tx.cartItem.deleteMany({ where: { userId } });
  return { order };
});
