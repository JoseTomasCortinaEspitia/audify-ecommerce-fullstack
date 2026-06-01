export const getCartHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Carrito obtenido correctamente"
  });
};

export const addCartItemHandler = (req, res) => {
  res.status(201).json({
    status: 201,
    message: "Producto agregado al carrito correctamente"
  });
};

export const updateCartItemHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Producto del carrito actualizado correctamente"
  });
};

export const removeCartItemHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Producto eliminado del carrito correctamente"
  });
};

export const clearCartHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Carrito vaciado correctamente"
  });
};
