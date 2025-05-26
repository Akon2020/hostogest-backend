import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  getUserRole,
  getUserPermission,
  getUserFeaturesAndPermissions,
  updateUserInfo,
  updateUserPassword,
  assignRoleToUser,
  removeRoleFromUser,
} from "../controllers/user.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.use(authenticationJWT);

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getSingleUser);
userRouter.get("/user/:id/role", getUserRole);
userRouter.get("/user/:id/permission", getUserPermission);
userRouter.get("/user/:id/feature", getUserFeaturesAndPermissions);

userRouter.post("/add", createUser);
userRouter.post("/user/:id/assignrole", assignRoleToUser);

userRouter.patch("/update/:id", updateUserInfo);

userRouter.put("/update/:id/password", updateUserPassword);

userRouter.delete("/delete/:id", deleteUser);
userRouter.delete("/user/:id/deleterole", removeRoleFromUser);

export default userRouter;
