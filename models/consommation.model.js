import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Consommation = db.define(
  "Consommation",
  {
    idConsommation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    unite: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    prixUnitaire: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "consommation",
    timestamps: false,
  }
);

export default Consommation;