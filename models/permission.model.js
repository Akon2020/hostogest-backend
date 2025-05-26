import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Permission = db.define(
  "Permission",
  {
    idPermission: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(180),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "permission",
    timestamps: false,
  }
);

export default Permission;

// import db from "../database/db.js";

// export default class PermissionModel {
//   static async findPermissionByName(name) {
//     const [rows] = await db.query("SELECT * FROM Permission WHERE name = ?", [
//       name,
//     ]);
//     return rows.length > 0 ? rows[0] : null;
//   }

//   static async findRoleByName(name) {
//     const [rows] = await db.query("SELECT * FROM Role WHERE name = ?", [name]);
//     return rows.length > 0 ? rows[0] : null;
//   }

//   static async findUserByEmail(email) {
//     const [rows] = await db.query("SELECT * FROM User WHERE email = ?", [
//       email,
//     ]);
//     return rows.length > 0 ? rows[0] : null;
//   }

//   static async findFeatureById(idFeature) {
//     const [rows] = await db.query("SELECT * FROM Feature WHERE idFeature = ?", [
//       idFeature,
//     ]);
//     return rows.length > 0 ? rows[0] : null;
//   }

//   static async isFeatureLinkedToPermission(idPermission, idFeature) {
//     const [rows] = await db.query(
//       "SELECT * FROM PermissionFeature WHERE idPermission = ? AND idFeature = ?",
//       [idPermission, idFeature]
//     );
//     return rows.length > 0;
//   }

//   static async assignPermissionToRole(idRole, idPermission) {
//     const [result] = await db.query(
//       "INSERT INTO RolePermission (idRole, idPermission) VALUES (?, ?)",
//       [idRole, idPermission]
//     );
//     return result;
//   }

//   static async assignFeaturesToPermission(idPermission, featureIds) {
//     const filtered = [];

//     for (const idFeature of featureIds) {
//       const exists = await this.isFeatureLinkedToPermission(
//         idPermission,
//         idFeature
//       );
//       if (!exists) filtered.push([idPermission, idFeature]);
//     }

//     if (filtered.length === 0) return { affectedRows: 0 };

//     const [result] = await db.query(
//       "INSERT INTO PermissionFeature (idPermission, idFeature) VALUES ?",
//       [filtered]
//     );
//     return result;
//   }

//   static async removeFeaturesFromPermission(idPermission, featureIds) {
//     const [result] = await db.query(
//       `DELETE FROM PermissionFeature WHERE idPermission = ? AND idFeature IN (${featureIds
//         .map(() => "?")
//         .join(",")})`,
//       [idPermission, ...featureIds]
//     );
//     return result;
//   }

//   static async removeAllFeaturesFromPermission(idPermission) {
//     const [result] = await db.query(
//       "DELETE FROM PermissionFeature WHERE idPermission = ?",
//       [idPermission]
//     );
//     return result;
//   }

//   static async updateFeaturesForPermission(idPermission, newFeatureIds) {
//     await this.removeAllFeaturesFromPermission(idPermission);
//     return this.assignFeaturesToPermission(idPermission, newFeatureIds);
//   }

//   static async getUserRolesAndPermissions(idUser) {
//     const [rows] = await db.query(
//       `SELECT r.name AS roleName, p.name AS permissionName
//        FROM UserRole ur
//        JOIN Role r ON ur.idRole = r.idRole
//        JOIN RolePermission rp ON rp.idRole = r.idRole
//        JOIN Permission p ON rp.idPermission = p.idPermission
//        WHERE ur.idUser = ?`,
//       [idUser]
//     );
//     return rows;
//   }

//   static async getFeaturesByPermissionName(permissionName) {
//     const [rows] = await db.query(
//       `SELECT f.idFeature, f.name, f.description
//        FROM Permission p
//        JOIN PermissionFeature pf ON pf.idPermission = p.idPermission
//        JOIN Feature f ON pf.idFeature = f.idFeature
//        WHERE p.name = ?`,
//       [permissionName]
//     );
//     return rows;
//   }
// }
