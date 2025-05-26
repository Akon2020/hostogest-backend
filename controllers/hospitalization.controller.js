import {
  Bed,
  Hospitalization,
  Outing,
  Patient,
} from "../models/index.model.js";

export const getAllHospitalizations = async (req, res, next) => {
  try {
    const hospitalizations = await Hospitalization.findAll();
    return res.status(200).json({
      nombre: hospitalizations.length,
      hospitalizationsInfo: hospitalizations,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleHospitalization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hospitalization = await Hospitalization.findByPk(id);
    if (!hospitalization) {
      return res.status(404).json({
        message:
          "Cette hospitalisation n'est pas enregistrée dans notre système",
      });
    }
    return res.status(200).json({ hospitalizationInfo: hospitalization });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getPatientHospitalization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingPatient = await Patient.findByPk(id);
    if (!existingPatient) {
      return res.status(404).json({
        message: "Ce patient n'est pas enregistré dans notre système",
      });
    }
    const hospitalizations = await Hospitalization.findAll({
      where: { idPatient: existingPatient.idPatient },
    });
    if (!hospitalizations || hospitalizations.length === 0) {
      return res.status(404).json({
        message:
          "Aucune hospitalisation trouvée pour ce patient dans notre système",
      });
    }
    return res.status(200).json({
      nombre: hospitalizations.length,
      hospitalizationInfo: hospitalizations,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createHospitalization = async (req, res, next) => {
  try {
    const { idPatient, idOuting, idBed, description } = req.body;
    if (!idPatient || !idBed || !description) {
      return res.status(400).json({
        message:
          "Vous devez remplir les champs obligatoires : idPatient, idBed et description",
      });
    }
    const existingPatient = await Patient.findByPk(idPatient);
    if (!existingPatient) {
      return res
        .status(404)
        .json({ message: "Ce patient n'existe pas dans notre système" });
    }

    let existingOuting = null;
    if (idOuting) {
      existingOuting = await Outing.findByPk(idOuting);
      if (!existingOuting) {
        return res
          .status(404)
          .json({ message: "Cette sortie n'existe pas dans notre système" });
      }
    }

    const existingBed = await Bed.findByPk(idBed);
    if (!existingBed) {
      return res
        .status(404)
        .json({ message: "Ce lit n'existe pas dans notre système" });
    }
    const newHospitalization = await Hospitalization.create({
      idPatient,
      idOuting,
      idBed,
      description,
    });

    res.status(201).json({
      message: `Les données d'hospitalisation pour le patient ${existingPatient.firstName} ${existingPatient.lastName} ont été créées avec succès`,
      data: newHospitalization,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateHospitalization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = ["idPatient", "idOuting", "idBed", "description"];
    const donneesAMettreAJour = {};

    const hospitalizationExist = await Hospitalization.findByPk(id);
    if (!hospitalizationExist) {
      return res.status(404).json({
        message: "Cette hospitalisation n'existe pas dans notre système",
      });
    }

    for (const champ of champsModifiables) {
      if (req.body[champ] !== undefined) {
        if (champ === "idPatient") {
          const existingPatient = await Patient.findByPk(req.body[champ]);
          if (!existingPatient) {
            return res.status(404).json({ message: "Patient introuvable" });
          }
        } else if (champ === "idOuting" && req.body[champ] !== null) {
          const existingOuting = await Outing.findByPk(req.body[champ]);
          if (!existingOuting) {
            return res.status(404).json({ message: "Sortie introuvable" });
          }
        } else if (champ === "idBed") {
          const existingBed = await Bed.findByPk(req.body[champ]);
          if (!existingBed) {
            return res.status(404).json({ message: "Lit introuvable" });
          }
        }
        donneesAMettreAJour[champ] = req.body[champ];
      }
    }

    if (Object.keys(donneesAMettreAJour).length === 0) {
      return res.status(200).json({
        message: "Aucune donnée à mettre à jour n'a été fournie",
        data: hospitalizationExist,
      });
    }

    const hospitalization = await hospitalizationExist.update(
      donneesAMettreAJour
    );

    return res.status(200).json({
      message: `Les informations de l'hospitalisation ${hospitalizationExist.idHospitalization} ont été mises à jour avec succès`,
      data: hospitalization,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteHospitalization = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hospitalizationExist = await Hospitalization.findByPk(id);
    if (!hospitalizationExist) {
      return res.status(404).json({
        message: "Cette hospitalisation n'existe pas dans notre système",
      });
    }

    await Hospitalization.destroy({
      where: { idHospitalization: id },
    });

    return res.status(200).json({
      message: `L'hospitalisation avec l'ID ${id} a été supprimée avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
