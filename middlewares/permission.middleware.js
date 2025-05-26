import UserModel from "../models/user.model.js";

export const checkFeatureAccess = (featureName) => {
  return async (req, res, next) => {
    const userId = req.user.idUser;
    const [features] = await UserModel.findUserFeatureAndPermission(userId);
    const hasAccess = features.some((f) => f.name === featureName);

    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "Access to this feature is denied" });
    }
    next();
  };
};
