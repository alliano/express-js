import { sequelize } from "../src/db/models/ModelsSyncronization";
import { createUsers } from "./testUtils";

describe("test db connection", () => {
  beforeEach(async () => {
    await sequelize.truncate({ cascade: true });
  });
  it("should can be connect", async () => {
    await sequelize.authenticate();
  });
  it("should can create user", async () => {
    const user = await createUsers();
    console.log(user);
  });
});
