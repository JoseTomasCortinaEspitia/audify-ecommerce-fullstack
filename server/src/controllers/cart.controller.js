import prisma from "../config/prisma.js";

const cartInclude = {
  product: { include: { category: true } }
};

export const getCart = (userId) => prisma.cartItem.findMany({
  where: { userId },
  include: cartInclude,
  orderBy: { id: "asc" }
});

export const addCartItem = async (userId, productId, quantity = 1) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { error: "PRODUCT_NOT_FOUND" };
  const requested = Number(quantity);
  if (!Number.isInteger(requested) || requested < 1) return { error: "INVALID_QUANTITY" };
  const existing = await prisma.cartItem.findUnique({ where: { userId_productId: { userId, productId } } });
  const totalQuantity = (existing?.quantity || 0) + requested;
  if (totalQuantity > product.stock) return { error: "INSUFFICIENT_STOCK" };
  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: totalQuantity },
    create: { userId, productId, quantity: requested },
    include: cartInclude
  });
  return { item };
};

export const updateCartItem = async (userId, productId, quantity) => {
  const requested = Number(quantity);
  if (!Number.isInteger(requested) || requested < 1) return { error: "INVALID_QUANTITY" };
  const [product, existing] = await Promise.all([
    prisma.product.findUnique({ where: { id: productId } }),
    prisma.cartItem.findUnique({ where: { userId_productId: { userId, productId } } })
  ]);
  if (!existing || !product) return { error: "ITEM_NOT_FOUND" };
  if (requested > product.stock) return { error: "INSUFFICIENT_STOCK" };
  const item = await prisma.cartItem.update({
    where: { userId_productId: { userId, productId } },
    data: { quantity: requested },
    include: cartInclude
  });
  return { item };
};

export const removeCartItem = async (userId, productId) => {
  const result = await prisma.cartItem.deleteMany({ where: { userId, productId } });
  return result.count > 0;
};

export const clearCart = (userId) => prisma.cartItem.deleteMany({ where: { userId } });
