import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Feature = db.define(
  "Feature",
  {
    idFeature: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "feature",
    timestamps: false,
  }
);

export default Feature;
