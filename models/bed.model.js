import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Bed = db.define(
  "Bed",
  {
    idBed: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bedNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    idRoom: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'room',
        key: 'idRoom',
      },
    },
    status: {
      type: DataTypes.ENUM('Libre', 'Occupée'),
      defaultValue: 'Libre',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "bed",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['idRoom', 'bedNumber']
      }
    ]
  }
);

export default Bed;