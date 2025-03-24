import { Router } from "express";
import {
  addRole,
  deleteRoleInfo,
  getAllRoles,
  getSingleRole,
  updateRoleInfo,
} from "../controllers/role.controller.js";

const roleRouter = Router();

roleRouter.get("/", getAllRoles);
roleRouter.get("/:id", getSingleRole);

roleRouter.post("/add", addRole);

roleRouter.put("/update/:id", updateRoleInfo);

roleRouter.delete("/delete/:id", deleteRoleInfo);

export default roleRouter;
