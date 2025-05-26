import { Antecedent, Patient } from "../models/index.model.js";

export const getAllAntecedents = async (req, res, next) => {
  try {
    const antecedents = await Antecedent.findAll();
    return res
      .status(200)
      .json({ nombre: antecedents.length, antecedentsInfo: antecedents });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleAllAntecedent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const antecedent = await Antecedent.findByPk(id);
    if (!antecedent) {
      return res.status(400).json({
        message: "Cet antecedent n'est pas enregistrée dans notre système",
      });
    }
    return res
      .status(200)
      .json({ nombre: antecedent.length, antecedentInfo: antecedent });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getPatientAntecedent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingPatient = await Patient.findByPk(id);
    if (!existingPatient) {
      return res.status(404).json({
        message: "Ce patient n'est pas enregistré dans notre système",
      });
    }
    const antecedent = await Antecedent.findAll({
      where: { idPatient: existingPatient.idPatient },
    });
    if (!antecedent || antecedent.length === 0) {
      return res.status(404).json({
        message: "Aucun antecedent trouvée pour ce patient dans notre système",
      });
    }
    return res
      .status(200)
      .json({ nombre: antecedent.length, antecedentInfo: antecedent });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createAntecedent = async (req, res, next) => {
  try {
    const { idPatient, description } = req.body;

    if (!idPatient || !description) {
      return res.status(400).json({
        message:
          "L'ID du patient et la description de cet antecedent sont requis",
      });
    }
    const existingPatient = await Patient.findByPk(idPatient);

    if (!existingPatient) {
      return res
        .status(400)
        .json({ message: "Ce patient n'existe pas dans notre système" });
    }
    const newAntecedent = await Antecedent.create({ idPatient, description });

    res.status(201).json({
      message: `Les données d'antecedent pour le patient ${existingPatient.firstName} ${existingPatient.lastName} ont été créé avec succès`,
      data: newAntecedent,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateAntecedent = async (req, res, next) => {
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

    const antecedentExist = await Antecedent.findByPk(id);
    if (!antecedentExist) {
      return res.status(400).json({
        message: "Cette antecedent n'existe pas dans notre système",
      });
    }

    const antecedent = await antecedentExist.update(donneesAMettreAJour);

    return res.status(200).json({
      message: `Les informations de l'antecedent ${antecedentExist.idAntecedent} ont été mis à jour avec succès`,
      data: antecedent,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteAntecedent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const antecedentExist = await Antecedent.findByPk(id);

    if (!antecedentExist) {
      return res.status(400).json({
        message: "Cet antecedent n'est pas enregistrée dans notre système",
      });
    }

    await antecedentExist.destroy();
    res.status(200).json({
      message: `L'antecedent ${antecedentExist.idAntecedent} a été supprimé avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
