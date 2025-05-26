import { Router } from "express";
import {
  createExamen,
  deleteExamen,
  getAllExamens,
  getSingleExamen,
  updateExamen,
} from "../controllers/examen.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const examenRouter = Router();

examenRouter.use(authenticationJWT);

examenRouter.get("/", getAllExamens);
examenRouter.get("/:id", getSingleExamen);

examenRouter.post("/add", createExamen);

examenRouter.patch("/update/:id", updateExamen);

examenRouter.delete("/delete/:id", deleteExamen);

export default examenRouter;
