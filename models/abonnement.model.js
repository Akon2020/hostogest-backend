import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Abonnement = db.define(
  "Abonnement",
  {
    idAbonnement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idPatient: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'patient',
        key: 'idPatient',
      },
    },
    organisation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    abonnementDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "abonnement",
    timestamps: false,
  }
);

export default Abonnement;