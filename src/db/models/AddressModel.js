import { DataTypes, Model } from "sequelize";
import sequelize from "../config/connection.js";

export default class Address extends Model {}
Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    secureId: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    cinty: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    vilage: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    zip: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    tableName: "addresses",
    underscored: true,
    indexes: [
      {
        fields: ["country"],
        unique: false,
      },
    ],
  }
);
