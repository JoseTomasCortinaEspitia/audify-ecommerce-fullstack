import { Router } from "express";
import {
  createOrderHandler,
  deleteOrderHandler,
  getOrderByIdHandler,
  getOrdersHandler,
  updateOrderStatusHandler
} from "../handlers/order.handler.js";

const orderRouter = Router();

orderRouter.get("/", getOrdersHandler);
orderRouter.get("/:id", getOrderByIdHandler);
orderRouter.post("/", createOrderHandler);
orderRouter.patch("/:id/status", updateOrderStatusHandler);
orderRouter.delete("/:id", deleteOrderHandler);

export default orderRouter;
