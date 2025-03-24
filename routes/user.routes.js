import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUserInfo,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getSingleUser);

userRouter.put("/update/:id", updateUserInfo);

userRouter.delete("/delete/:id", deleteUser);

export default userRouter;
