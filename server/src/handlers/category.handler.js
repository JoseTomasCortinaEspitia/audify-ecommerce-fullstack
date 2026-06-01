import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory
} from "../controllers/category.controller.js";

const getCategoryErrorResponse = (error, defaultMessage) => {
  if (error.code === "P2002") {
    return {
      status: 409,
      message: "Ya existe una categoria con ese nombre"
    };
  }

  if (error.code === "P2003") {
    return {
      status: 409,
      message: "No se puede eliminar la categoria porque tiene productos asociados"
    };
  }

  return {
    status: 500,
    message: defaultMessage
  };
};

export const getCategoriesHandler = async (req, res) => {
  try {
    const categories = await getCategories();

    res.status(200).json({
      status: 200,
      message: "Categorias obtenidas correctamente",
      categories
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      status: 500,
      message: "Error al obtener categorias"
    });
  }
};

export const getCategoryByIdHandler = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: 404,
        message: "Categoria no encontrada"
      });
    }

    res.status(200).json({
      status: 200,
      message: "Categoria obtenida correctamente",
      category
    });
  } catch (error) {
    console.error("Get category by id error:", error);

    res.status(500).json({
      status: 500,
      message: "Error al obtener categoria"
    });
  }
};

export const createCategoryHandler = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({
        status: 400,
        message: "El nombre de la categoria es obligatorio"
      });
    }

    const category = await createCategory(req.body);

    res.status(201).json({
      status: 201,
      message: "Categoria creada correctamente",
      category
    });
  } catch (error) {
    console.error("Create category error:", error);

    const response = getCategoryErrorResponse(error, "Error al crear categoria");
    res.status(response.status).json(response);
  }
};

export const updateCategoryHandler = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({
        status: 400,
        message: "El nombre de la categoria es obligatorio"
      });
    }

    const category = await updateCategory(req.params.id, req.body);

    if (!category) {
      return res.status(404).json({
        status: 404,
        message: "Categoria no encontrada"
      });
    }

    res.status(200).json({
      status: 200,
      message: "Categoria actualizada correctamente",
      category
    });
  } catch (error) {
    console.error("Update category error:", error);

    const response = getCategoryErrorResponse(error, "Error al actualizar categoria");
    res.status(response.status).json(response);
  }
};

export const deleteCategoryHandler = async (req, res) => {
  try {
    const category = await deleteCategory(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: 404,
        message: "Categoria no encontrada"
      });
    }

    res.status(200).json({
      status: 200,
      message: "Categoria eliminada correctamente",
      category
    });
  } catch (error) {
    console.error("Delete category error:", error);

    const response = getCategoryErrorResponse(error, "Error al eliminar categoria");
    res.status(response.status).json(response);
  }
};
