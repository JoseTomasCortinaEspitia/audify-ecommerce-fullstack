export const getCategoriesHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Categorias obtenidas correctamente"
  });
};

export const getCategoryByIdHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Categoria obtenida correctamente"
  });
};

export const createCategoryHandler = (req, res) => {
  res.status(201).json({
    status: 201,
    message: "Categoria creada correctamente"
  });
};

export const updateCategoryHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Categoria actualizada correctamente"
  });
};

export const deleteCategoryHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Categoria eliminada correctamente"
  });
};
