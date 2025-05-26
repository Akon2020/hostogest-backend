import { Intervention } from "../models/index.model.js";

export const getAllInterventions = async (req, res, next) => {
  try {
    const interventions = await Intervention.findAll();
    return res
      .status(200)
      .json({ nombre: interventions.length, interventionsInfo: interventions });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleIntervention = async (req, res, next) => {
  try {
    const { id } = req.params;
    const intervention = await Intervention.findByPk(id);
    return res.status(200).json({ interventionInfo: intervention });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createIntervention = async (req, res, next) => {
  try {
    const { intervationType } = req.body;
    const intervention = await Intervention.findOne({
      where: { intervationType },
    });
    if (intervention) {
      return res.status(403).json({
        message: "Cet intervention est déjà enregistrée dans notre système",
      });
    }
    const newInterventionType = await Intervention.create({ intervationType });
    return res.status(201).json({
      message: `Les données du nouvel intervention ont été enregistrées avec succès`,
      data: newInterventionType,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateIntervention = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = ["intervationType"];
    const donneesAMettreAJour = {};
    champsModifiables.forEach((champ) => {
      if (req.body[champ] !== undefined) {
        donneesAMettreAJour[champ] = req.body[champ];
      }
    });
    const existingIntervention = await Intervention.findByPk(id);
    if (!existingIntervention) {
      return res.status(403).json({
        message: "Cet intervention n'est pas enregistrée dans notre système",
      });
    }
    const interventionType = await Intervention.update(donneesAMettreAJour);
    return res.status(200).json({
      message: `Les informations de l'intervention ${existingIntervention.intervationType} ont été mis à jour avec succès`,
      data: interventionType,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteIntervention = async (req, res, next) => {
  try {
    const { id } = req.params;
    const interventionExist = await Intervention.findByPk(id);

    if (!interventionExist) {
      return res.status(400).json({
        message: "Cet intervention n'est pas enregistrée dans notre système",
      });
    }

    await interventionExist.destroy();
    res.status(200).json({
      message: `L'intervention' ${interventionExist.intervationType} a été supprimé avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
