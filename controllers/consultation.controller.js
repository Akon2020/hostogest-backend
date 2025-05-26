import {
  Antecedent,
  Consultation,
  Hospitalization,
  Mensuration,
  Patient,
  Prescription,
  User,
} from "../models/index.model.js";

export const getAllConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.findAll({
      include: [
        {
          model: Patient,
          as: "Patient",
          attributes: [
            "idPatient",
            "firstName",
            "lastName",
            "birthDate",
            "gender",
            "phone",
            "email",
          ],
        },
        {
          model: User,
          as: "User",
          attributes: ["idUser", "firstName", "lastName", "email"],
        },
        {
          model: Mensuration,
          as: "Mensuration",
          attributes: [
            "idMensuration",
            "temperature",
            "heartRate",
            "bloodPressure",
            "respiratoryRate",
            "weight",
            "size",
            "bodyMassIndex",
            "bloodOxygenSaturation",
            "pignetIndex",
            "passedOn",
          ],
        },
        {
          model: Prescription,
          as: "Prescription",
          attributes: ["idPrescription", "description"],
        },
        {
          model: Antecedent,
          as: "Antecedent",
          attributes: ["idAntecedent", "description"],
        },
        {
          model: Hospitalization,
          as: "Hospitalization",
          attributes: ["idHospitalization", "admissionDate", "description"],
        },
      ],
    });

    if (!consultations || consultations.length === 0) {
      return res.status(404).json({ message: "Aucune consultation trouvée." });
    }
    return res
      .status(200)
      .json({ nombre: consultations.length, consultationsInfo: consultations });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleConsultation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const consultation = await Consultation.findByPk(id, {
      include: [
        {
          model: Patient,
          as: "Patient",
          attributes: [
            "idPatient",
            "firstName",
            "lastName",
            "birthDate",
            "gender",
            "phone",
            "email",
          ],
        },
        {
          model: User,
          as: "User",
          attributes: ["idUser", "firstName", "lastName", "email"],
        },
        {
          model: Mensuration,
          as: "Mensuration",
          attributes: [
            "idMensuration",
            "temperature",
            "heartRate",
            "bloodPressure",
            "respiratoryRate",
            "weight",
            "size",
            "bodyMassIndex",
            "bloodOxygenSaturation",
            "pignetIndex",
            "passedOn",
          ],
        },
        {
          model: Prescription,
          as: "Prescription",
          attributes: ["idPrescription", "description"],
        },
        {
          model: Antecedent,
          as: "Antecedent",
          attributes: ["idAntecedent", "description"],
        },
        {
          model: Hospitalization,
          as: "Hospitalization",
          attributes: ["idHospitalization", "admissionDate", "description"],
        },
      ],
    });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation non trouvée." });
    }
    return res.status(200).json({ consultationInfo: consultation });
  } catch (error) {
    console.error(
      "Erreur serveur lors de la récupération de la consultation détaillée :",
      error
    );
    res.status(500).json({
      message: "Erreur serveur lors de la récupération de la consultation.",
    });
    next(error);
  }
};

export const getPatientConsultation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingPatient = await Patient.findByPk(id);

    if (!existingPatient) {
      return res.status(404).json({
        message: "Ce patient n'est pas enregistré dans notre système.",
      });
    }

    const consultations = await Consultation.findAll({
      where: { idPatient: existingPatient.idPatient },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["idUser", "firstName", "lastName", "email"],
        },
        {
          model: Mensuration,
          as: "Mensuration",
          attributes: [
            "idMensuration",
            "temperature",
            "heartRate",
            "bloodPressure",
            "respiratoryRate",
            "weight",
            "size",
            "bodyMassIndex",
            "bloodOxygenSaturation",
            "pignetIndex",
            "passedOn",
          ],
        },
        {
          model: Prescription,
          as: "Prescription",
          attributes: ["idPrescription", "description"],
        },
        {
          model: Antecedent,
          as: "Antecedent",
          attributes: ["idAntecedent", "description"],
        },
        {
          model: Hospitalization,
          as: "Hospitalization",
          attributes: ["idHospitalization", "admissionDate", "description"],
        },
      ],
    });

    if (!consultations || consultations.length === 0) {
      return res.status(404).json({
        message: `Aucune consultation trouvée pour le patient ${existingPatient.firstName} ${existingPatient.lastName}.`,
      });
    }

    return res
      .status(200)
      .json({ nombre: consultations.length, consultationInfo: consultations });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des consultations du patient.",
    });
    next(error);
  }
};

export const getUserConsultation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingUser = await User.findByPk(id);

    if (!existingUser) {
      return res.status(404).json({
        message: "Cet utilisateur n'est pas enregistré dans notre système.",
      });
    }

    const consultations = await Consultation.findAll({
      where: { idUser: existingUser.idUser },
      include: [
        {
          model: Patient,
          as: "Patient",
          attributes: [
            "idPatient",
            "firstName",
            "lastName",
            "birthDate",
            "gender",
            "phone",
            "email",
          ],
        },
        {
          model: Mensuration,
          as: "Mensuration",
          attributes: [
            "idMensuration",
            "temperature",
            "heartRate",
            "bloodPressure",
            "respiratoryRate",
            "weight",
            "size",
            "bodyMassIndex",
            "bloodOxygenSaturation",
            "pignetIndex",
            "passedOn",
          ],
        },
        {
          model: Prescription,
          as: "Prescription",
          attributes: ["idPrescription", "description"],
        },
        {
          model: Antecedent,
          as: "Antecedent",
          attributes: ["idAntecedent", "description"],
        },
        {
          model: Hospitalization,
          as: "Hospitalization",
          attributes: ["idHospitalization", "admissionDate", "description"],
        },
      ],
    });

    if (!consultations || consultations.length === 0) {
      return res.status(404).json({
        message: `Aucune consultation trouvée effectuée par l'utilisateur ${existingUser.firstName} ${existingUser.lastName}.`,
      });
    }

    return res
      .status(200)
      .json({ nombre: consultations.length, consultationInfo: consultations });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des consultations de l'utilisateur.",
    });
    next(error);
  }
};

export const createConsultation = async (req, res, next) => {
  try {
    const {
      idUser,
      idPatient,
      idMensuration,
      idAntecedent,
      idPrescription,
      idHospitalization,
      motif,
      anamnese,
      conclusion,
    } = req.body;

    if (!idUser || !idPatient || !motif || !anamnese) {
      return res.status(400).json({
        message:
          "Les champs 'idUser', 'idPatient', 'motif' et 'anamnese' sont obligatoires pour créer une consultation.",
      });
    }

    const existingPatient = await Patient.findByPk(idPatient);
    if (!existingPatient) {
      return res
        .status(404)
        .json({ message: "Ce patient n'existe pas dans notre système." });
    }

    const existingUser = await User.findByPk(idUser);
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Cet utilisateur n'existe pas dans notre système." });
    }

    if (idMensuration) {
      const existingMensuration = await Mensuration.findByPk(idMensuration);
      if (!existingMensuration) {
        return res
          .status(404)
          .json({ message: "La mensuration spécifiée n'existe pas." });
      }
    }
    if (idAntecedent) {
      const existingAntecedent = await Antecedent.findByPk(idAntecedent);
      if (!existingAntecedent) {
        return res
          .status(404)
          .json({ message: "L'antécédent spécifié n'existe pas." });
      }
    }
    if (idPrescription) {
      const existingPrescription = await Prescription.findByPk(idPrescription);
      if (!existingPrescription) {
        return res
          .status(404)
          .json({ message: "La prescription spécifiée n'existe pas." });
      }
    }
    if (idHospitalization) {
      const existingHospitalization = await Hospitalization.findByPk(
        idHospitalization
      );
      if (!existingHospitalization) {
        return res
          .status(404)
          .json({ message: "L'hospitalisation spécifiée n'existe pas." });
      }
    }

    const newConsultation = await Consultation.create({
      idUser,
      idPatient,
      idMensuration: idMensuration || null,
      idAntecedent: idAntecedent || null,
      idPrescription: idPrescription || null,
      idHospitalization: idHospitalization || null,
      motif,
      anamnese,
      conclusion: conclusion || null,
    });

    res.status(201).json({
      message: `La consultation pour le patient ${existingPatient.firstName} ${existingPatient.lastName} a été créée avec succès.`,
      data: newConsultation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur lors de la création de la consultation.",
    });
    next(error);
  }
};

export const updateConsultation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      idUser,
      idPatient,
      idMensuration,
      idAntecedent,
      idPrescription,
      idHospitalization,
      motif,
      anamnese,
      conclusion,
    } = req.body;

    const consultationToUpdate = await Consultation.findByPk(id);
    if (!consultationToUpdate) {
      return res.status(404).json({ message: "Consultation non trouvée." });
    }

    if (idUser) {
      const existingUser = await User.findByPk(idUser);
      if (!existingUser) {
        return res
          .status(404)
          .json({ message: "L'utilisateur spécifié n'existe pas." });
      }
    }
    if (idPatient) {
      const existingPatient = await Patient.findByPk(idPatient);
      if (!existingPatient) {
        return res
          .status(404)
          .json({ message: "Le patient spécifié n'existe pas." });
      }
    }
    if (idMensuration) {
      const existingMensuration = await Mensuration.findByPk(idMensuration);
      if (!existingMensuration) {
        return res
          .status(404)
          .json({ message: "La mensuration spécifiée n'existe pas." });
      }
    }
    if (idAntecedent) {
      const existingAntecedent = await Antecedent.findByPk(idAntecedent);
      if (!existingAntecedent) {
        return res
          .status(404)
          .json({ message: "L'antécédent spécifié n'existe pas." });
      }
    }
    if (idPrescription) {
      const existingPrescription = await Prescription.findByPk(idPrescription);
      if (!existingPrescription) {
        return res
          .status(404)
          .json({ message: "La prescription spécifiée n'existe pas." });
      }
    }
    if (idHospitalization) {
      const existingHospitalization = await Hospitalization.findByPk(
        idHospitalization
      );
      if (!existingHospitalization) {
        return res
          .status(404)
          .json({ message: "L'hospitalisation spécifiée n'existe pas." });
      }
    }

    Object.assign(consultationToUpdate, {
      idUser: idUser || consultationToUpdate.idUser,
      idPatient: idPatient || consultationToUpdate.idPatient,
      idMensuration:
        idMensuration === undefined
          ? consultationToUpdate.idMensuration
          : idMensuration,
      idAntecedent:
        idAntecedent === undefined
          ? consultationToUpdate.idAntecedent
          : idAntecedent,
      idPrescription:
        idPrescription === undefined
          ? consultationToUpdate.idPrescription
          : idPrescription,
      idHospitalization:
        idHospitalization === undefined
          ? consultationToUpdate.idHospitalization
          : idHospitalization,
      motif: motif || consultationToUpdate.motif,
      anamnese: anamnese || consultationToUpdate.anamnese,
      conclusion:
        conclusion === undefined ? consultationToUpdate.conclusion : conclusion,
    });

    await consultationToUpdate.save();

    return res.status(200).json({
      message: "Consultation mise à jour avec succès.",
      consultationInfo: consultationToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur lors de la mise à jour de la consultation.",
    });
    next(error);
  }
};

export const deleteConsultation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedRows = await Consultation.destroy({
      where: { idConsultation: id },
    });

    if (deletedRows === 0) {
      return res
        .status(404)
        .json({ message: "Consultation non trouvée ou déjà supprimée." });
    }

    return res
      .status(200)
      .json({ message: "Consultation supprimée avec succès." });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur lors de la suppression de la consultation.",
    });
    next(error);
  }
};
