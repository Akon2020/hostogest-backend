import { Router } from "express";
import {
  createAntecedent,
  deleteAntecedent,
  getAllAntecedents,
  getPatientAntecedent,
  getSingleAllAntecedent,
  updateAntecedent,
} from "../controllers/antecedent.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

/**
 * @swagger
 * tags:
 *   name: Antécédents
 *   description: API pour gérer les antécédents médicaux des patients
 */
const antecedentRouter = Router();

antecedentRouter.use(authenticationJWT);

/**
 * @swagger
 * /api/antecedents:
 *   get:
 *     summary: Récupérer tous les antécédents
 *     tags: [Antécédents]
 *     responses:
 *       200:
 *         description: Liste des antécédents récupérée avec succès
 */
antecedentRouter.get("/", getAllAntecedents);

/**
 * @swagger
 * /api/antecedents/{id}:
 *   get:
 *     summary: Récupérer un antécédent par ID
 *     tags: [Antécédents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'antécédent
 *     responses:
 *       200:
 *         description: Antécédent trouvé
 *       400:
 *         description: Antécédent non trouvé
 */
antecedentRouter.get("/:id", getSingleAllAntecedent);

/**
 * @swagger
 * /api/antecedents/patient/{id}:
 *   get:
 *     summary: Récupérer les antécédents d’un patient
 *     tags: [Antécédents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du patient
 *     responses:
 *       200:
 *         description: Liste des antécédents du patient récupérée
 *       404:
 *         description: Patient ou antécédents non trouvés
 */
antecedentRouter.get("/patient/:id", getPatientAntecedent);

/**
 * @swagger
 * /api/antecedents/add:
 *   post:
 *     summary: Créer un nouvel antécédent
 *     tags: [Antécédents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idPatient
 *               - description
 *             properties:
 *               idPatient:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Antécédent créé avec succès
 *       400:
 *         description: Données invalides
 */
antecedentRouter.post("/add", createAntecedent);

/**
 * @swagger
 * /api/antecedents/update/{id}:
 *   patch:
 *     summary: Mettre à jour un antécédent
 *     tags: [Antécédents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'antécédent
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPatient:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Antécédent mis à jour avec succès
 *       400:
 *         description: Antécédent ou patient non trouvé
 */
antecedentRouter.patch("/update/:id", updateAntecedent);

/**
 * @swagger
 * /api/antecedents/delete/{id}:
 *   delete:
 *     summary: Supprimer un antécédent
 *     tags: [Antécédents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'antécédent
 *     responses:
 *       200:
 *         description: Antécédent supprimé avec succès
 *       400:
 *         description: Antécédent non trouvé
 */
antecedentRouter.delete("/delete/:id", deleteAntecedent);

export default antecedentRouter;
