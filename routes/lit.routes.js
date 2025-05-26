import { Router } from "express";
import {
  assignBedToRoom,
  createBed,
  deleteBed,
  getAllLits,
  getLitByNumber,
  getLitByStatus,
  getSingleLit,
  unassignBedFromRoom,
  updateBed,
} from "../controllers/lit.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const litRouter = Router();

litRouter.use(authenticationJWT);

litRouter.get("/", authenticationJWT, getAllLits);
litRouter.get("/:id", getSingleLit);
litRouter.get("/status/:status", getLitByStatus);
litRouter.get("/number/:bedNumber", getLitByNumber);

litRouter.post("/add", createBed);

litRouter.patch("/update/:id", updateBed);
litRouter.patch("/bed/:idBed/assignroom", assignBedToRoom);
litRouter.patch("/bed/:idBed/unassignroom", unassignBedFromRoom);

litRouter.delete("/delete/:idBed", deleteBed);

export default litRouter;
