import { sequelize } from "../src/db/models/ModelsSyncronization.js";
const createUsers = async () => {
  const user = await sequelize.models.Users.create({
    firstName: "Audia",
    lastName: "Naila Safa",
    email: "audiaalli@gmail.com",
    password: "secretPassword",
  });

  await sequelize.models.Address.create({
    user_id: user.toJSON().id,
    country: "Indonesian",
    province: "East Java",
    city: "Surabaya",
    vilage: "Bogorame Indah Regency",
    zip: "94574",
  });
};

export { createUsers };
