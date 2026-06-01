import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Petify E-commerce API is running"
  });
});

export default app;