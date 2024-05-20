import { DataTypes, Model } from "sequelize";
import sequelize from "../config/connection.js";

export default class Users extends Model {}
Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    secureId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      unique: false,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    tableName: "users",
    underscored: true,
    indexes: [
      {
        fields: ["email"],
        unique: true,
      },
    ],
  }
);
