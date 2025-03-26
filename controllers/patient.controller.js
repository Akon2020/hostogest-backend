import PatientModel from "../models/patient.model.js";

export const getAllPatients = async (req, res, next) => {
  try {
    const patients = await PatientModel.findAllPatients();
    return res
      .status(200)
      .json({ nombre: patients.length, patientsInfo: patients });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSinglePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await PatientModel.findPatientById(id);
    if (!patient) {
      return res
        .status(400)
        .json({ message: "Ce patient n'existe pas dans notre système" });
    }
    return res.status(200).json({ patientInfo: patient });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const addPatient = async (req, res, next) => {
  return req, res, next;
};

export const updatePatientInfo = async (req, res, next) => {
  return req, res, next;
};

export const deletePatientInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patientExist = await PatientModel.findPatientById(id);

    if (!patientExist) {
      return res
        .status(400)
        .json({ message: "Ce patient n'existe pas dans notre système" });
    }

    const deletePatient = await PatientModel.deletePatient(id);
    if (deletePatient.affectedRows > 0) {
      res.status(200).json({
        message: `Le rôle ${patientExist.prenom} ${patientExist.nom} a été supprimé avec succès`,
      });
    } else {
      res.status(404).json({ message: "Information non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
