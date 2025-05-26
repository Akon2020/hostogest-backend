import { Router } from "express";
import {
  addPermissionsToRole,
  createRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  removePermissionsFromRole,
  updateRole,
} from "../controllers/role.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const roleRouter = Router();

roleRouter.use(authenticationJWT);

roleRouter.get("/", getAllRoles);
roleRouter.get("/:id", getRoleById);
// roleRouter.get("/user/:id", getUserRoles);

roleRouter.post("/add", createRole);
roleRouter.post("/:id/affect", addPermissionsToRole);

roleRouter.patch("/update/:id", updateRole);

roleRouter.delete("/role/:id/role", removePermissionsFromRole);
roleRouter.delete("/delete/:id", deleteRole);

export default roleRouter;

/* import { Router } from "express";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  addPermissionsToRole,
  removePermissionsFromRole,
} from "../controllers/role.controller.js";
import { isAuthenticated, hasPermissionForFeature } from "../middlewares/auth.js";

const roleRouter = Router();

// Routes nécessitant l'authentification
roleRouter.use(isAuthenticated);

// Routes pour les rôles
roleRouter.get("/", hasPermissionForFeature("view_roles"), getAllRoles);
roleRouter.get("/:id", hasPermissionForFeature("view_roles"), getRoleById);
roleRouter.post("/", hasPermissionForFeature("create_role"), createRole);
roleRouter.put("/:id", hasPermissionForFeature("update_role"), updateRole);
roleRouter.delete("/:id", hasPermissionForFeature("delete_role"), deleteRole);

// Routes pour la gestion des permissions associées aux rôles
roleRouter.post("/:id/permissions", hasPermissionForFeature("manage_role_permissions"), addPermissionsToRole);
roleRouter.delete("/:id/permissions", hasPermissionForFeature("manage_role_permissions"), removePermissionsFromRole);

export default roleRouter; */
