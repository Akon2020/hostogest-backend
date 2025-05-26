import { Consommation } from "../models/index.model.js";

export const getAllConsommations = async (req, res, next) => {
  try {
    const consommations = await Consommation.findAll();
    return res
      .status(200)
      .json({ nombre: consommations.length, consommationsInfo: consommations });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleConsommation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const consommation = await Consommation.findByPk(id);
    return res.status(200).json({ consommationInfo: consommation });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createConsommation = async (req, res, next) => {
  try {
    const { designation, quantite, unite, prixUnitaire } = req.body;
    if (!designation || !quantite || !unite) {
      return res.status(400).json({
        message: "La designation, la quantite et l'unite sont réquis",
      });
    }
    const newConsommation = await Consommation.create({
      designation,
      quantite,
      unite,
      prixUnitaire,
    });

    return res.status(201).json({
      message: `Les données de consommation ont été créé avec succès`,
      data: newConsommation,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateConsommation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = [
      "designation",
      "quantite",
      "unite",
      "prixUnitaire",
    ];
    const donneesAMettreAJour = {};
    champsModifiables.forEach((champ) => {
      if (req.body[champ] !== undefined) {
        donneesAMettreAJour[champ] = req.body[champ];
      }
    });

    const consommationExist = await Consommation.findByPk(id);
    if (!consommationExist) {
      return res.status(400).json({
        message: "Cette consommation n'existe pas dans notre système",
      });
    }

    const consommation = await consommationExist.update(donneesAMettreAJour);

    return res.status(200).json({
      message: `Les informations de la consommation ${consommationExist.idConsommation} ont été mis à jour avec succès`,
      data: consommation,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteConsommation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const consommationExist = await Consommation.findByPk(id);

    if (!consommationExist) {
      return res.status(400).json({
        message: "Cette consommation n'est pas enregistrée dans notre système",
      });
    }

    await consommationExist.destroy();
    res.status(200).json({
      message: `La consommation ${consommationExist.idConsommation} a été supprimé avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
