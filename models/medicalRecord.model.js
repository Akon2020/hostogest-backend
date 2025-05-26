import { DataTypes } from "sequelize";
import db from "../database/db.js";

const MedicalRecord = db.define(
  "MedicalRecord",
  {
    idMedicalRecord: {
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
    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "medicalrecord",
    timestamps: false,
  }
);

export default MedicalRecord;