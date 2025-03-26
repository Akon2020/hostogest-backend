import { Router } from "express";
import {
  addChambre,
  deleteChambre,
  getAllChambres,
  getChambreByType,
  getSingleChambre,
  updateChambre,
} from "../controllers/chambre.controller.js";

const chambreRouter = Router();

chambreRouter.get("/", getAllChambres);
chambreRouter.get("/:id", getSingleChambre);
chambreRouter.get("type/:id", getChambreByType);

chambreRouter.post("/add", addChambre);

chambreRouter.put("/update/:id", updateChambre);

chambreRouter.delete("/delete/:id", deleteChambre);

export default chambreRouter;
