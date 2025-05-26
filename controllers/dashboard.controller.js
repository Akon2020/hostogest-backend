import { Op } from "sequelize";
import moment from "moment";

import {
  Consultation,
  Hospitalization,
  Bed,
  Patient,
  Mensuration,
  MedicalRecord,
  Antecedent,
  Prescription,
  Examen,
  Outing,
  Suivie,
  User,
} from "../models/index.model.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const today = moment().startOf("day");
    const endOfToday = moment().endOf("day");

    const consultationsToday = await Consultation.count({
      where: {
        createdAt: {
          [Op.between]: [today.toDate(), endOfToday.toDate()],
        },
      },
    });

    const hospitalisationsInProgress = await Hospitalization.count({
      where: {
        idOuting: {
          [Op.is]: null,
        },
      },
    });

    const occupiedBeds = await Bed.count({
      where: {
        status: "Occupée",
      },
    });

    const recentConsultations = await Consultation.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
      include: [
        {
          model: Patient,
          attributes: ["idPatient", "firstName", "lastName"],
        },
        {
          model: User,
          attributes: ["idUser", "firstName", "lastName"],
        },
      ],
    });

    return res.status(200).json({
      consultationsToday,
      hospitalisationsInProgress,
      occupiedBeds,
      recentConsultations,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getPatientDetailedInfo = async (req, res, next) => {
  const { idPatient } = req.params;

  try {
    const patient = await Patient.findByPk(idPatient, {
      include: [
        {
          model: User,
          attributes: ["idUser", "firstName", "lastName", "email"],
          as: "User",
        },
        {
          model: MedicalRecord,
          as: "MedicalRecords",
          where: { type: "Diagnostic" },
          required: false,
          order: [["createdAt", "DESC"]],
          limit: 1,
        },
        {
          model: Antecedent,
          as: "Antecedents",
          order: [["idAntecedent", "DESC"]],
        },
        {
          model: Consultation,
          as: "Consultations",
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: Mensuration,
              as: "Mensuration",
              required: false,
            },
            {
              model: Prescription,
              as: "Prescription",
              required: false,
            },
            {
              model: Examen,
              as: "Examens",
              required: false,
              order: [["examenDate", "DESC"]],
            },
            {
              model: User,
              attributes: ["idUser", "firstName", "lastName"],
              as: "User",
            },
          ],
        },
        {
          model: Hospitalization,
          as: "Hospitalizations",
          order: [["admissionDate", "DESC"]],
          include: [
            {
              model: Bed,
              attributes: ["bedNumber"],
              as: "Bed",
            },
          ],
        },
        {
          model: Outing,
          as: "Outings",
          order: [["approvedDate", "DESC"]],
          include: [
            {
              model: User,
              attributes: ["idUser", "firstName", "lastName"],
              as: "User",
            },
          ],
        },
        {
          model: Suivie,
          as: "Suivies",
          order: [["suivieDate", "DESC"]],
          include: [
            {
              model: User,
              attributes: ["idUser", "firstName", "lastName"],
              as: "User",
            },
          ],
        },
      ],
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient non trouvé." });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
