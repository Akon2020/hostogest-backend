import { Router } from "express";
import {
  addChambre,
  deleteChambre,
  getAllChambres,
  getChambreByType,
  getSingleChambre,
  updateChambre,
} from "../controllers/chambre.controller.js";
import { authenticationJWT } from "../middlewares/auth.middleware.js";

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: API pour gérer les antécédents médicaux des patients
 */
const chambreRouter = Router();

chambreRouter.use(authenticationJWT);

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Récupérer toutes les chambres
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Liste des antécédents récupérée avec succès
 */
chambreRouter.get("/", getAllChambres);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Récupérer une chambre par ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la chambre
 *     responses:
 *       200:
 *         description: Chambre trouvé
 *       400:
 *         description: Chambre non trouvé
 */
chambreRouter.get("/:id", getSingleChambre);

/**
 * @swagger
 * /api/rooms/type/{type}:
 *   get:
 *     summary: Récupérer une chambre par son type
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: Type de la chambre
 *     responses:
 *       200:
 *         description: Chambre trouvé
 *       400:
 *         description: Chambre non trouvé
 */
chambreRouter.get("/type/:type", getChambreByType);

/**
 * @swagger
 * /api/rooms/add:
 *   post:
 *     summary: Créer une nouvelle chambre
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomNumber
 *               - type
 *               - price
 *             properties:
 *               roomNumber:
 *                 type: string
 *                 example: "CHAMB001"
 *               type:
 *                 type: string
 *                 example: "Commune"
 *               price:
 *                 type: number
 *                 format: decimal
 *                 example: 50.0
 *     responses:
 *       201:
 *         description: Chambre créée avec succès
 *       400:
 *         description: Données invalides
 */
chambreRouter.post("/add", addChambre);

/**
 * @swagger
 * /api/rooms/update/{id}:
 *   patch:
 *     summary: Mettre à jour une chambre existante
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la chambre à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomNumber:
 *                 type: string
 *                 example: "101B"
 *               type:
 *                 type: string
 *                 example: "deluxe"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 75.0
 *     responses:
 *       200:
 *         description: Chambre mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Chambre non trouvée
 */
chambreRouter.patch("/update/:id", updateChambre);

/**
 * @swagger
 * /api/rooms/delete/{id}:
 *   delete:
 *     summary: Supprimer une chambre
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la chambre à supprimer
 *     responses:
 *       200:
 *         description: Chambre supprimée avec succès
 *       404:
 *         description: Chambre non trouvée
 */
chambreRouter.delete("/delete/:id", deleteChambre);

export default chambreRouter;
