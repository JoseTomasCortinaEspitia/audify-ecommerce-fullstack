import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from "../controllers/product.controller.js";

const isValidProductBody = ({ name, description, price, stock, categoryId }) => {
  return name && description && price !== undefined && stock !== undefined && categoryId;
};

const getProductErrorResponse = (error, defaultMessage) => {
  if (error.code === "P2002") {
    return {
      status: 409,
      message: "Ya existe un producto con ese nombre"
    };
  }
  
  if (error.code === "P2003") {
    return {
      status: 400,
      message: "La categoria indicada no existe"
    };
  }

  return {
    status: 500,
    message: defaultMessage
  };
};

export const getProductsHandler = async (req, res) => {
  try {
    const products = await getProducts();

    res.status(200).json({
      status: 200,
      message: "Productos obtenidos correctamente",
      products
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      status: 500,
      message: "Error al obtener productos"
    });
  }
};

export const getProductByIdHandler = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({
      status: 200,
      message: "Producto obtenido correctamente",
      product
    });
  } catch (error) {
    console.error("Get product by id error:", error);

    res.status(500).json({
      status: 500,
      message: "Error al obtener producto"
    });
  }
};

export const createProductHandler = async (req, res) => {
  try {
    if (!isValidProductBody(req.body)) {
      return res.status(400).json({
        status: 400,
        message: "Todos los campos son obligatorios"
      });
    }

    const product = await createProduct(req.body, req.file);

    res.status(201).json({
      status: 201,
      message: "Producto creado correctamente",
      product
    });
  } catch (error) {
    console.error("Create product error:", error);

    const response = getProductErrorResponse(error, "Error al crear producto");
    res.status(response.status).json(response);
  }
};

export const updateProductHandler = async (req, res) => {
  try {
    const product = await updateProduct(req.params.id, req.body, req.file);

    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({
      status: 200,
      message: "Producto actualizado correctamente",
      product
    });
  } catch (error) {
    console.error("Update product error:", error);

    const response = getProductErrorResponse(error, "Error al actualizar producto");
    res.status(response.status).json(response);
  }
};

export const deleteProductHandler = async (req, res) => {
  try {
    const product = await deleteProduct(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({
      status: 200,
      message: "Producto eliminado correctamente",
      product
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      status: 500,
      message: "Error al eliminar producto"
    });
  }
};
