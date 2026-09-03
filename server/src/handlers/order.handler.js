import { createOrder, getOrderById, getOrders } from "../controllers/order.controller.js";

export const getOrdersHandler = async (req, res) => {
  try { const orders = await getOrders(req.user.id); res.status(200).json({ status: 200, message: "Ordenes obtenidas correctamente", orders }); }
  catch (error) { console.error("Get orders error:", error); res.status(500).json({ status: 500, message: "Error al obtener las ordenes" }); }
};

export const getOrderByIdHandler = async (req, res) => {
  try { const order = await getOrderById(req.params.id, req.user.id); if (!order) return res.status(404).json({ status: 404, message: "Orden no encontrada" }); res.status(200).json({ status: 200, message: "Orden obtenida correctamente", order }); }
  catch (error) { console.error("Get order error:", error); res.status(500).json({ status: 500, message: "Error al obtener la orden" }); }
};

export const createOrderHandler = async (req, res) => {
  try { const result = await createOrder(req.user.id); if (result.error === "EMPTY_CART") return res.status(400).json({ status: 400, message: "El carrito está vacío" }); if (result.error === "INSUFFICIENT_STOCK") return res.status(409).json({ status: 409, message: `No hay suficiente inventario de ${result.product}` }); res.status(201).json({ status: 201, message: "Orden creada correctamente", order: result.order }); }
  catch (error) { console.error("Create order error:", error); res.status(500).json({ status: 500, message: "Error al crear la orden" }); }
};

export const updateOrderStatusHandler = (req, res) => {
  res.status(501).json({ status: 501, message: "Actualización de estado aún no disponible" });
};

export const deleteOrderHandler = (req, res) => {
  res.status(501).json({ status: 501, message: "Eliminación de ordenes no disponible" });
};
