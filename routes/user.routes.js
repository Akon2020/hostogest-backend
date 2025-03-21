import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUserInfo,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/users", getAllUsers);
userRouter.get("/user/:id", getSingleUser);

userRouter.put("/user/update/:id", updateUserInfo);

userRouter.delete("/user/delete/:id", deleteUser);

export default userRouter;
