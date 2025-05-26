import { DEFAULT_PASSWD, EMAIL, HOST_URL } from "../config/env.js";
import transporter from "../config/nodemailer.js";
import { valideEmail } from "../middlewares/email.middleware.js";
import {
  Feature,
  Permission,
  PermissionFeature,
  Role,
  RolePermission,
  User,
  UserRole,
} from "../models/index.model.js";
import {
  newUserEmailTemplate,
  roleAssignmentEmailTemplate,
} from "../utils/email.template.js";
import { getUserWithoutPassword, strongPasswd } from "../utils/user.utils.js";
import bcrypt from "bcryptjs";
import db from "../database/db.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    const usersWithoutPassword = users.map(getUserWithoutPassword);
    return res.status(200).json({
      nombre: usersWithoutPassword.length,
      users: usersWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Cet utilisateur n'existe pas dans notre système" });
    }
    const userWithoutPassword = getUserWithoutPassword(user);
    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [{ model: Role, through: UserRole }],
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      roles: user.Roles,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du rôle de l'utilisateur:",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getUserPermission = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          through: UserRole,
          include: [
            {
              model: Permission,
              through: RolePermission,
              attributes: ["idPermission", "name", "description"],
            },
          ],
          attributes: ["idRole", "name", "description"],
        },
      ],
      attributes: ["idUser", "firstName", "lastName", "email"],
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const userPermissions = user.Roles.reduce((permissions, role) => {
      role.Permissions.forEach((permission) => {
        if (!permissions.some((p) => p.id === permission.id)) {
          permissions.push(permission);
        }
      });
      return permissions;
    }, []);

    res.status(200).json({
      user: {
        id: user.idUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      permissions: userPermissions,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des permissions de l'utilisateur:",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getUserFeaturesAndPermissions = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          through: UserRole,
          include: [
            {
              model: Permission,
              through: RolePermission,
              include: [
                {
                  model: Feature,
                  through: PermissionFeature,
                  attributes: ["idFeature", "name", "description"],
                },
              ],
              attributes: ["idPermission", "name", "description"],
            },
          ],
          attributes: ["idRole", "name", "description"],
        },
      ],
      attributes: ["idUser", "firstName", "lastName", "email"],
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const userFeaturesAndPermissions = user.Roles.reduce((result, role) => {
      role.Permissions.forEach((permission) => {
        const existingPermission = result.find((p) => p.id === permission.id);
        if (existingPermission) {
          permission.Features.forEach((feature) => {
            if (!existingPermission.features.some((f) => f.id === feature.id)) {
              existingPermission.features.push(feature);
            }
          });
        } else {
          result.push({
            id: permission.id,
            name: permission.name,
            description: permission.description,
            features: [...permission.Features],
          });
        }
      });
      return result;
    }, []);

    res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      permissionsWithFeatures: userFeaturesAndPermissions,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des permissions et fonctionnalités de l'utilisateur:",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!email || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner tout les champs!" });
    }

    if (!valideEmail(email)) {
      return res
        .status(401)
        .json({ message: "Entrez une adresse mail valide" });
    }
    const userExist = await User.findOne({ where: { email } });

    if (userExist) {
      return res
        .status(400)
        .json({ message: "Cet utilisateur a déjà un compte" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWD, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Bienvenue sur HostoGest",
      html: newUserEmailTemplate(firstName, email, DEFAULT_PASSWD, HOST_URL),
    };

    await transporter.sendMail(mailOptions);

    const userWithoutPassword = getUserWithoutPassword(newUser);

    res.status(201).json({
      message: `L'utilisateur ${firstName} ${lastName} a été créé avec succès`,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateUserInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const champsModifiables = ["firstName", "lastName", "email"];
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

    const userExist = await User.findByPk(id);
    if (!userExist) {
      return res
        .status(404)
        .json({ message: "Cet utilisateur n'existe pas dans notre système" });
    }

    const user = await userExist.update(donneesAMettreAJour);
    return res.status(200).json({
      message: `Les informations de ${userExist.firstName} ${userExist.lastName} ont été mis à jour avec succès`,
      data: getUserWithoutPassword(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateUserPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    if (!strongPasswd(newPassword)) {
      return res.status(401).json({
        message:
          "Le mot de passe doit être de 6 caractères au mininum et doit contenir au moins:\n- 1 lettre\n-1 chiffre\n- 1 symbole",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "Les nouveaux mots de passe ne correspondent pas" });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "Choisissez un nouveau mot de passe différent de l'ancien",
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const passwordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!passwordCorrect) {
      return res.status(401).json({ message: "Ancien mot de passe incorrect" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.update({ password: hashedPassword }, { where: { idUser: id } });

    return res
      .status(200)
      .json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userExist = await User.findByPk(id);

    if (!userExist) {
      return res
        .status(404)
        .json({ message: "Cet utilisateur n'exite pas dans notre système" });
    }
    await userExist.destroy();

    res.status(200).json({
      message: `L'utilisateur ${userExist.firstName} ${userExist.lastName} a été supprimé avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const assignRoleToUser = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id: idUser } = req.params;
    const { idRole } = req.body;

    if (!idRole) {
      await transaction.rollback();
      return res.status(400).json({ message: "Le rôle à ajouter est requis" });
    }

    const user = await User.findByPk(idUser, { transaction });
    if (!user) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Cet utilisateur n'existe pas dans notre système" });
    }

    const role = await Role.findByPk(idRole, {
      transaction,
      include: [
        {
          model: RolePermission,
          as: "RolePermissions",
          include: [
            {
              model: Permission,
              include: [
                {
                  model: PermissionFeature,
                  as: "PermissionFeatures",
                  include: [
                    {
                      model: Feature,
                      attributes: ["name", "description"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    if (!role) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Ce rôle n'existe pas dans notre système" });
    }

    const existingUserRole = await UserRole.findOne({
      where: {
        idUser: idUser,
        idRole: idRole,
      },
      transaction,
    });

    if (existingUserRole) {
      await transaction.rollback();
      return res
        .status(409)
        .json({ message: "Cet utilisateur a déjà ce rôle" });
    }

    await UserRole.create(
      {
        idUser: idUser,
        idRole: idRole,
      },
      { transaction }
    );

    await transaction.commit();

    const featuresList = [];
    const featureNamesSet = new Set();

    if (role.RolePermissions && Array.isArray(role.RolePermissions)) {
      for (const rolePermission of role.RolePermissions) {
        const permission = rolePermission.Permission;
        if (
          permission &&
          permission.PermissionFeatures &&
          Array.isArray(permission.PermissionFeatures)
        ) {
          for (const permissionFeature of permission.PermissionFeatures) {
            const feature = permissionFeature.Feature;
            if (feature && !featureNamesSet.has(feature.name)) {
              featuresList.push({
                name: feature.name,
                description: feature.description,
              });
              featureNamesSet.add(feature.name);
            }
          }
        }
      }
    }

    const mailOptions = {
      from: EMAIL,
      to: user.email,
      subject: `Nouveau rôle attribué : ${role.name}`,
      html: roleAssignmentEmailTemplate(
        `${user.firstName} ${user.lastName}`,
        role.name,
        HOST_URL,
        featuresList
      ),
    };

    await transporter.sendMail(mailOptions);

    const updatedUser = await User.findByPk(idUser, {
      include: [{ model: Role, through: UserRole, as: "Roles" }],
    });

    return res.status(201).json({
      message: `Le rôle '${role.name}' a été assigné à l'utilisateur '${user.firstName} ${user.lastName}' avec succès`,
      user: {
        id: updatedUser.idUser,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        roles: updatedUser.Roles ? updatedUser.Roles.map((r) => r.name) : [],
        features: featuresList,
      },
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const removeRoleFromUser = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id: idUser } = req.params;
    const { idRole } = req.body;

    if (!idRole) {
      await transaction.rollback();
      return res.status(400).json({ message: "Le rôle à ajouter est requis" });
    }

    const user = await User.findByPk(idUser, { transaction });
    if (!user) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Cet utilisateur n'existe pas dans notre système" });
    }

    const role = await Role.findByPk(idRole, { transaction });
    if (!role) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Ce rôle n'existe pas dans notre système" });
    }

    const deletedRows = await UserRole.destroy({
      where: {
        idUser: idUser,
        idRole: idRole,
      },
      transaction,
    });

    if (deletedRows === 0) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Ce rôle n'est pas assigné à cet utilisateur" });
    }

    await transaction.commit();

    const updatedUser = await User.findByPk(idUser, {
      include: [{ model: Role, through: UserRole }],
    });

    return res.status(200).json({
      message: `Le rôle '${role.name}' a été retiré de l'utilisateur '${user.firstName} ${user.lastName}' avec succès`,
      user: {
        id: updatedUser.idUser,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        roles: updatedUser.Roles,
      },
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
