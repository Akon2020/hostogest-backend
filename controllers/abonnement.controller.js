import { Abonnement, Patient } from "../models/index.model.js";

export const getAllAbonnements = async (req, res, next) => {
  try {
    const abonnements = await Abonnement.findAll();
    return res
      .status(200)
      .json({ nombre: abonnements.length, abonnementsInfo: abonnements });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleAllAbonnement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const abonnement = await Abonnement.findByPk(id, {
      include: [
        {
          model: Patient,
          attributes: ["idPatient", "firstName", "lastName", "gender"],
        },
      ],
    });
    if (!abonnement) {
      return res.status(400).json({
        message: "Cet abonnement n'est pas enregistrée dans notre système",
      });
    }
    return res
      .status(200)
      .json({ nombre: abonnement.length, abonnementInfo: abonnement });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getPatientAbonnement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingPatient = await Patient.findByPk(id);
    if (!existingPatient) {
      return res.status(404).json({
        message: "Ce patient n'est pas enregistré dans notre système",
      });
    }
    const abonnement = await Abonnement.findAll({
      where: { idPatient: existingPatient.idPatient },
    });
    if (!abonnement || abonnement.length === 0) {
      return res.status(404).json({
        message: "Aucun abonnement trouvée pour ce patient dans notre système",
      });
    }
    return res
      .status(200)
      .json({ nombre: abonnement.length, abonnementInfo: abonnement });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createAbonnement = async (req, res, next) => {
  try {
    const { idPatient, organisation, abonnementDate } = req.body;

    if (!idPatient || !organisation) {
      return res.status(400).json({
        message:
          "L'ID du patient et la organisation de cet abonnement sont requis",
      });
    }
    const existingPatient = await Patient.findByPk(idPatient);

    if (!existingPatient) {
      return res
        .status(400)
        .json({ message: "Ce patient n'existe pas dans notre système" });
    }

    const newAbonnement = await Abonnement.create({
      idPatient,
      organisation,
      abonnementDate,
    });

    res.status(201).json({
      message: `Les données d'abonnement pour le patient ${existingPatient.firstName} ${existingPatient.lastName} ont été créé avec succès`,
      data: newAbonnement,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateAbonnement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = ["idPatient", "description", "abonnementDate"];
    const donneesAMettreAJour = {};
    champsModifiables.forEach((champ) => {
      if (req.body[champ] !== undefined) {
        if (champ === "idPatient") {
          const existingPatient = Patient.findByPk(req.body[champ]);
          if (!existingPatient) {
            return res.status(400).json({ message: "Patient Introuvable" });
          }
        }
        donneesAMettreAJour[champ] = req.body[champ];
      }
    });

    const abonnementExist = await Abonnement.findByPk(id);
    if (!abonnementExist) {
      return res.status(400).json({
        message: "Cette abonnement n'existe pas dans notre système",
      });
    }

    const abonnement = await abonnementExist.update(donneesAMettreAJour);

    return res.status(200).json({
      message: `Les informations de l'abonnement ${abonnementExist.idAbonnement} ont été mis à jour avec succès`,
      data: abonnement,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteAbonnement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const abonnementExist = await Abonnement.findByPk(id);

    if (!abonnementExist) {
      return res.status(400).json({
        message: "Cet abonnement n'est pas enregistrée dans notre système",
      });
    }

    await abonnementExist.destroy();
    res.status(200).json({
      message: `L'abonnement ${abonnementExist.idAbonnement} a été supprimé avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
