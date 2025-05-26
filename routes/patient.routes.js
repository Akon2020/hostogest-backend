import { Router } from "express";
import {
  addPatient,
  deletePatientInfo,
  getAllPatients,
  getSinglePatient,
  updatePatientInfo,
} from "../controllers/patient.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const patientRouter = Router();
patientRouter.use(authenticationJWT);

patientRouter.get("/", authenticationJWT, getAllPatients);
patientRouter.get("/:id", getSinglePatient);

patientRouter.post("/add", authenticationJWT, addPatient);

patientRouter.patch("/update/:id", updatePatientInfo);

patientRouter.delete("/delete/:id", deletePatientInfo);

export default patientRouter;
