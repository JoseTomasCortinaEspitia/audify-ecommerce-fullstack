import { Router } from "express";
import { upload } from "../middleware/upload.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
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
productRouter.post("/", requireAuth, requireAdmin, upload.single("image"), createProductHandler);
productRouter.put("/:id", requireAuth, requireAdmin, upload.single("image"), updateProductHandler);
productRouter.delete("/:id", requireAuth, requireAdmin, deleteProductHandler);

export default productRouter;
