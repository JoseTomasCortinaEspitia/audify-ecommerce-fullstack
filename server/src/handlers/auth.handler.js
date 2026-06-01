export const registerHandler = (req, res) => {
  res.status(201).json({
    status: 201,
    message: "Usuario registrado correctamente"
  });
};

export const loginHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Login correcto"
  });
};

export const logoutHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Logout correcto"
  });
};

export const getProfileHandler = (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Perfil obtenido correctamente"
  });
};
