import { DataTypes } from "sequelize";
import db from "../database/db.js";

const UserRole = db.define(
  "UserRole",
  {
    idUser: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "user",
        key: "idUser",
      },
    },
    idRole: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "role",
        key: "idRole",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "userrole",
    timestamps: false,
  }
);

export default UserRole;
