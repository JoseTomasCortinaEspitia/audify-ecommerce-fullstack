import { Router } from "express";
import {
  addCartItemHandler,
  clearCartHandler,
  getCartHandler,
  removeCartItemHandler,
  updateCartItemHandler
} from "../handlers/cart.handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const cartRouter = Router();
cartRouter.use(requireAuth);

cartRouter.get("/", getCartHandler);
cartRouter.post("/items", addCartItemHandler);
cartRouter.put("/items/:productId", updateCartItemHandler);
cartRouter.delete("/items/:productId", removeCartItemHandler);
cartRouter.delete("/", clearCartHandler);

export default cartRouter;
