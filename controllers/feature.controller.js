import { Feature } from "../models/index.model.js";

export const getAllFeatures = async (req, res, next) => {
  try {
    const features = await Feature.findAll();
    return res.status(200).json({
      nombre: features.length,
      featuresInfo: features,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getFeatureById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feature = await Feature.findByPk(id);

    if (!feature) {
      return res.status(404).json({
        message: "Cette fonctionnalité n'existe pas dans notre système",
      });
    }

    return res.status(200).json({ featureInfo: feature });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createFeature = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const existingFeature = await Feature.findOne({ where: { name } });
    if (existingFeature) {
      return res.status(400).json({
        message: "Cette fonctionnalité existe déjà",
      });
    }

    const newFeature = await Feature.create({
      name,
      description,
    });

    return res.status(201).json({
      message: `La fonctionnalité ${name} a été créée avec succès`,
      feature: newFeature,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateFeature = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const feature = await Feature.findByPk(id);
    if (!feature) {
      return res.status(404).json({
        message: "Cette fonctionnalité n'existe pas dans notre système",
      });
    }

    if (name && name !== feature.name) {
      const existingFeature = await Feature.findOne({ where: { name } });
      if (existingFeature) {
        return res.status(400).json({
          message: "Une fonctionnalité avec ce nom existe déjà",
        });
      }
    }

    await feature.update({
      name: name || feature.name,
      description:
        description !== undefined ? description : feature.description,
    });

    return res.status(200).json({
      message: `La fonctionnalité ${name} a été mise à jour avec succès`,
      feature,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteFeature = async (req, res, next) => {
  try {
    const { id } = req.params;

    const feature = await Feature.findByPk(id);
    if (!feature) {
      return res.status(404).json({
        message: "Cette fonctionnalité n'existe pas dans notre système",
      });
    }

    await feature.destroy();

    return res.status(200).json({
      message: `La fonctionnalité ${feature.name} a été supprimée avec succès`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
