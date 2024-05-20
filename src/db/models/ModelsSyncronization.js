import sequelize from "../config/connection.js";
import Address from "./AddressModel.js";
import Users from "./UserModel.js";
import Product from "./ProductModel.js";
import Transaction from "./TransactionModel.js";

const UsersAddress = Users.Address = Users.hasOne(Address, {
  foreignKey: {
    allowNull: true,
    field: "user_id",
  },
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
Address.belongsTo(Users);

export { Users, Address, 
  Product, Transaction, sequelize, UsersAddress };
