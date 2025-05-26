import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Suivie = db.define(
  "Suivie",
  {
    idSuivie: {
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
    idIntervention: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'intervention',
        key: 'idIntervention',
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
    idConsommation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'consommation',
        key: 'idConsommation',
      },
    },
    idMedecineAdministration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'medecineadministration',
        key: 'idMedecineAdministration',
      },
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'idUser',
      },
    },
    service: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    suivieDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "suivie",
    timestamps: false,
  }
);

export default Suivie;