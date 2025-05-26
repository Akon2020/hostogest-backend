import { ExamenType } from "../models/index.model.js";

export const getAllExamenTypes = async (req, res, next) => {
  try {
    const examenTypes = await ExamenType.findAll();
    return res
      .status(200)
      .json({ nombre: examenTypes.length, examenTypesInfo: examenTypes });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleExamenType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const examenType = await ExamenType.findByPk(id);

    if (!examenType) {
      return res.status(400).json({
        message: "Ce type d'examen n'est pas enregistrée dans notre système",
      });
    }
    return res.status(200).json({ examenTypeInfo: examenType });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createExamenType = async (req, res, next) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        message: "Le nom du type d'examen est réquis",
      });
    }
    const newExamenType = await ExamenType.create({ description });

    res.status(201).json({
      message: `Les données du type d'examen ont été créé avec succès`,
      data: newExamenType,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateExamenType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = ["description"];
    const donneesAMettreAJour = {};
    champsModifiables.forEach((champ) => {
      if (req.body[champ] !== undefined) {
        donneesAMettreAJour[champ] = req.body[champ];
      }
    });

    const examenTypeExist = await ExamenType.findByPk(id);
    if (!examenTypeExist) {
      return res.status(400).json({
        message: "Ce type d'examen n'existe pas dans notre système",
      });
    }

    const examenType = await examenTypeExist.update(donneesAMettreAJour);

    return res.status(200).json({
      message: `Les informations du type d'examen ${examenTypeExist.idExamenType} ont été mis à jour avec succès`,
      data: examenType,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteExamenType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const examenTypeExist = await ExamenType.findByPk(id);

    if (!examenTypeExist) {
      return res.status(400).json({
        message: "Cette ExamenType n'est pas enregistrée dans notre système",
      });
    }

    await examenTypeExist.destroy();
    res.status(200).json({
      message: `Le type d'examen ${examenTypeExist.idExamenType} a été supprimé avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
