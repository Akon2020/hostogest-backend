import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Antecedent = db.define(
  "Antecedent",
  {
    idAntecedent: {
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
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "antecedent",
    timestamps: false,
  }
);

export default Antecedent;