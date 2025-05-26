import { Router } from "express";
import {
  createAbonnement,
  deleteAbonnement,
  getAllAbonnements,
  getPatientAbonnement,
  getSingleAllAbonnement,
  updateAbonnement,
} from "../controllers/abonnement.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

/**
 * @swagger
 * tags:
 *   name: Abonnements
 *   description: API pour gérer les abonnements médicaux des patients
 */
const abonnementRouter = Router();

abonnementRouter.use(authenticationJWT);

/**
 * @swagger
 * /api/abonnements:
 *   get:
 *     summary: Récupérer tous les abonnements
 *     tags: [Abonnements]
 *     responses:
 *       200:
 *         description: Liste des abonnements récupérée avec succès
 */
abonnementRouter.get("/", getAllAbonnements);

/**
 * @swagger
 * /api/abonnements/{id}:
 *   get:
 *     summary: Récupérer un abonnement par ID
 *     tags: [Abonnements]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'abonnement
 *     responses:
 *       200:
 *         description: Abonnement trouvé
 *       400:
 *         description: Abonnement non trouvé
 */
abonnementRouter.get("/:id", getSingleAllAbonnement);

/**
 * @swagger
 * /api/abonnements/patient/{id}:
 *   get:
 *     summary: Récupérer les abonnements d’un patient
 *     tags: [Abonnements]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du patient
 *     responses:
 *       200:
 *         description: Liste des abonnements du patient récupérée
 *       404:
 *         description: Patient ou abonnements non trouvés
 */
abonnementRouter.get("/patient/:id", getPatientAbonnement);

/**
 * @swagger
 * /api/abonnements/add:
 *   post:
 *     summary: Créer un nouvel abonnement
 *     tags: [Abonnements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idPatient
 *               - organisation
 *               - abonnementDate
 *             properties:
 *               idPatient:
 *                 type: integer
 *               organisation:
 *                 type: string
 *               abonnementDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Abonnement créé avec succès
 *       400:
 *         description: Données invalides
 */
abonnementRouter.post("/add", createAbonnement);

/**
 * @swagger
 * /api/abonnements/update/{id}:
 *   patch:
 *     summary: Mettre à jour un abonnement
 *     tags: [Abonnements]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'abonnement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPatient:
 *                 type: integer
 *               organisation:
 *                 type: string
 *               abonnementDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Abonnement mis à jour avec succès
 *       400:
 *         description: Abonnement ou patient non trouvé
 */
abonnementRouter.patch("/update/:id", updateAbonnement);

/**
 * @swagger
 * /api/abonnements/delete/{id}:
 *   delete:
 *     summary: Supprimer un abonnement
 *     tags: [Abonnements]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'abonnement
 *     responses:
 *       200:
 *         description: Abonnement supprimé avec succès
 *       400:
 *         description: Abonnement non trouvé
 */
abonnementRouter.delete("/delete/:id", deleteAbonnement);

export default abonnementRouter;
