import { Router } from "express";
import {
  addPatient,
  deletePatientInfo,
  getAllPatients,
  getSinglePatient,
  updatePatientInfo,
} from "../controllers/patient.controller.js";

const patientRouter = Router();

patientRouter.get("/", getAllPatients);
patientRouter.get("/:id", getSinglePatient);

patientRouter.post("/add", addPatient);

patientRouter.put("/update/:id", updatePatientInfo);

patientRouter.delete("/delete/:id", deletePatientInfo);

export default patientRouter;
