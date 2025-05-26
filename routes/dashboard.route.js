import { Router } from "express";
import {
  getDashboardStats,
  getPatientDetailedInfo,
} from "../controllers/dashboard.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const dashboardRouter = Router();

dashboardRouter.get("/stats", authenticationJWT, getDashboardStats);

dashboardRouter.get(
  "/patient/:idPatient",
  authenticationJWT,
  getPatientDetailedInfo
);

export default dashboardRouter;
