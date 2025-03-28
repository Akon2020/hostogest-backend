import MedicamentModel from "../models/medicament.model.js";

export const getAllMedicaments = async (req, res, next) => {
  try {
    const medicaments = await MedicamentModel.findAllMedicaments();
    return res
      .status(200)
      .json({ nombre: medicaments.length, medicamentsInfo: medicaments });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleMedicament = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicament = await MedicamentModel.findMedicamentById(id);
    if (!medicament) {
      return res
        .status(400)
        .json({ message: "Ce medicament n'existe pas dans notre système" });
    }
    return res.status(200).json({ medicamentInfo: medicament });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getMedicamentByName = async (req, res, next) => {
  try {
    const { nom } = req.body;
    const medicament = await MedicamentModel.findMedicamentByName(nom);
    if (!medicament) {
      return res
        .status(400)
        .json({ message: "Ce medicament n'existe pas dans notre système" });
    }
    return res.status(200).json({ medicamentInfo: medicament });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const addMedicament = async (req, res, next) => {
  try {
    const { nom, description } = req.body;

    if ((!nom, !description)) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner tout les champs!" });
    }

    const medicamentExist = await MedicamentModel.findMedicamentByName(nom);

    if (medicamentExist) {
      return res
        .status(403)
        .json({ message: "Ce medicament existe déjà dans notre système" });
    }
    const newMedicament = await MedicamentModel.createMedicament({
      nom,
      description,
    });
    res.status(201).json({
      message: `Le medicament ${nom} a été créé avec succès`,
      data: newMedicament,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateMedicamentInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nom, description } = req.body;

    if ((!nom, !description)) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner tout les champs!" });
    }

    const medicamentExist = await MedicamentModel.findMedicamentById(id);
    if (!medicamentExist) {
      return res
        .status(400)
        .json({ message: "Ce medicament n'existe pas dans notre système" });
    }

    const medicament = await MedicamentModel.updateMedicament(id, {
      nom,
      description,
    });
    if (medicament.affectedRows > 0) {
      res.status(200).json({
        message: `Les informations du medicament ${medicamentExist.nom} ont été mis à jour avec succès`,
      });
    } else {
      res.status(404).json({ message: "Information non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteMedicamentInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicamentExist = await MedicamentModel.findMedicamentById(id);

    if (!medicamentExist) {
      return res
        .status(400)
        .json({ message: "Ce medicament n'existe pas dans notre système" });
    }

    const deleteMedicament = await MedicamentModel.deleteMedicament(id);
    if (deleteMedicament.affectedRows > 0) {
      res.status(200).json({
        message: `Le medicament ${medicamentExist.nom} a été supprimé avec succès`,
      });
    } else {
      res.status(404).json({ message: "Information non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
