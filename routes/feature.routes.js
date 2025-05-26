import { Router } from "express";
import {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
} from "../controllers/feature.controller.js";
import {
  authenticationJWT,
  hasPermissionForFeature,
} from "../middlewares/auth.middleware.js";

const featureRouter = Router();

featureRouter.use(authenticationJWT);

featureRouter.get(
  "/",
  hasPermissionForFeature("view_features"),
  getAllFeatures
);
featureRouter.get(
  "/:id",
  hasPermissionForFeature("view_features"),
  getFeatureById
);
featureRouter.post(
  "/",
  hasPermissionForFeature("create_feature"),
  createFeature
);
featureRouter.put(
  "/:id",
  hasPermissionForFeature("update_feature"),
  updateFeature
);
featureRouter.delete(
  "/:id",
  hasPermissionForFeature("delete_feature"),
  deleteFeature
);

export default featureRouter;
