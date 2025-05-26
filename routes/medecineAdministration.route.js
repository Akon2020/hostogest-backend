import { Router } from "express";
import {
  createMedecineAdministration,
  deleteMedecineAdministration,
  getAllMedecineAdministrations,
  getSingleMedecineAdministration,
  updateMedecineAdministration,
} from "../controllers/medecineAdministration.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const medecineAdministrationRouter = Router();

medecineAdministrationRouter.use(authenticationJWT);

medecineAdministrationRouter.get("/", getAllMedecineAdministrations);
medecineAdministrationRouter.get("/:id", getSingleMedecineAdministration);

medecineAdministrationRouter.post("/add", createMedecineAdministration);

medecineAdministrationRouter.patch("/update/:id", updateMedecineAdministration);

medecineAdministrationRouter.delete(
  "/delete/:id",
  deleteMedecineAdministration
);

export default medecineAdministrationRouter;
