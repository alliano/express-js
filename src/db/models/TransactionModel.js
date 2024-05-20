import { DataTypes, Model } from "sequelize";
import sequelize from "../config/connection.js";

export default class Transaction extends Model {}
Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    secureId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    buyer: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    productName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "transaction",
    sequelize: sequelize,
    underscored: true,
  }
);
