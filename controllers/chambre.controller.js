import ChambreModel from "../models/chambre.model.js";

export const getAllChambres = async (req, res, next) => {
  try {
    const chambres = await ChambreModel.findAllChambres();
    return res
      .status(200)
      .json({ nombre: chambres.length, utilisateurs: chambres });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleChambre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chambre = await ChambreModel.findChambreById(id);

    if (!chambre) {
      return res
        .status(400)
        .json({ message: "Cette chambre n'existe pas dans notre système" });
    }
    return res.status(200).json({ chambreInfo: chambre });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getChambreByType = async (req, res, next) => {
  try {
    const { type } = req.query;
    const chambre = await ChambreModel.findChambreByType(type);
    if (!chambre) {
      return res.status(400).json({
        message: "Ce type de chambre n'existe pas dans notre système",
      });
    }
    return res.status(200).json({ chambreInfo: chambre });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const addChambre = async (req, res, next) => {
  try {
    const { numero, type, tarif } = req.body;

    if (!numero || !type || !tarif) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner tout les champs!" });
    }
    const chambreExist = await ChambreModel.findChambreByNum(numero);
    if (chambreExist) {
      return res.status(400).json({
        message: "Cette chambre a déjà été enregistrer dans notre système",
      });
    }
    const newChambre = await ChambreModel.createChambre({
      numero,
      type,
      tarif,
    });
    res.status(201).json({
      message: `La chambre ${numero} a été créé avec succès`,
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
    const { numero, type, tarif, statut } = req.body;

    if (!numero || !type || !tarif) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner tout les champs!" });
    }

    const chambreExist = await ChambreModel.findChambreById(id);
    if (!chambreExist) {
      return res.status(400).json({
        message: "Cette chambre n'existe pas dans notre système",
      });
    }

    const chambre = await ChambreModel.updateChambre(id, {
      numero,
      type,
      tarif,
      statut,
    });

    if (chambre.affectedRows > 0) {
      res.status(200).json({
        message: `Les informations de la chambre ${chambreExist.numero} ont été mis à jour avec succès`,
      });
    } else {
      res.status(404).json({ message: "Information non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteChambre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chambreExist = await ChambreModel.findChambreById(id);

    if (!chambreExist) {
      return res
        .status(400)
        .json({ message: "Cette chambre n'existe pas dans notre système" });
    }

    const deleteChambre = await ChambreModel.deleteChambre(id)
    if (deleteChambre.affectedRows > 0) {
        res.status(200).json({
          message: `La chambre ${chambreExist.numero} a été supprimé avec succès`,
        });
      } else {
        res.status(404).json({ message: "Information non trouvée" });
      }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
