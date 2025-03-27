import { Router } from "express";
import {
  addLit,
  deleteLitInfo,
  getAllLits,
  getLitByStatus,
  getSingleLit,
  updateLitInfo,
} from "../controllers/lit.controller.js";

const litRouter = Router();

litRouter.get("/", getAllLits);
litRouter.get("/:id", getSingleLit);
litRouter.get("/status/:id", getLitByStatus);

litRouter.post("/add", addLit);

litRouter.put("/update/:id", updateLitInfo);

litRouter.delete("/delete/:id", deleteLitInfo);

export default litRouter;
