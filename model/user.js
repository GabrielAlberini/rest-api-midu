import { readDb } from "../utils/db.js";
import { exportUsers, findIndexUser, findUserById } from "../utils/users.js";
import { validateUser, validatePartialUser } from "../validators/users.js";
import fs from "node:fs/promises";

export class UserModel {
  static getAll = async () => {
    try {
      const usersData = await readDb();
      return { status: 200, data: usersData };
    } catch (error) {
      console.error("Error in reading users:", error);
      return { status: 500, error: "Internal server error" };
    }
  };

  static getById = async (id) => {
    try {
      const user = await findUserById(id);
      if (!user) return { status: 404, error: "User not found." };
      return { status: 200, data: user };
    } catch (error) {
      console.error("Error in reading user:", error);
      return { status: 500, error: "Internal server error" };
    }
  };

  static addNewUser = async (obj) => {
    try {
      const response = await validateUser(obj);

      if (response.error) {
        return { status: 400, error: response.error };
      }

      response.data.password = Buffer.from(
        response.data.password,
        "utf-8"
      ).toString("base64");

      response.data.id = crypto.randomUUID();

      const users = await readDb();
      users.push(response.data);

      await fs.writeFile("./users.json", JSON.stringify(users));

      return response.data;
    } catch (error) {
      console.error("Error in adding user:", error);
      return { status: 500, error: "Internal server error" };
    }
  };

  static patchUser = async ({ id, body }) => {
    try {
      const [users, response, indexUser, user] = await Promise.all([
        exportUsers(),
        validatePartialUser(body),
        findIndexUser(id),
        UserModel.getById(id),
      ]);

      if (!users) {
        return null;
      }

      if (response.error) {
        return { status: 400, error: response.error };
      }

      if (indexUser === -1) {
        return { status: 404, error: "User not found" };
      }

      if (response.data.password) {
        response.data.password = Buffer.from(
          response.data.password,
          "utf-8"
        ).toString("base64");
      }

      const updateUser = { ...user.data, ...response.data };

      users[indexUser] = updateUser;

      await fs.writeFile("./users.json", JSON.stringify(users));

      return { status: 200, data: updateUser };
    } catch (err) {
      console.error("Error in patching user:", err);
      throw { status: 500, error: "Internal server error" };
    }
  };

  static deleteUser(id) {
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      return null;
    }
    users.splice(index, 1);
    return true;
  }
}
