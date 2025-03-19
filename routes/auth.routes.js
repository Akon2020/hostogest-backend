import { Router } from "express";
import {
  login,
  register,
  resetPassword,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
