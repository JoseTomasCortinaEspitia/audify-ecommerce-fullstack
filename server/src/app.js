import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import cartRouter from "./routes/cart.routes.js";
import categoryRouter from "./routes/category.routes.js";
import orderRouter from "./routes/order.routes.js";
import productRouter from "./routes/product.routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Audify E-commerce API is running"
  });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "Ruta no encontrada"
  });
});

app.use((error, req, res, next) => {
  console.error("App error:", error);

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      status: 400,
      message: "El JSON enviado no es valido"
    });
  }

  res.status(500).json({
    status: 500,
    message: "Error interno del servidor"
  });
});

export default app;
