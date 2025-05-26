import { DataTypes } from "sequelize";
import db from "../database/db.js";

const MedecineAdministration = db.define(
  "MedecineAdministration",
  {
    idMedecineAdministration: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomMedicament: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    AdministrationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "medecineadministration",
    timestamps: false,
  }
);

export default MedecineAdministration;