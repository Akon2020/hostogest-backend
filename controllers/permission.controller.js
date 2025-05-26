import {
  Permission,
  Feature,
  PermissionFeature,
} from "../models/index.model.js";
import { Op } from "sequelize";
import db from "../database/db.js";

export const getAllPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.findAll({
      include: [
        {
          model: Feature,
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      nombre: permissions.length,
      permissionsInfo: permissions,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getPermissionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findByPk(id, {
      include: [
        {
          model: Feature,
          through: { attributes: [] },
        },
      ],
    });

    if (!permission) {
      return res.status(404).json({
        message: "Cette permission n'existe pas dans notre système",
      });
    }

    return res.status(200).json({ permission });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createPermission = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { name, description, features } = req.body;

    const existingPermission = await Permission.findOne({
      where: {
        [Op.or]: [{ name }, { description }],
      },
    });

    if (existingPermission) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Une permission avec ce nom ou cette description existe déjà",
      });
    }

    const newPermission = await Permission.create(
      {
        name,
        description,
      },
      { transaction }
    );

    if (features && features.length > 0) {
      const existingFeatures = await Feature.findAll({
        where: { idFeature: features },
        transaction,
      });

      if (existingFeatures.length !== features.length) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Une ou plusieurs fonctionnalités spécifiées n'existent pas",
        });
      }

      const permissionFeatures = features.map((idFeature) => ({
        idPermission: newPermission.idPermission,
        idFeature,
      }));

      await PermissionFeature.bulkCreate(permissionFeatures, { transaction });
    }

    await transaction.commit();

    const permissionWithFeatures = await Permission.findByPk(
      newPermission.idPermission,
      {
        include: [
          {
            model: Feature,
            through: { attributes: [] },
          },
        ],
      }
    );

    return res.status(201).json({
      message: `La permission ${newPermission.name} créée avec succès`,
      permission: permissionWithFeatures,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updatePermission = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;
    const { name, description, features } = req.body;

    const permission = await Permission.findByPk(id, { transaction });
    if (!permission) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Cette permission n'existe pas dans notre système",
      });
    }

    if (name !== permission.name || description !== permission.description) {
      const existingPermission = await Permission.findOne({
        where: {
          [Op.and]: [
            { idPermission: { [Op.ne]: id } },
            {
              [Op.or]: [{ name }, { description }],
            },
          ],
        },
        transaction,
      });

      if (existingPermission) {
        await transaction.rollback();
        return res.status(400).json({
          message:
            "Une permission avec ce nom ou cette description existe déjà",
        });
      }
    }

    await permission.update(
      {
        name: name || permission.name,
        description: description || permission.description,
      },
      { transaction }
    );

    if (features) {
      if (features.length > 0) {
        const existingFeatures = await Feature.findAll({
          where: { idFeature: features },
          transaction,
        });

        if (existingFeatures.length !== features.length) {
          await transaction.rollback();
          return res.status(400).json({
            message:
              "Une ou plusieurs fonctionnalités spécifiées n'existent pas",
          });
        }
      }

      await PermissionFeature.destroy({
        where: { idPermission: id },
        transaction,
      });

      if (features.length > 0) {
        const permissionFeatures = features.map((idFeature) => ({
          idPermission: id,
          idFeature,
        }));

        await PermissionFeature.bulkCreate(permissionFeatures, { transaction });
      }
    }

    await transaction.commit();

    const updatedPermission = await Permission.findByPk(id, {
      include: [
        {
          model: Feature,
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      message: `La permission ${permission.name} a été mise à jour avec succès`,
      permission: updatedPermission,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deletePermission = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;

    const permission = await Permission.findByPk(id, { transaction });
    if (!permission) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Cette permission n'existe pas dans notre système",
      });
    }

    await PermissionFeature.destroy({
      where: { idPermission: id },
      transaction,
    });

    await permission.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({
      message: `La permission ${permission.name} a été supprimée avec succès`,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const addFeaturesToPermission = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;
    const { features } = req.body;

    if (!features || !Array.isArray(features) || features.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "La liste des fonctionnalités est requise et ne peut pas être vide",
      });
    }

    const permission = await Permission.findByPk(id, { transaction });
    if (!permission) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Cette permission n'existe pas dans notre système",
      });
    }

    const existingFeatures = await Feature.findAll({
      where: { idFeature: features },
      transaction,
    });

    if (existingFeatures.length !== features.length) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Une ou plusieurs fonctionnalités spécifiées n'existent pas",
      });
    }

    const existingAssociations = await PermissionFeature.findAll({
      where: {
        idPermission: id,
        idFeature: features,
      },
      transaction,
    });

    const existingFeatureIds = existingAssociations.map(
      (assoc) => assoc.idFeature
    );
    const newFeatureIds = features.filter(
      (featureId) => !existingFeatureIds.includes(featureId)
    );

    if (newFeatureIds.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Toutes les fonctionnalités spécifiées sont déjà associées à cette permission",
      });
    }

    const permissionFeatures = newFeatureIds.map((idFeature) => ({
      idPermission: id,
      idFeature,
    }));

    await PermissionFeature.bulkCreate(permissionFeatures, { transaction });

    await transaction.commit();

    const updatedPermission = await Permission.findByPk(id, {
      include: [
        {
          model: Feature,
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      message: `${newFeatureIds.length} fonctionnalités ont été ajoutées à la permission ${permission.name} avec succès`,
      permission: updatedPermission,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const removeFeaturesFromPermission = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;
    const { features } = req.body;

    if (!features || !Array.isArray(features) || features.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "La liste des fonctionnalités est requise et ne peut pas être vide",
      });
    }

    const permission = await Permission.findByPk(id, { transaction });
    if (!permission) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Cette permission n'existe pas dans notre système",
      });
    }

    await PermissionFeature.destroy({
      where: {
        idPermission: id,
        idFeature: features,
      },
      transaction,
    });

    await transaction.commit();

    const updatedPermission = await Permission.findByPk(id, {
      include: [
        {
          model: Feature,
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      message: `${features.length} fonctionnalités retirées de la permission ${permission.name} avec succès`,
      permission: updatedPermission,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
