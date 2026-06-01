import { Router } from "express";
import {
  getProfileHandler,
  loginHandler,
  logoutHandler,
  registerHandler
} from "../handlers/auth.handler.js";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.get("/me", getProfileHandler);

export default authRouter;
