import ChambreModel from "../models/chambre.model.js";
import LitModel from "../models/lit.model.js";

export const getAllLits = async (req, res, next) => {
  try {
    const Lits = await LitModel.findAllLits();
    return res.status(200).json({ nombre: Lits.length, LitsInfo: Lits });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleLit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lit = await LitModel.findLitById(id);

    if (!lit) {
      return res
        .status(400)
        .json({ message: "Ce lit n'existe pas dans notre système" });
    }
    return res.status(200).json({ litInfo: lit });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getLitByStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const lit = await LitModel.findLitByStatus(status);
    if (!lit) {
      return res.status(400).json({
        message: "Ce status de lit n'existe pas dans notre système",
      });
    }
    return res.status(200).json({ litInfo: lit });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const addLit = async (req, res, next) => {
  try {
    const { idChambre } = req.body;
    if (!idChambre) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner tout les champs!" });
    }
    const chambreExist = await ChambreModel.findChambreById(idChambre);
    if (!chambreExist) {
      return res.status(400).json({
        message: "Cette chambre n'existe dans notre système",
      });
    }
    const newLit = await LitModel.createLit(idChambre);
    res.status(201).json({
      message: `Le Lit numéro ${newLit.id_lit} a été créé et affecté à la chambre ${chambreExist.numero} avec succès`,
      data: newLit,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateLitInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { idChambre, statut } = req.body;

    if (!idChambre || !statut) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner tout les champs!" });
    }

    const litExist = await LitModel.findLitById(id);
    if (!litExist) {
      return res.status(400).json({
        message: "Ce lit n'existe pas dans notre système",
      });
    }

    const lit = await LitModel.updateLit(id, {
      idChambre,
      statut,
    });

    if (lit.affectedRows > 0) {
      res.status(200).json({
        message: `Les informations du lit ${litExist.id_lit} ont été mis à jour avec succès`,
      });
    } else {
      res.status(404).json({ message: "Information non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteLitInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const litExist = await LitModel.findLitById(id);

    if (!litExist) {
      return res
        .status(400)
        .json({ message: "Ce lit n'existe pas dans notre système" });
    }

    const deleteLit = await LitModel.deleteLit(id);
    if (deleteLit.affectedRows > 0) {
      res.status(200).json({
        message: `Le lit numéro ${litExist.id_lit} a été supprimé avec succès`,
      });
    } else {
      res.status(404).json({ message: "Information non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
