import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Examen = db.define(
  "Examen",
  {
    idExamen: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idConsultation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'consultation',
        key: 'idConsultation',
      },
    },
    idExamenType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'examentype',
        key: 'idExamenType',
      },
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    resultat: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Fait', 'Attente'),
      defaultValue: 'Attente',
      allowNull: false,
    },
    laboratoire: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    examenDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "examen",
    timestamps: false,
  }
);

export default Examen;