import { Router } from "express";
import {
  getAllUsers,
  getSingleUser,
  updateUserInfo,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/users", getAllUsers);
userRouter.get("/user/:id", getSingleUser);

userRouter.put("/user/update/:id", updateUserInfo);

export default userRouter;
