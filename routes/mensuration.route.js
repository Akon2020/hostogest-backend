import { Router } from "express";
import {
  createMensuration,
  deleteMensuration,
  getAllMensurations,
  getSingleMensuration,
  updateMensuration,
} from "../controllers/mensuration.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const mensurationRouter = Router();

mensurationRouter.use(authenticationJWT);

mensurationRouter.get("/", getAllMensurations);
mensurationRouter.get("/:id", getSingleMensuration);

mensurationRouter.post("/add", createMensuration);

mensurationRouter.patch("/update/:id", updateMensuration);

mensurationRouter.delete("/delete/:id", deleteMensuration);

export default mensurationRouter;
