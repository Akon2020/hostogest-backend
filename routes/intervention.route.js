import { Router } from "express";
import {
  deleteIntervention,
  getAllInterventions,
  getSingleIntervention,
  updateIntervention,
} from "../controllers/intervention.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const interventionRouter = Router();

interventionRouter.use(authenticationJWT);

interventionRouter.get("/", getAllInterventions);
interventionRouter.get("/:id", getSingleIntervention);

interventionRouter.patch("/update/:id", updateIntervention);

interventionRouter.delete("/delete/:id", deleteIntervention);

export default interventionRouter;
