import { DataTypes, Model } from "sequelize";
import sequelize from "../config/connection.js";

export default class Product extends Model {}
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    secureId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    tableName: "products",
    underscored: true,
    indexes: [
      {
        fields: ["name"],
      },
    ],
  }
);
