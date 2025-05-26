import { Router } from "express";
import {
  createHospitalization,
  deleteHospitalization,
  getAllHospitalizations,
  getPatientHospitalization,
  getSingleHospitalization,
  updateHospitalization,
} from "../controllers/hospitalization.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const hospitalizationRouter = Router();

hospitalizationRouter.use(authenticationJWT);

hospitalizationRouter.get("/", getAllHospitalizations);
hospitalizationRouter.get("/:id", getSingleHospitalization);
hospitalizationRouter.get("/patient/:id", getPatientHospitalization);

hospitalizationRouter.post("/add", createHospitalization);

hospitalizationRouter.patch("/update/:id", updateHospitalization);

hospitalizationRouter.delete("/delete/:id", deleteHospitalization);

export default hospitalizationRouter;
