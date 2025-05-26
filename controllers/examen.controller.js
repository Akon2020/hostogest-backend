import { Consultation, Examen, ExamenType } from "../models/index.model.js";

export const getAllExamens = async (req, res, next) => {
  try {
    const examens = await Examen.findAll();
    return res
      .status(200)
      .json({ nombre: examens.length, examensInfo: examens });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleExamen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const examen = await Examen.findByPk(id);

    if (!examen) {
      return res.status(400).json({
        message: "Cet examen n'est pas enregistrée dans notre système",
      });
    }
    return res.status(200).json({ examenInfo: examen });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createExamen = async (req, res, next) => {
  try {
    const { idConsultation, idExamenType, nom, resultat, status, laboratoire } =
      req.body;

    if (!idExamenType || !nom || !resultat) {
      return res.status(400).json({
        message:
          "Vous devez remplir les champs obligatoires : le type d'examen, le nom de l'examen et le resultat",
      });
    }
    const newExamen = await Examen.create({
      idConsultation,
      idExamenType,
      nom,
      resultat,
      status,
      laboratoire,
    });

    res.status(201).json({
      message: `Les données de l'examen ${newExamen.idExamen} ont été créé avec succès`,
      data: newExamen,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateExamen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = [
      "idConsultation",
      "idExamenType",
      "nom",
      "resultat",
      "status",
      "laboratoire",
    ];
    const donneesAMettreAJour = {};

    const examenExist = await Examen.findByPk(id);
    if (!examenExist) {
      return res.status(400).json({
        message: "Cet examen n'existe pas dans notre système",
      });
    }

    for (const champ of champsModifiables) {
      if (req.body[champ] !== undefined) {
        if (champ === "idPatient") {
          const existingConsultation = await Consultation.findByPk(
            req.body[champ]
          );
          if (!existingConsultation) {
            return res
              .status(404)
              .json({ message: "Consultation introuvable" });
          }
        } else if (champ === "idExamenType" && req.body[champ] !== null) {
          const existingExamenType = await ExamenType.findByPk(req.body[champ]);
          if (!existingExamenType) {
            return res.status(404).json({ message: "Sortie introuvable" });
          }
        }
        donneesAMettreAJour[champ] = req.body[champ];
      }
    }

    if (Object.keys(donneesAMettreAJour).length === 0) {
      return res.status(200).json({
        message: "Aucune donnée à mettre à jour n'a été fournie",
        data: examenExist,
      });
    }

    const examen = await examenExist.update(donneesAMettreAJour);

    return res.status(200).json({
      message: `Les informations de l'examen ${examenExist.idExamen} ont été mis à jour avec succès`,
      data: examen,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteExamen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const examenExist = await Examen.findByPk(id);

    if (!examenExist) {
      return res.status(400).json({
        message: "Cette Examen n'est pas enregistrée dans notre système",
      });
    }

    await examenExist.destroy();
    res.status(200).json({
      message: `Le type d'examen ${examenExist.idExamen} a été supprimé avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
