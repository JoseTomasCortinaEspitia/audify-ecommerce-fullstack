import { Router } from "express";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler
} from "../handlers/category.handler.js";

const categoryRouter = Router();

categoryRouter.get("/", getCategoriesHandler);
categoryRouter.get("/:id", getCategoryByIdHandler);
categoryRouter.post("/", createCategoryHandler);
categoryRouter.put("/:id", updateCategoryHandler);
categoryRouter.delete("/:id", deleteCategoryHandler);

export default categoryRouter;
