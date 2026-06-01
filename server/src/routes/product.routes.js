import { Router } from "express";
import {
  createProductHandler,
  deleteProductHandler,
  getProductByIdHandler,
  getProductsHandler,
  updateProductHandler
} from "../handlers/product.handler.js";

const productRouter = Router();

productRouter.get("/", getProductsHandler);
productRouter.get("/:id", getProductByIdHandler);
productRouter.post("/", createProductHandler);
productRouter.put("/:id", updateProductHandler);
productRouter.delete("/:id", deleteProductHandler);

export default productRouter;
