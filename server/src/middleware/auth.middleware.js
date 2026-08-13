import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ status: 401, message: "Debes iniciar sesión" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ status: 401, message: "La sesión expiró o no es válida" });
  }
};
