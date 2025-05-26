import { Router } from "express";
import { createOuting, deleteOuting, getAllOutings, getSingleOuting, updateOuting } from "../controllers/outing.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

const outingRouter = Router();

outingRouter.use(authenticationJWT);

outingRouter.get("/", getAllOutings);
outingRouter.get("/:id", getSingleOuting);

outingRouter.post("/add", createOuting);

outingRouter.patch("/update/:id", updateOuting);

outingRouter.delete("/delete/:id", deleteOuting);

export default outingRouter;
