import {
  AuthError,
  getUserProfile,
  loginUser,
  loginWithGoogle,
  logoutUser,
  registerUser
} from "../controllers/auth.controller.js";

const sendError = (res, error, defaultMessage) => {
  const status = error instanceof AuthError ? error.status : 500;
  const message = error instanceof AuthError ? error.message : defaultMessage;

  return res.status(status).json({ status, message });
};

export const registerHandler = async (req, res) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({ status: 201, ...result });
  } catch (error) {
    console.error("Register error:", error);
    sendError(res, error, "No se pudo crear la cuenta");
  }
};

export const loginHandler = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({ status: 200, ...result });
  } catch (error) {
    console.error("Login error:", error);
    sendError(res, error, "No se pudo iniciar sesión");
  }
};

export const googleLoginHandler = async (req, res) => {
  try {
    const result = await loginWithGoogle(req.body.credential);

    res.status(200).json({ status: 200, ...result });
  } catch (error) {
    console.error("Google login error:", error);
    sendError(res, error, "No se pudo iniciar sesión con Google");
  }
};

export const logoutHandler = async (_req, res) => {
  try {
    const result = await logoutUser();

    res.status(200).json({ status: 200, ...result });
  } catch (error) {
    console.error("Logout error:", error);
    sendError(res, error, "No se pudo cerrar la sesión");
  }
};

export const getProfileHandler = async (req, res) => {
  try {
    const user = await getUserProfile(req.user.id);

    res.status(200).json({ status: 200, user });
  } catch (error) {
    console.error("Profile error:", error);
    sendError(res, error, "No se pudo obtener el perfil");
  }
};
