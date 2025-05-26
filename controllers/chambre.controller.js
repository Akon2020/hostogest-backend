import { Room } from "../models/index.model.js";

export const getAllChambres = async (req, res, next) => {
  try {
    const chambres = await Room.findAll();
    return res.status(200).json({ nombre: chambres.length, rooms: chambres });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleChambre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chambre = await Room.findByPk(id);

    if (!chambre) {
      return res
        .status(400)
        .json({ message: "Cette chambre n'existe pas dans notre système" });
    }
    return res.status(200).json({ room: chambre });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getChambreByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const chambre = await Room.findAll({ where: { type } });

    if (chambre.length === 0) {
      return res.status(404).json({
        message: `Aucune chambre de type '${type}' n'existe dans notre système.`,
      });
    }

    return res.status(200).json({ nombre: chambre.length, room: chambre });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const addChambre = async (req, res, next) => {
  try {
    const { roomNumber, type, price } = req.body;

    if (!roomNumber || !type || !price) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner tout les champs!" });
    }
    const chambreExist = await Room.findOne({ where: { roomNumber } });
    if (chambreExist) {
      return res.status(400).json({
        message: "Cette chambre a déjà été enregistrer dans notre système",
      });
    }
    const newChambre = await Room.create({
      roomNumber,
      type,
      price,
    });
    res.status(201).json({
      message: `La chambre ${roomNumber} a été créé avec succès`,
      data: newChambre,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateChambre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = ["roomNumber", "type", "price"];
    const donneesAMettreAJour = {};
    champsModifiables.forEach((champ) => {
      if (req.body[champ] !== undefined) {
        donneesAMettreAJour[champ] = req.body[champ];
      }
    });

    const chambreExist = await Room.findByPk(id);
    if (!chambreExist) {
      return res.status(400).json({
        message: "Cette chambre n'existe pas dans notre système",
      });
    }

    const chambre = await chambreExist.update(donneesAMettreAJour);

    return res.status(200).json({
      message: `Les informations de la chambre ${chambreExist.roomNumber} ont été mis à jour avec succès`,
      data: chambre,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteChambre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chambreExist = await Room.findByPk(id);

    if (!chambreExist) {
      return res
        .status(400)
        .json({ message: "Cette chambre n'existe pas dans notre système" });
    }

    await chambreExist.destroy();
    res.status(200).json({
      message: `La chambre ${chambreExist.roomNumber} a été supprimé avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
