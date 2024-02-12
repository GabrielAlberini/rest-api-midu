import { createRequire } from "module";
import { readDb } from "./db.js";

const require = createRequire(import.meta.url);
const users = require("../users.json");

const exportUsers = async () => {
  const users = await readDb();
  return users;
};

const findUserById = async (id) => {
  const users = await exportUsers();
  return users.find((user) => user.id === id);
};

const findIndexUser = async (id) => {
  const users = await exportUsers();
  const user = users.findIndex((user) => {
    return user.id === id;
  });

  return user;
};

export { exportUsers, findUserById, findIndexUser };
