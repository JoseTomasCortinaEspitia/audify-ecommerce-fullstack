export const getOrdersHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Ordenes obtenidas correctamente"
  });
};

export const getOrderByIdHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Orden obtenida correctamente"
  });
};

export const createOrderHandler = (req, res) => {
  res.status(201).json({
    status: 201,
    message: "Orden creada correctamente"
  });
};

export const updateOrderStatusHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Estado de la orden actualizado correctamente"
  });
};

export const deleteOrderHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Orden eliminada correctamente"
  });
};
