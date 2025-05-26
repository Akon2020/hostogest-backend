import { DataTypes } from "sequelize";
import db from "../database/db.js";

const PermissionFeature = db.define(
  "PermissionFeature",
  {
    idPermission: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "permission",
        key: "idPermission",
      },
    },
    idFeature: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "feature",
        key: "idFeature",
      },
    },
    assignAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "permissionfeature",
    timestamps: false,
  }
);

export default PermissionFeature;
