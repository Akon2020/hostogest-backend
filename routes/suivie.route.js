import { Router } from "express";
import {
  createSuivie,
  deleteSuivie,
  getAllSuivies,
  getConsultationSuivie,
  getPatientSuivie,
  getSingleSuivie,
  getUserSuivie,
  updateSuivie,
} from "../controllers/suivie.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const suivieRouter = Router();

suivieRouter.use(authenticationJWT);

suivieRouter.get("/", getAllSuivies);
suivieRouter.get("/:id", getSingleSuivie);
suivieRouter.get("/patient/:id", getPatientSuivie);
suivieRouter.get("/user/:id", getUserSuivie);
suivieRouter.get("/consultation/:id", getConsultationSuivie);

suivieRouter.post("/add", createSuivie);

suivieRouter.patch("/update/:id", updateSuivie);

suivieRouter.delete("/delete/:id", deleteSuivie);

export default suivieRouter;
