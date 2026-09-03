import { addCartItem, clearCart, getCart, removeCartItem, updateCartItem } from "../controllers/cart.controller.js";

const sendCartError = (res, error) => {
  if (error === "PRODUCT_NOT_FOUND" || error === "ITEM_NOT_FOUND") return res.status(404).json({ status: 404, message: "Producto no encontrado en el carrito" });
  if (error === "INVALID_QUANTITY") return res.status(400).json({ status: 400, message: "La cantidad debe ser un número entero mayor que cero" });
  if (error === "INSUFFICIENT_STOCK") return res.status(409).json({ status: 409, message: "No hay suficiente inventario disponible" });
};

export const getCartHandler = async (req, res) => {
  try { res.status(200).json({ status: 200, message: "Carrito obtenido correctamente", items: await getCart(req.user.id) }); }
  catch (error) { console.error("Get cart error:", error); res.status(500).json({ status: 500, message: "Error al obtener el carrito" }); }
};

export const addCartItemHandler = async (req, res) => {
  try { const result = await addCartItem(req.user.id, req.body.productId, req.body.quantity); if (result.error) return sendCartError(res, result.error); res.status(201).json({ status: 201, message: "Producto agregado al carrito correctamente", item: result.item }); }
  catch (error) { console.error("Add cart item error:", error); res.status(500).json({ status: 500, message: "Error al agregar el producto" }); }
};

export const updateCartItemHandler = async (req, res) => {
  try { const result = await updateCartItem(req.user.id, req.params.productId, req.body.quantity); if (result.error) return sendCartError(res, result.error); res.status(200).json({ status: 200, message: "Producto del carrito actualizado correctamente", item: result.item }); }
  catch (error) { console.error("Update cart item error:", error); res.status(500).json({ status: 500, message: "Error al actualizar el carrito" }); }
};

export const removeCartItemHandler = async (req, res) => {
  try { const removed = await removeCartItem(req.user.id, req.params.productId); if (!removed) return res.status(404).json({ status: 404, message: "Producto no encontrado en el carrito" }); res.status(200).json({ status: 200, message: "Producto eliminado del carrito correctamente" }); }
  catch (error) { console.error("Remove cart item error:", error); res.status(500).json({ status: 500, message: "Error al eliminar el producto" }); }
};

export const clearCartHandler = async (req, res) => {
  try { await clearCart(req.user.id); res.status(200).json({ status: 200, message: "Carrito vaciado correctamente" }); }
  catch (error) { console.error("Clear cart error:", error); res.status(500).json({ status: 500, message: "Error al vaciar el carrito" }); }
};
