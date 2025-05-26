import { Outing, Patient, User } from "../models/index.model.js";

export const getAllOutings = async (req, res, next) => {
  try {
    const outings = await Outing.findAll();
    return res
      .status(200)
      .json({ nombre: outings.length, outingsInfo: outings });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleOuting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const outing = await Outing.findByPk(id);

    if (!outing) {
      return res.status(400).json({
        message: "Cette sortie n'est pas enregistrée dans notre système",
      });
    }
    return res.status(200).json({ outingInfo: outing });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createOuting = async (req, res, next) => {
  try {
    const idUser = req.user ? req.user.idUser : null;

    if (!idUser) {
      return res
        .status(401)
        .json({ message: "Authentification requise pour ajouter un patient." });
    }
    const existingUser = await User.findByPk(idUser);
    if (!existingUser) {
      return res.status(401).json({
        message:
          "Cet utilisateur n'existe pas dans notre système\nAuthentification requise pour ajouter un patient.",
      });
    }

    const { idPatient, outingDiagnostic, status } = req.body;

    if (!idPatient || !outingDiagnostic) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner tout les champs!" });
    }
    const existingPatient = await Patient.findByPk(idPatient);
    if (!existingPatient) {
      return res
        .status(400)
        .json({ message: "Ce patient n'existe pas dans notre système" });
    }

    const newOuting = await Outing.create({
      idUser: existingUser.idUser,
      idPatient,
      outingDiagnostic,
      status,
    });

    res.status(201).json({
      message: `Les données de sortie pour le patient ${existingPatient.firstName} ${existingPatient.lastName} ont été approuvés avec succès`,
      data: newOuting,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateOuting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = ["idPatient", "outingDiagnostic", "status"];
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

    const outingExist = await Outing.findByPk(id);
    if (!outingExist) {
      return res.status(400).json({
        message: "Cette Outing n'existe pas dans notre système",
      });
    }

    const outing = await outingExist.update(donneesAMettreAJour);

    return res.status(200).json({
      message: `Les informations de la surtie ${outingExist.idOuting} ont été mis à jour avec succès`,
      data: outing,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteOuting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const outingExist = await Outing.findByPk(id);

    if (!outingExist) {
      return res.status(400).json({
        message: "Cette sortie n'est pas enregistrée dans notre système",
      });
    }

    await outingExist.destroy();
    res.status(200).json({
      message: `La sortie ${outingExist.idOuting} a été supprimé avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
