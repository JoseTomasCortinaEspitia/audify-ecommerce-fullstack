export const getProductsHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Productos obtenidos correctamente"
  });
};

export const getProductByIdHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Producto obtenido correctamente"
  });
};

export const createProductHandler = (req, res) => {
  res.status(201).json({
    status: 201,
    message: "Producto creado correctamente"
  });
};

export const updateProductHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Producto actualizado correctamente"
  });
};

export const deleteProductHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Producto eliminado correctamente"
  });
};
