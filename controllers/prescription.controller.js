import { Patient, Prescription } from "../models/index.model.js";

export const getAllPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.findAll();
    return res
      .status(200)
      .json({ nombre: prescriptions.length, prescriptionsInfo: prescriptions });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSinglePrescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findByPk(id);
    if (!prescription) {
      return res.status(400).json({
        message: "Cette prescription n'est pas enregistrée dans notre système",
      });
    }
    return res.status(200).json({ prescriptionInfo: prescription });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createPrescription = async (req, res, next) => {
  try {
    const { idPatient, description } = req.body;

    if (!description) {
      return res.status(400).json({
        message: "La description de cette prescription est requise",
      });
    }
    const existingPatient = await Patient.findByPk(idPatient);

    if (!existingPatient) {
      return res
        .status(400)
        .json({ message: "Ce patient n'existe pas dans notre système" });
    }
    const newPrescription = await Prescription.create({ description });

    res.status(201).json({
      message: `Les données de prescription pour le patient ${existingPatient.firstName} ${existingPatient.lastName} ont été créé avec succès`,
      data: newPrescription,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updatePrescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = ["idPatient", "description"];
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

    const prescriptionExist = await Prescription.findByPk(id);
    if (!prescriptionExist) {
      return res.status(400).json({
        message: "Cette prescription n'existe pas dans notre système",
      });
    }

    const prescription = await prescriptionExist.update(donneesAMettreAJour);

    return res.status(200).json({
      message: `Les informations de la prescription ${prescriptionExist.idPrescription} ont été mis à jour avec succès`,
      data: prescription,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deletePrescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prescriptionExist = await Prescription.findByPk(id);

    if (!prescriptionExist) {
      return res.status(400).json({
        message: "Cette prescription n'est pas enregistrée dans notre système",
      });
    }

    await prescriptionExist.destroy();
    res.status(200).json({
      message: `La prescription ${prescriptionExist.idPrescription} a été supprimé avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
