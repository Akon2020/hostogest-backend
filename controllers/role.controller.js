import { Role, Permission, RolePermission } from "../models/index.model.js";
import { Op } from "sequelize";
import db from "../database/db.js";

export const getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: Permission,
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      nombre: roles.length,
      roles,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getRoleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, {
      include: [
        {
          model: Permission,
          through: { attributes: [] },
        },
      ],
    });

    if (!role) {
      return res.status(404).json({
        message: "Ce rôle n'existe pas dans notre système",
      });
    }

    return res.status(200).json({ role });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createRole = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { name, description, permissions } = req.body;

    const existingRole = await Role.findOne({
      where: {
        [Op.or]: [{ name }, { description }],
      },
    });

    if (existingRole) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Un rôle avec ce nom ou cette description existe déjà",
      });
    }

    const newRole = await Role.create(
      {
        name,
        description,
      },
      { transaction }
    );

    if (permissions && permissions.length > 0) {
      const existingPermissions = await Permission.findAll({
        where: { idPermission: permissions },
        transaction,
      });

      if (existingPermissions.length !== permissions.length) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Une ou plusieurs permissions spécifiées n'existent pas",
        });
      }

      const rolePermissions = permissions.map((idPermission) => ({
        idRole: newRole.idRole,
        idPermission,
      }));

      await RolePermission.bulkCreate(rolePermissions, { transaction });
    }

    await transaction.commit();

    const roleWithPermissions = await Role.findByPk(newRole.idRole, {
      include: [
        {
          model: Permission,
          through: { attributes: [] },
        },
      ],
    });

    return res.status(201).json({
      message: `Le rôle ${name} a été créé avec succès`,
      role: roleWithPermissions,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    const role = await Role.findByPk(id, { transaction });
    if (!role) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Ce rôle n'existe pas dans notre système",
      });
    }

    if (
      (name && name !== role.name) ||
      (description && description !== role.description)
    ) {
      const existingRole = await Role.findOne({
        where: {
          [Op.and]: [
            { idRole: { [Op.ne]: id } },
            {
              [Op.or]: [
                { name: name || "" },
                { description: description || "" },
              ],
            },
          ],
        },
        transaction,
      });

      if (existingRole) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Un rôle avec ce nom ou cette description existe déjà",
        });
      }
    }

    await role.update(
      {
        name: name || role.name,
        description: description || role.description,
      },
      { transaction }
    );

    if (permissions) {
      if (permissions.length > 0) {
        const existingPermissions = await Permission.findAll({
          where: { idPermission: permissions },
          transaction,
        });

        if (existingPermissions.length !== permissions.length) {
          await transaction.rollback();
          return res.status(400).json({
            message: "Une ou plusieurs permissions spécifiées n'existent pas",
          });
        }
      }

      await RolePermission.destroy({
        where: { idRole: id },
        transaction,
      });

      if (permissions.length > 0) {
        const rolePermissions = permissions.map((idPermission) => ({
          idRole: id,
          idPermission,
        }));

        await RolePermission.bulkCreate(rolePermissions, { transaction });
      }
    }

    await transaction.commit();

    const updatedRole = await Role.findByPk(id, {
      include: [
        {
          model: Permission,
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      message: `Le rôle ${role.name} a été mis à jour avec succès`,
      role: updatedRole,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, { transaction });
    if (!role) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Ce rôle n'existe pas dans notre système",
      });
    }

    await RolePermission.destroy({
      where: { idRole: id },
      transaction,
    });

    await role.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({
      message: `Le rôle ${role.name} a été supprimé avec succès`,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const addPermissionsToRole = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;
    const { permissions } = req.body;

    if (
      !permissions ||
      !Array.isArray(permissions) ||
      permissions.length === 0
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "La liste des permissions est requise et ne peut pas être vide",
      });
    }

    const role = await Role.findByPk(id, { transaction });
    if (!role) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Ce rôle n'existe pas dans notre système",
      });
    }

    const existingPermissions = await Permission.findAll({
      where: { idPermission: permissions },
      transaction,
    });

    if (existingPermissions.length !== permissions.length) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Une ou plusieurs permissions spécifiées n'existent pas",
      });
    }

    const existingAssociations = await RolePermission.findAll({
      where: {
        idRole: id,
        idPermission: permissions,
      },
      transaction,
    });

    const existingPermissionIds = existingAssociations.map(
      (assoc) => assoc.idPermission
    );
    const newPermissionIds = permissions.filter(
      (permissionId) => !existingPermissionIds.includes(permissionId)
    );

    if (newPermissionIds.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Toutes les permissions spécifiées sont déjà associées à ce rôle",
      });
    }

    const rolePermissions = newPermissionIds.map((idPermission) => ({
      idRole: id,
      idPermission,
    }));

    await RolePermission.bulkCreate(rolePermissions, { transaction });

    await transaction.commit();

    const updatedRole = await Role.findByPk(id, {
      include: [
        {
          model: Permission,
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      message: `${newPermissionIds.length} permissions ajoutées au rôle avec succès`,
      role: updatedRole,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const removePermissionsFromRole = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;
    const { permissions } = req.body;

    if (
      !permissions ||
      !Array.isArray(permissions) ||
      permissions.length === 0
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "La liste des permissions est requise et ne peut pas être vide",
      });
    }

    const role = await Role.findByPk(id, { transaction });
    if (!role) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Ce rôle n'existe pas dans notre système",
      });
    }

    await RolePermission.destroy({
      where: {
        idRole: id,
        idPermission: permissions,
      },
      transaction,
    });

    await transaction.commit();

    const updatedRole = await Role.findByPk(id, {
      include: [
        {
          model: Permission,
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      message: "Permissions retirées du rôle avec succès",
      role: updatedRole,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

/* import { EMAIL, HOST_URL } from "../config/env.js";
import transporter from "../config/nodemailer.js";
import RoleModel from "../models/role.model.js";
import UserModel from "../models/user.model.js";
import { roleAssignmentEmailTemplate } from "../utils/email.template.js";

export const getAllRoles = async (req, res, next) => {
  try {
    const roles = await RoleModel.findAllRoles();
    return res.status(200).json({ nombre: roles.length, rolesInfo: roles });
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
    const { name, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner un nom pour le role!" });
    }
    const roleExist = await RoleModel.findRoleByName(name);
    if (roleExist) {
      return res
        .status(400)
        .json({ message: "Ce rôle existe déjà dans notre système" });
    }
    const role = await RoleModel.createRole(name, description);
    res.status(201).json({
      message: `Le rôle ${name} a été créé avec succès`,
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
    const { name, description } = req.body;

    if (!name) {
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

    const role = await RoleModel.updateRole(id, name, description);
    if (role.affectedRows > 0) {
      res.status(200).json({
        message: `Les informations du rôle ${roleExist.name} ont été mis à jour avec succès`,
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

export const affectRoleToUser = async (req, res, next) => {
  try {
    const { idUser, idRole } = req.body;
    const userExist = await UserModel.findUserById(idUser);
    const roleExist = await RoleModel.findRoleById(idRole);

    if (!roleExist || !userExist) {
      return res
        .status(400)
        .json({ message: "Veuillez renseigner tout les champs!" });
    }

    const existingRole = await RoleModel.checkUserRole(idUser, idRole);
    if (existingRole.length > 0) {
      return res.status(400).json({ message: "L'utilisateur a déjà ce rôle!" });
    }
    await RoleModel.affectRole(idUser, idRole);

    const mailOptions = {
      from: EMAIL,
      to: userExist.email,
      subject: `Nouveau rôle attribué : ${roleExist.name}`,
      html: roleAssignmentEmailTemplate(
        `${userExist.firstName} ${userExist.lastName}`,
        roleExist.name,
        HOST_URL
      ),
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({
      message: `Le rôle ${roleExist.name} a été assigné à l'utilisateur ${userExist.firstName} ${userExist.lastName} avec succès! Un email lui a été envoyé`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getUserRoles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userExist = await UserModel.findUserById(id);
    if (!userExist) {
      return res
        .status(400)
        .json({ message: "Cet utilisateur n'existe pas dans notre système" });
    }

    const roles = await RoleModel.getUserRoles(id);
    res.status(200).json({
      userRole: {
        user: `${userExist.firstName} ${userExist.lastName}`,
        roles,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
 */
