import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Mensuration = db.define(
  "Mensuration",
  {
    idMensuration: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    temperature: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    respiratoryRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    heartRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bloodPressure: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bodyMassIndex: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bloodOxygenSaturation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pignetIndex: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    passedOn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "mensuration",
    timestamps: false,
  }
);

export default Mensuration;