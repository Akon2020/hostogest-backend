import { Router } from "express";
import {
  createExamenType,
  deleteExamenType,
  getAllExamenTypes,
  getSingleExamenType,
  updateExamenType,
} from "../controllers/examentype.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const examenTypeRouter = Router();

examenTypeRouter.use(authenticationJWT);

examenTypeRouter.get("/", getAllExamenTypes);
examenTypeRouter.get("/:id", getSingleExamenType);

examenTypeRouter.post("/add", createExamenType);

examenTypeRouter.patch("/update/:id", updateExamenType);

examenTypeRouter.delete("/delete/:id", deleteExamenType);

export default examenTypeRouter;
