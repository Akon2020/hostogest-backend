import {
  Consommation,
  Consultation,
  Intervention,
  MedecineAdministration,
  Patient,
  Suivie,
  User,
} from "../models/index.model.js";

export const getAllSuivies = async (req, res, next) => {
  try {
    const suivies = await Suivie.findAll();
    return res.status(200).json({
      nombre: suivies.length,
      suiviesInfo: suivies,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleSuivie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const suivie = await Suivie.findByPk(id, {
      include: [
        { model: Patient, attributes: ['idPatient', 'firstName', 'lastName', 'gender'] },
        { model: User, attributes: ['idUser', 'firstName', 'lastName', 'email'] },
        { model: Consultation, attributes: ['idConsultation', 'motif', 'anamnese', 'conclusion', 'createdAt'] },
        { model: MedecineAdministration, attributes: ['idMedecineAdministration', 'nomMedicament', 'AdministrationDate'] }
      ]
    });
    if (!suivie) {
      return res.status(404).json({
        message: "Cette suivie n'est pas enregistrée dans notre système",
      });
    }
    return res.status(200).json({ suivieInfo: suivie });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getPatientSuivie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingPatient = await Patient.findByPk(id);
    if (!existingPatient) {
      return res.status(404).json({
        message: "Ce patient n'est pas enregistré dans notre système",
      });
    }
    const suivies = await Suivie.findAll({
      where: { idPatient: existingPatient.idPatient },
    });
    if (!suivies || suivies.length === 0) {
      return res.status(404).json({
        message: "Aucune suivie trouvée pour ce patient dans notre système",
      });
    }
    return res.status(200).json({
      nombre: suivies.length,
      suiviesInfo: suivies,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getConsultationSuivie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingConsultation = await Consultation.findByPk(id);
    if (!existingConsultation) {
      return res.status(404).json({
        message: "Cette consultation n'est pas enregistré dans notre système",
      });
    }
    const suivies = await Suivie.findAll({
      where: { idConsultation: existingConsultation.idConsultation },
    });
    if (!suivies || suivies.length === 0) {
      return res.status(404).json({
        message:
          "Aucune suivie trouvée pour cette consultation dans notre système",
      });
    }
    return res.status(200).json({
      nombre: suivies.length,
      suiviesInfo: suivies,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getUserSuivie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      return res.status(404).json({
        message: "Cet utilisateur n'est pas enregistré dans notre système",
      });
    }
    const suivies = await Suivie.findAll({
      where: { idUser: existingUser.idUser },
    });
    if (!suivies || suivies.length === 0) {
      return res.status(404).json({
        message:
          "Aucune suivie trouvée pour cet utilisateur dans notre système",
      });
    }
    return res.status(200).json({
      nombre: suivies.length,
      suivieInfo: suivies,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createSuivie = async (req, res, next) => {
  try {
    const {
      idConsultation,
      idIntervention,
      idPatient,
      idConsommation,
      idMedecineAdministration,
      idUser,
      service,
    } = req.body;

    if (!idPatient || !idUser) {
      return res.status(400).json({
        message:
          "Les champs 'idPatient' et 'idUser' sont obligatoires pour créer un suivi.",
      });
    }

    if (
      !idConsultation &&
      !idIntervention &&
      !idConsommation &&
      !idMedecineAdministration &&
      !service
    ) {
      return res.status(400).json({
        message:
          "Un suivi doit être lié à au moins une consultation, intervention, consommation, administration de médecine, ou avoir une description de service.",
      });
    }

    const existingPatient = await Patient.findByPk(idPatient);
    if (!existingPatient) {
      return res.status(404).json({
        message: `Le patient avec l'ID ${idPatient} n'existe pas dans notre système.`,
      });
    }

    const existingUser = await User.findByPk(idUser);
    if (!existingUser) {
      return res.status(404).json({
        message: `L'utilisateur avec l'ID ${idUser} n'existe pas dans notre système.`,
      });
    }

    if (idConsultation) {
      const existingConsultation = await Consultation.findByPk(idConsultation);
      if (!existingConsultation) {
        return res.status(404).json({
          message: `La consultation avec l'ID ${idConsultation} n'existe pas dans notre système.`,
        });
      }
    }

    if (idIntervention) {
      const existingIntervention = await Intervention.findByPk(idIntervention);
      if (!existingIntervention) {
        return res.status(404).json({
          message: `L'intervention avec l'ID ${idIntervention} n'existe pas dans notre système.`,
        });
      }
    }

    if (idConsommation) {
      const existingConsommation = await Consommation.findByPk(idConsommation);
      if (!existingConsommation) {
        return res.status(404).json({
          message: `La consommation avec l'ID ${idConsommation} n'existe pas dans notre système.`,
        });
      }
    }

    if (idMedecineAdministration) {
      const existingMedecineAdministration =
        await MedecineAdministration.findByPk(idMedecineAdministration);
      if (!existingMedecineAdministration) {
        return res.status(404).json({
          message: `L'administration de médecine avec l'ID ${idMedecineAdministration} n'existe pas dans notre système.`,
        });
      }
    }

    const newSuivie = await Suivie.create({
      idConsultation: idConsultation || null,
      idIntervention: idIntervention || null,
      idPatient,
      idConsommation: idConsommation || null,
      idMedecineAdministration: idMedecineAdministration || null,
      idUser,
      service: service || null,
    });

    res.status(201).json({
      message: `Le suivi pour le patient ${existingPatient.firstName || ""} ${
        existingPatient.lastName || ""
      } a été créé avec succès par ${existingUser.firstName || ""} ${
        existingUser.lastName || ""
      }.`,
      data: newSuivie,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la création du suivi." });
    next(error);
  }
};

export const updateSuivie = async (req, res, next) => {
  try {
    const { idSuivie } = req.params;
    const {
      idConsultation,
      idIntervention,
      idPatient,
      idConsommation,
      idMedecineAdministration,
      idUser,
      service,
      suivieDate,
    } = req.body;

    const suivieToUpdate = await Suivie.findByPk(idSuivie);

    if (!suivieToUpdate) {
      return res.status(404).json({ message: "Suivi non trouvé." });
    }

    if (idConsultation !== undefined && idConsultation !== null) {
      const existingConsultation = await Consultation.findByPk(idConsultation);
      if (!existingConsultation) {
        return res
          .status(404)
          .json({
            message: `La consultation avec l'ID ${idConsultation} n'existe pas.`,
          });
      }
    }

    if (idIntervention !== undefined && idIntervention !== null) {
      const existingIntervention = await Intervention.findByPk(idIntervention);
      if (!existingIntervention) {
        return res
          .status(404)
          .json({
            message: `L'intervention avec l'ID ${idIntervention} n'existe pas.`,
          });
      }
    }

    if (idPatient !== undefined && idPatient !== null) {
      const existingPatient = await Patient.findByPk(idPatient);
      if (!existingPatient) {
        return res
          .status(404)
          .json({ message: `Le patient avec l'ID ${idPatient} n'existe pas.` });
      }
    }

    if (idConsommation !== undefined && idConsommation !== null) {
      const existingConsommation = await Consommation.findByPk(idConsommation);
      if (!existingConsommation) {
        return res
          .status(404)
          .json({
            message: `La consommation avec l'ID ${idConsommation} n'existe pas.`,
          });
      }
    }

    if (
      idMedecineAdministration !== undefined &&
      idMedecineAdministration !== null
    ) {
      const existingMedecineAdministration =
        await MedecineAdministration.findByPk(idMedecineAdministration);
      if (!existingMedecineAdministration) {
        return res
          .status(404)
          .json({
            message: `L'administration de médecine avec l'ID ${idMedecineAdministration} n'existe pas.`,
          });
      }
    }

    if (idUser !== undefined && idUser !== null) {
      const existingUser = await User.findByPk(idUser);
      if (!existingUser) {
        return res
          .status(404)
          .json({ message: `L'utilisateur avec l'ID ${idUser} n'existe pas.` });
      }
    }

    suivieToUpdate.idConsultation =
      idConsultation ?? suivieToUpdate.idConsultation;
    suivieToUpdate.idIntervention =
      idIntervention ?? suivieToUpdate.idIntervention;
    suivieToUpdate.idPatient = idPatient ?? suivieToUpdate.idPatient; // Même si obligatoire à la création, on permet la mise à jour
    suivieToUpdate.idConsommation =
      idConsommation ?? suivieToUpdate.idConsommation;
    suivieToUpdate.idMedecineAdministration =
      idMedecineAdministration ?? suivieToUpdate.idMedecineAdministration;
    suivieToUpdate.idUser = idUser ?? suivieToUpdate.idUser; // Même si obligatoire à la création, on permet la mise à jour
    suivieToUpdate.service = service ?? suivieToUpdate.service;
    suivieToUpdate.suivieDate = suivieDate ?? suivieToUpdate.suivieDate; // Permet de modifier la date si nécessaire

    await suivieToUpdate.save();

    return res.status(200).json({
      message: "Suivi mis à jour avec succès.",
      suivieInfo: suivieToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour du suivi." });
    next(error);
  }
};

export const deleteSuivie = async (req, res, next) => {
  try {
    const { idSuivie } = req.params;

    const deletedRows = await Suivie.destroy({
      where: { idSuivie: idSuivie },
    });

    if (deletedRows === 0) {
      return res
        .status(404)
        .json({ message: "Suivi non trouvé ou déjà supprimé." });
    }

    return res.status(200).json({ message: "Suivi supprimé avec succès." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la suppression du suivi." });
    next(error);
  }
};
