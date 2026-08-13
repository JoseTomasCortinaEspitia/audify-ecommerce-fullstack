import { Router } from "express";
import {
  googleLoginHandler,
  getProfileHandler,
  loginHandler,
  logoutHandler,
  registerHandler
} from "../handlers/auth.handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/google", googleLoginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.get("/me", requireAuth, getProfileHandler);

export default authRouter;
