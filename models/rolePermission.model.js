import { DataTypes } from "sequelize";
import db from "../database/db.js";

const RolePermission = db.define(
  "RolePermission",
  {
    idRole: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "role",
        key: "idRole",
      },
    },
    idPermission: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "permission",
        key: "idPermission",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "rolepermission",
    timestamps: false,
  }
);

export default RolePermission;
