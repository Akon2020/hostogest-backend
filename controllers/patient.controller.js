import { Patient, User } from "../models/index.model.js";
import { valideEmail } from "../middlewares/email.middleware.js";

export const getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.findAll();
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
    const patient = await Patient.findByPk(id);
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
  try {
    const idUser = req.user ? req.user.idUser : null;

    if (!idUser) {
      return res
        .status(401)
        .json({ message: "Authentification requise pour ajouter un patient." });
    }
    const existingUser = await User.findByPk(idUser);
    if (!existingUser) {
      return res
        .status(401)
        .json({ message: "Cet utilisateur n'existe pas dans notre système\nAuthentification requise pour ajouter un patient." });
    }
    const { firstName, lastName, birthDate, gender, address, phone, email } =
      req.body;

    if (!email || !firstName || !lastName || !gender) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner tout les champs!" });
    }

    if (email && !valideEmail(email)) {
      return res
        .status(401)
        .json({ message: "Entrez une adresse mail valide" });
    }

    const existingPatient = await Patient.findOne({
      where: {
        firstName,
        lastName,
        email,
        phone,
      },
    });

    if (existingPatient) {
      return res.status(409).json({
        message:
          "Un patient avec le même nom, prénom, email et numéro de téléphone est déjà enregistré.",
      });
    }

    const patient = await Patient.create({
      idUser: existingUser.idUser,
      firstName,
      lastName,
      birthDate,
      gender,
      address,
      phone,
      email,
    });
    res.status(201).json({
      message: `Le patient ${firstName} ${lastName} a été enregistré(e) avec succès`,
      user: patient,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updatePatientInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = [
      "firstName",
      "lastName",
      "birthDate",
      "gender",
      "address",
      "phone",
      "email",
    ];
    const donneesAMettreAJour = {};

    champsModifiables.forEach((champ) => {
      if (req.body[champ] !== undefined) {
        if (champ === "email") {
          if (!valideEmail(req.body[champ])) {
            return res
              .status(400)
              .json({ message: "Entrez une adresse mail valide" });
          }
        }
        donneesAMettreAJour[champ] = req.body[champ];
      }
    });
    const patientExist = await Patient.findByPk(id);
    if (!patientExist) {
      return res
        .status(404)
        .json({ message: "Ce patient n'existe pas dans notre système" });
    }
    const patient = await patientExist.update(donneesAMettreAJour);
    return res.status(200).json({
      message: `Les informations de ${patientExist.firstName} ${patientExist.lastName} ont été mis à jour avec succès`,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deletePatientInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patientExist = await Patient.findByPk(id);

    if (!patientExist) {
      return res
        .status(404)
        .json({ message: "Ce patient n'existe pas dans notre système" });
    }

    await patientExist.destroy(id);
    res.status(200).json({
      message: `Le patient ${patientExist.firstName} ${patientExist.lastName} a été supprimé avec succès`,
    });
  } catch (error) {
    // res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
