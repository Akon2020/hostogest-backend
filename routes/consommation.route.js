import { Router } from "express";
import {
  deleteConsommation,
  getAllConsommations,
  getSingleConsommation,
  updateConsommation,
} from "../controllers/consommation.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const consommationRouter = Router();

consommationRouter.use(authenticationJWT);

consommationRouter.get("/", getAllConsommations);
consommationRouter.get("/:id", getSingleConsommation);

consommationRouter.patch("/update/:id", updateConsommation);

consommationRouter.delete("/delete/:id", deleteConsommation);

export default consommationRouter;
