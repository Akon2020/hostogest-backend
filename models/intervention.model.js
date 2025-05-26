import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Intervention = db.define(
  "Intervention",
  {
    idIntervention: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    intervationType: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "intervention",
    timestamps: false,
  }
);

export default Intervention;