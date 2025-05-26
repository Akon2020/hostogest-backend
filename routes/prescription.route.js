import { Router } from "express";
import {
  createPrescription,
  deletePrescription,
  getAllPrescriptions,
  getSinglePrescription,
  updatePrescription,
} from "../controllers/prescription.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const prescriptionRouter = Router();

prescriptionRouter.use(authenticationJWT);

prescriptionRouter.get("/", getAllPrescriptions);
prescriptionRouter.get("/:id", getSinglePrescription);

prescriptionRouter.post("/add", createPrescription);

prescriptionRouter.patch("/update/:id", updatePrescription);

prescriptionRouter.delete("/delete/:id", deletePrescription);

export default prescriptionRouter;
