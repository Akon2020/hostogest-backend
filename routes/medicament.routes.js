import { Router } from "express";
import {
  addMedicament,
  deleteMedicamentInfo,
  getAllMedicaments,
  getMedicamentByName,
  getSingleMedicament,
  updateMedicamentInfo,
} from "../controllers/medicament.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const medicamentRouter = Router();

medicamentRouter.use(authenticationJWT);

medicamentRouter.get("/", getAllMedicaments);
medicamentRouter.get("/:id", getSingleMedicament);
medicamentRouter.get("/name/:id", getMedicamentByName);

medicamentRouter.post("/add", addMedicament);

medicamentRouter.put("/update/:id", updateMedicamentInfo);

medicamentRouter.delete("/delete/:id", deleteMedicamentInfo);

export default medicamentRouter;
