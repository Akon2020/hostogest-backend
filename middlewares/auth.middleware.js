import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import {
  User,
  Role,
  Permission,
  Feature,
  UserRole,
  RolePermission,
  PermissionFeature,
} from "../models/index.model.js";
import { getUserWithoutPassword } from "../utils/user.utils.js";

export const authenticationJWT = async (req, res, next) => {
  let token = null;

  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentification requise : Jeton manquant." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.email) {
      return res
        .status(401)
        .json({ message: "Jeton invalide : Email utilisateur manquant." });
    }

    const user = await User.findOne({
      where: { email: decoded.email },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: UserRole,
          as: "UserRoles",
          include: [
            {
              model: Role,
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
                              attributes: ["name"],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Utilisateur non trouvé ou compte désactivé." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Jeton expiré. Veuillez vous reconnecter." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Jeton invalide." });
    }
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de l'authentification." });
  }
};

export const checkAuthStatus = (req, res) => {
  try {
    if (req.user) {
      const userWithoutPassword = getUserWithoutPassword(req.user);
      return res.status(200).json({
        authenticated: true,
        user: userWithoutPassword,
      });
    } else {
      return res.status(200).json({
        authenticated: false,
        message: "Aucun utilisateur authentifié.",
      });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification du statut d'authentification:",
      error
    );
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

export const hasPermissionForFeature = (featureName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message:
            "Vous devez être authentifié pour accéder à cette ressource. Utilisateur non trouvé après authentification.",
        });
      }

      let hasPermission = false;

      if (req.user.UserRoles && Array.isArray(req.user.UserRoles)) {
        for (const userRole of req.user.UserRoles) {
          const role = userRole.Role;
          if (
            role &&
            role.RolePermissions &&
            Array.isArray(role.RolePermissions)
          ) {
            for (const rolePermission of role.RolePermissions) {
              const permission = rolePermission.Permission;
              if (
                permission &&
                permission.PermissionFeatures &&
                Array.isArray(permission.PermissionFeatures)
              ) {
                for (const permissionFeature of permission.PermissionFeatures) {
                  const feature = permissionFeature.Feature;
                  if (feature && feature.name === featureName) {
                    hasPermission = true;
                    break;
                  }
                }
              }
              if (hasPermission) break;
            }
          }
          if (hasPermission) break;
        }
      }

      if (!hasPermission) {
        return res.status(403).json({
          message: `Accès refusé. Vous n'avez pas la permission requise pour '${featureName}'.`,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        message: "Erreur serveur lors de la vérification des permissions.",
      });
      next(error);
    }
  };
};
