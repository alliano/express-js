import express from "express";
import "dotenv/config";
// import { sequelize } from "./db/models/ModelsSyncronization.js";
const SERVER_PORT = process.env.SERVER_PORT;
const application = new express();
application.get("/", async (req, resp) => {
  // await sequelize.authenticate();
  resp.send("Server is on");
});
// application.listen(SERVER_PORT, () => {
//   // await sequelize.sync({ force: true });
//   console.log(`server running on port http://localhost:${SERVER_PORT}`);
// });
export { application };
