import { MedecineAdministration } from "../models/index.model.js";

export const getAllMedecineAdministrations = async (req, res, next) => {
  try {
    const medecineAdministrations = await MedecineAdministration.findAll();
    return res.status(200).json({
      nombre: medecineAdministrations.length,
      medecineAdministrationsInfo: medecineAdministrations,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleMedecineAdministration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medecineAdministration = await MedecineAdministration.findByPk(id);
    return res.status(200).json({
      medecineAdministrationInfo: medecineAdministration,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createMedecineAdministration = async (req, res, next) => {
  try {
    const { nomMedicament } = req.body;

    if (!nomMedicament) {
      return res.status(400).json({
        message: "Le nom du medicament est réquis",
      });
    }
    const newMedecineAdministration = await MedecineAdministration.create({
      nomMedicament,
    });

    res.status(201).json({
      message: `Les données du medicament ont été créé avec succès`,
      data: newMedecineAdministration,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateMedecineAdministration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = ["nomMedicament"];
    const donneesAMettreAJour = {};
    champsModifiables.forEach((champ) => {
      if (req.body[champ] !== undefined) {
        donneesAMettreAJour[champ] = req.body[champ];
      }
    });

    const existingMedecinAdministration = await MedecineAdministration.findByPk(
      id
    );
    if (!existingMedecinAdministration) {
      return res.status(400).json({
        message: "Cet administration n'existe pas dans notre système",
      });
    }

    const medecineAdministration = await existingMedecinAdministration.update(
      donneesAMettreAJour
    );

    return res.status(200).json({
      message: `Les informations de l'administration ${existingMedecinAdministration.idMedecineAdministration} ont été mis à jour avec succès`,
      data: medecineAdministration,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteMedecineAdministration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medecineAdministrationExist = await MedecineAdministration.findByPk(
      id
    );

    if (!medecineAdministrationExist) {
      return res.status(400).json({
        message:
          "Cette MedecineAdministration n'est pas enregistrée dans notre système",
      });
    }

    await medecineAdministrationExist.destroy();
    res.status(200).json({
      message: `L'administration medicamentateuse ${medecineAdministrationExist.idMedecineAdministration} a été supprimé avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
