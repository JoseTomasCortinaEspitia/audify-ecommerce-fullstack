export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      status: 403,
      message: "Esta acción requiere permisos de administrador"
    });
  }

  next();
};
