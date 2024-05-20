import "dotenv/config";
import { Sequelize } from "sequelize";

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DIALECT = process.env.DB_DIALECT;
const DB_NAME = process.env.DB_NAME;
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
});
export default sequelize;
