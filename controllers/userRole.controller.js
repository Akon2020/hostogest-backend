import { User, Role, UserRole } from "../models/index.model.js";
import { Op } from "sequelize";
import db from "../database/db.js";
import bcrypt from "bcryptjs";
import { getUserWithoutPassword } from "../utils/user.utils.js";
import { DEFAULT_PASSWD, EMAIL, HOST_URL } from "../config/env.js";
import transporter from "../config/nodemailer.js";
import { newUserEmailTemplate } from "../utils/email.template.js";
import { valideEmail } from "../middlewares/email.middleware.js";

export const getAllUsersWithRoles = async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          through: { attributes: [] },
        },
      ],
    });

    const usersWithoutPassword = getUserWithoutPassword(users);

    return res.status(200).json({
      nombre: usersWithoutPassword.length,
      usersInfo: usersWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getUserWithRoles = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "Cet utilisateur n'existe pas dans notre système",
      });
    }

    const userWithoutPassword = getUserWithoutPassword(user);

    return res.status(200).json({ userInfo: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const assignRolesToUser = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;
    const { roles } = req.body;

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: "La liste des rôles est requise et ne peut pas être vide",
      });
    }

    const user = await User.findByPk(id, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Cet utilisateur n'existe pas dans notre système",
      });
    }

    const existingRoles = await Role.findAll({
      where: { idRole: roles },
      transaction,
    });

    if (existingRoles.length !== roles.length) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Un ou plusieurs rôles spécifiés n'existent pas",
      });
    }

    const existingAssociations = await UserRole.findAll({
      where: {
        idUser: id,
        idRole: roles,
      },
      transaction,
    });

    const existingRoleIds = existingAssociations.map((assoc) => assoc.idRole);
    const newRoleIds = roles.filter(
      (roleId) => !existingRoleIds.includes(roleId)
    );

    if (newRoleIds.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Tous les rôles spécifiés sont déjà attribués à cet utilisateur",
      });
    }

    const userRoles = newRoleIds.map((idRole) => ({
      idUser: id,
      idRole,
    }));

    await UserRole.bulkCreate(userRoles, { transaction });

    await transaction.commit();

    const updatedUser = await User.findByPk(id, {
      include: [
        {
          model: Role,
          through: { attributes: [] },
        },
      ],
    });

    const userWithoutPassword = getUserWithoutPassword(updatedUser);

    return res.status(200).json({
      message: `${userRoles.length} Rôles attribués à l'utilisateur ${userWithoutPassword.firstName} avec succès`,
      user: userWithoutPassword,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const removeRolesFromUser = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;
    const { roles } = req.body;

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: "La liste des rôles est requise et ne peut pas être vide",
      });
    }

    const user = await User.findByPk(id, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Cet utilisateur n'existe pas dans notre système",
      });
    }

    await UserRole.destroy({
      where: {
        idUser: id,
        idRole: roles,
      },
      transaction,
    });

    await transaction.commit();

    const updatedUser = await User.findByPk(id, {
      include: [
        {
          model: Role,
          through: { attributes: [] },
        },
      ],
    });

    const userWithoutPassword = getUserWithoutPassword(updatedUser);

    return res.status(200).json({
      message: `Rôles retirés de l'utilisateur ${userWithoutPassword.firstName} avec succès`,
      user: userWithoutPassword,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createUserWithRoles = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { firstName, lastName, email, password, roles } = req.body;

    if (!valideEmail(email)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Format d'email invalide" });
    }

    const existingUser = await User.findOne({
      where: { email },
      transaction,
    });

    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Un utilisateur avec cet email existe déjà",
      });
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash(DEFAULT_PASSWD, 10);

    const newUser = await User.create(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
      { transaction }
    );

    if (roles && roles.length > 0) {
      const existingRoles = await Role.findAll({
        where: { idRole: roles },
        transaction,
      });

      if (existingRoles.length !== roles.length) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Un ou plusieurs rôles spécifiés n'existent pas",
        });
      }

      const userRoles = roles.map((idRole) => ({
        idUser: newUser.idUser,
        idRole,
      }));

      await UserRole.bulkCreate(userRoles, { transaction });
    }

    await transaction.commit();

    if (!password && EMAIL) {
      try {
        const mailOptions = {
          from: EMAIL,
          to: email,
          subject: "Vos informations de connexion",
          html: newUserEmailTemplate({
            name: `${firstName} ${lastName}`,
            email,
            password: DEFAULT_PASSWD,
            url: HOST_URL,
          }),
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email:", emailError);
      }
    }

    const userWithRoles = await User.findByPk(newUser.idUser, {
      include: [
        {
          model: Role,
          through: { attributes: [] },
        },
      ],
    });

    const userWithoutPassword = getUserWithoutPassword(userWithRoles);

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: userWithoutPassword,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;

    const user = await User.findByPk(id, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Cet utilisateur n'existe pas dans notre système",
      });
    }

    if (email && email !== user.email) {
      if (!valideEmail(email)) {
        await transaction.rollback();
        return res.status(400).json({ message: "Format d'email invalide" });
      }

      const existingUser = await User.findOne({
        where: {
          email,
          idUser: { [Op.ne]: id },
        },
        transaction,
      });

      if (existingUser) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Un utilisateur avec cet email existe déjà",
        });
      }
    }

    const updateData = {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData, { transaction });

    await transaction.commit();

    const updatedUser = await User.findByPk(id, {
      include: [
        {
          model: Role,
          through: { attributes: [] },
        },
      ],
    });

    const userWithoutPassword = getUserWithoutPassword(updatedUser);

    return res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
      user: userWithoutPassword,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;

    const user = await User.findByPk(id, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Cet utilisateur n'existe pas dans notre système",
      });
    }

    await UserRole.destroy({
      where: { idUser: id },
      transaction,
    });

    await user.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({
      message: `L'utilisateur ${user.firstName} ${user.lastName} a été supprimé avec succès`,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
