import { Router } from "express";
import {
  createConsultation,
  getAllConsultations,
  getPatientConsultation,
  getSingleConsultation,
  getUserConsultation,
  updateConsultation,
} from "../controllers/consultation.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const consultationRouter = Router();

consultationRouter.use(authenticationJWT);

consultationRouter.get("/", getAllConsultations);
consultationRouter.get("/:id", getSingleConsultation);
consultationRouter.get("/patient/:id", getPatientConsultation);
consultationRouter.get("/user/:id", getUserConsultation);

consultationRouter.post("/add", createConsultation);

consultationRouter.patch("/update/:id", updateConsultation);

consultationRouter.delete("/delete/:id");

export default consultationRouter;
