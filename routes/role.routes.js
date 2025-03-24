import { Router } from "express";
import {
  addRole,
  affectRoleToUser,
  deleteRoleInfo,
  getAllRoles,
  getSingleRole,
  getUserRoles,
  updateRoleInfo,
} from "../controllers/role.controller.js";

const roleRouter = Router();

roleRouter.get("/", getAllRoles);
roleRouter.get("/:id", getSingleRole);
roleRouter.get("/user/:id", getUserRoles);

roleRouter.post("/add", addRole);
roleRouter.post("/affect", affectRoleToUser);

roleRouter.put("/update/:id", updateRoleInfo);

roleRouter.delete("/delete/:id", deleteRoleInfo);

export default roleRouter;
