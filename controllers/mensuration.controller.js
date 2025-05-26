import { Mensuration } from "../models/index.model.js";

export const getAllMensurations = async (req, res, next) => {
  try {
    const mensurations = await Mensuration.findAll();
    return res
      .status(200)
      .json({ nombre: mensurations.length, mensurationsInfo: mensurations });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleMensuration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mensuration = await Mensuration.findByPk(id);

    if (!mensuration) {
      return res.status(400).json({
        message: "Cette mensuration n'est pas enregistrée dans notre système",
      });
    }
    return res.status(200).json({ mensurationInfo: mensuration });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createMensuration = async (req, res, next) => {
  try {
    const {
      temperature,
      respiratoryRate,
      heartRate,
      bloodPressure,
      weight,
      size,
      bodyMassIndex,
      bloodOxygenSaturation,
      pignetIndex,
    } = req.body;

    if (!temperature || !respiratoryRate || !heartRate) {
      return res.status(400).json({
        message:
          "La temperature, la fréquence respiratoire et le battement cardiaque sont réquis",
      });
    }
    const newMensuration = await Mensuration.create({
      temperature,
      respiratoryRate,
      heartRate,
      bloodPressure,
      weight,
      size,
      bodyMassIndex,
      bloodOxygenSaturation,
      pignetIndex,
    });

    return res.status(201).json({
      message: `Les données de mensuration ont été créé avec succès`,
      data: newMensuration,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateMensuration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = [
      "temperature",
      "respiratoryRate",
      "heartRate",
      "bloodPressure",
      "weight",
      "size",
      "bodyMassIndex",
      "bloodOxygenSaturation",
      "pignetIndex",
    ];
    const donneesAMettreAJour = {};
    champsModifiables.forEach((champ) => {
      if (req.body[champ] !== undefined) {
        donneesAMettreAJour[champ] = req.body[champ];
      }
    });

    const mensurationExist = await Mensuration.findByPk(id);
    if (!mensurationExist) {
      return res.status(400).json({
        message: "Cette mensuration n'existe pas dans notre système",
      });
    }

    const mensuration = await mensurationExist.update(donneesAMettreAJour);

    return res.status(200).json({
      message: `Les informations de la mensuration ${mensurationExist.idMensuration} ont été mis à jour avec succès`,
      data: mensuration,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteMensuration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mensurationExist = await Mensuration.findByPk(id);

    if (!mensurationExist) {
      return res.status(400).json({
        message: "Cette mensuration n'est pas enregistrée dans notre système",
      });
    }

    await mensurationExist.destroy();
    res.status(200).json({
      message: `La mensuration ${mensurationExist.idMensuration} a été supprimé avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
