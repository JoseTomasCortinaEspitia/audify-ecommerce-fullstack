import { Router } from "express";
import { upload } from "../middleware/upload.middleware.js";
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
productRouter.post("/", upload.single("image"), createProductHandler);
productRouter.put("/:id", upload.single("image"), updateProductHandler);
productRouter.delete("/:id", deleteProductHandler);

export default productRouter;
