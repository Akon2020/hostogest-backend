import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Consultation = db.define(
  "Consultation",
  {
    idConsultation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'idUser',
      },
    },
    idPatient: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'patient',
        key: 'idPatient',
      },
    },
    idMensuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'mensuration',
        key: 'idMensuration',
      },
    },
    idAntecedent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'antecedent',
        key: 'idAntecedent',
      },
    },
    idPrescription: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'prescription',
        key: 'idPrescription',
      },
    },
    idHospitalization: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'hospitalization',
        key: 'idHospitalization',
      },
    },
    motif: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    anamnese: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    conclusion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "consultation",
    timestamps: false,
  }
);

export default Consultation;