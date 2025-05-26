import { DataTypes } from "sequelize";
import db from "../database/db.js";

const ExamenType = db.define(
  "ExamenType",
  {
    idExamenType: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "examentype",
    timestamps: false,
  }
);

export default ExamenType;