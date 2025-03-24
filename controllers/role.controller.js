import RoleModel from "../models/role.model.js";

export const getAllRoles = async (req, res, next) => {
  try {
    const roles = await RoleModel.findAllRoles();
    return res.status(200).json({ nombre: roles.length, utilisateurs: roles });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await RoleModel.findRoleById(id);
    if (!role) {
      return res
        .status(400)
        .json({ message: "Ce role n'existe pas dans notre système" });
    }
    return res.status(200).json({ roleInfo: role });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const addRole = async (req, res, next) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner un nom pour le role!" });
    }
    const roleExist = await RoleModel.findRoleByName(nom);
    if (roleExist) {
      return res
        .status(400)
        .json({ message: "Ce rôle existe déjà dans notre système" });
    }
    const role = await RoleModel.createRole(nom);
    res.status(201).json({
      message: `Le rôle ${nom} a été créé avec succès`,
      data: role,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateRoleInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nom } = req.body;

    if (!nom) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner un nom pour le role!" });
    }

    const roleExist = await RoleModel.findRoleById(id);
    if (!roleExist) {
      return res
        .status(400)
        .json({ message: "Ce rôle n'existe pas dans notre système" });
    }

    const role = await RoleModel.updateRole(id, nom);
    if (role.affectedRows > 0) {
      res.status(200).json({
        message: `Les informations du rôle ${roleExist.nom} ont été mis à jour avec succès`,
      });
    } else {
      res.status(404).json({ message: "Information non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteRoleInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const roleExist = await RoleModel.findRoleById(id);

    if (!roleExist) {
      return res
        .status(400)
        .json({ message: "Ce rôle n'existe pas dans notre système" });
    }

    const deleteRole = await RoleModel.deleteRole(id);
    if (deleteRole.affectedRows > 0) {
      res.status(200).json({
        message: `Le rôle ${roleExist.nom} a été supprimé avec succès`,
      });
    } else {
      res.status(404).json({ message: "Information non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
