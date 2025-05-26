import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Outing = db.define(
  "Outing",
  {
    idOuting: {
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
    outingDiagnostic: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('True', 'False'),
      defaultValue: 'False',
      allowNull: false,
    },
    approvedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "outing",
    timestamps: false,
  }
);

export default Outing;