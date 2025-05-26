import { Router } from "express";
import {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
  addFeaturesToPermission,
  removeFeaturesFromPermission,
} from "../controllers/permission.controller.js";
import { authenticationJWT, hasPermissionForFeature } from "../middlewares/auth.middleware.js";

const permissionRouter = Router();

permissionRouter.use(authenticationJWT);

permissionRouter.get("/", hasPermissionForFeature("view_permissions"), getAllPermissions);
permissionRouter.get("/:id", hasPermissionForFeature("view_permissions"), getPermissionById);
permissionRouter.post("/", hasPermissionForFeature("create_permission"), createPermission);
permissionRouter.put("/:id", hasPermissionForFeature("update_permission"), updatePermission);
permissionRouter.delete("/:id", hasPermissionForFeature("delete_permission"), deletePermission);


permissionRouter.post("/:id/features", hasPermissionForFeature("manage_permission_features"), addFeaturesToPermission);
permissionRouter.delete("/:id/features", hasPermissionForFeature("manage_permission_features"), removeFeaturesFromPermission);

export default permissionRouter;


/* import { Router } from "express";
import {
  addFeaturesToPermission,
  removeFeaturesFromPermission,
  removeAllFeaturesFromPermission,
  updateFeaturesForPermission,
  getUserAccessRolesAndPermissions,
  assignAccessFlow,
  getFeaturesByPermission,
} from "../controllers/permission.controller.js";

const permissionRouter = Router();

permissionRouter.get("/user-access/:email", getUserAccessRolesAndPermissions);
permissionRouter.get("/features/:permissionName", getFeaturesByPermission);

permissionRouter.post("/assign-access", assignAccessFlow);
permissionRouter.post("/add-features", addFeaturesToPermission);

permissionRouter.post("/update-features", updateFeaturesForPermission);
permissionRouter.post("/remove-features", removeFeaturesFromPermission);
permissionRouter.post("/remove-all-features", removeAllFeaturesFromPermission);

export default permissionRouter;
 */