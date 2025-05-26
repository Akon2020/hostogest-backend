import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Hospitalization = db.define(
  "Hospitalization",
  {
    idHospitalization: {
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
    idOuting: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'outing',
        key: 'idOuting',
      },
    },
    idBed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'bed',
        key: 'idBed',
      },
    },
    admissionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "hospitalization",
    timestamps: false,
  }
);

export default Hospitalization;