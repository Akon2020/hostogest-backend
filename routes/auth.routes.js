import { Router } from "express";
import {
  login,
  register,
  resetPassword,
  updatePassword,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/reset-password/:token", updatePassword);

export default authRouter;
