import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Prescription = db.define(
  "Prescription",
  {
    idPrescription: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idPatient: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "patient",
        key: "idPatient",
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "prescription",
    timestamps: false,
  }
);

export default Prescription;
