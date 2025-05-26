import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import { PORT, URL_ORIGIN } from "./config/env.js";
import errorMiddleware, { errorLogs } from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import roleRouter from "./routes/role.routes.js";
import patientRouter from "./routes/patient.routes.js";
import chambreRouter from "./routes/chambre.routes.js";
import litRouter from "./routes/lit.routes.js";
import featureRouter from "./routes/feature.routes.js";
import permissionRouter from "./routes/permission.routes.js";
import { syncModels } from "./models/index.model.js";
import { setupSwagger } from "./swagger.js";
import mensurationRouter from "./routes/mensuration.route.js";
import prescriptionRouter from "./routes/prescription.route.js";
import outingRouter from "./routes/outing.route.js";
import hospitalizationRouter from "./routes/hospitalization.route.js";
import examenTypeRouter from "./routes/examenType.route.js";
import examenRouter from "./routes/examen.route.js";
import interventionRouter from "./routes/intervention.route.js";
import consommationRouter from "./routes/consommation.route.js";
import medecineAdministrationRouter from "./routes/medecineAdministration.route.js";
import consultationRouter from "./routes/consultation.route.js";
import antecedentRouter from "./routes/antecedent.route.js";
import suivieRouter from "./routes/suivie.route.js";
import abonnementRouter from "./routes/abonnement.route.js";
import dashboardRouter from "./routes/dashboard.route.js";

const app = express();

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1024mb" }));
app.use(bodyParser.json({ limit: "1024mb" }));
app.use(cors());
app.use(
  cors({
    origin: [URL_ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    headers: {
      "Content-Type": ["application/json", "application/x-www-form-urlencoded"],
    },
  })
);

setupSwagger(app);

app.get("/", (req, res) => {
  return res
    .status(200)
    .json({
      message: `Checking Medicure API => Passed successfully at ${new Date()}\nDocumentation Swagger sur http://localhost:${PORT}/api-docs/`,
    });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/roles", roleRouter);
app.use("/api/patients", patientRouter);
app.use("/api/rooms", chambreRouter);
app.use("/api/beds", litRouter);
app.use("/api/features", featureRouter);
app.use("/api/permissions", permissionRouter);
app.use("/api/mensurations", mensurationRouter);
app.use("/api/prescriptions", prescriptionRouter);
app.use("/api/outings", outingRouter);
app.use("/api/hospitalizations", hospitalizationRouter);
app.use("/api/examentypes", examenTypeRouter);
app.use("/api/examens", examenRouter);
app.use("/api/interventions", interventionRouter);
app.use("/api/consommations", consommationRouter);
app.use("/api/medecineadministrations", medecineAdministrationRouter);
app.use("/api/consultations", consultationRouter);
app.use("/api/antecedents", antecedentRouter);
app.use("/api/suivies", suivieRouter);
app.use("/api/abonnements", abonnementRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/api/error", errorLogs);
app.use(errorMiddleware);

app.listen(PORT, async (err) => {
  if (err) {
    console.log(`Une erreur s'est produite: ${err}`);
  } else {
    try {
      await syncModels();
      console.log(`Le serveur est lancé au http://localhost:${PORT}/`);
      console.log(
        `Documentation Swagger sur http://localhost:${PORT}/api-docs/`
      );
    } catch (error) {
      console.error("Erreur lors de la synchronisation des modèles:", error);
    }
  }
});

export default app;
