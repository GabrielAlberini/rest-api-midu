import { Router } from "express";
import { exportUsers, findIndexUser, findUserById } from "../utils/users.js";
import { UserModel } from "../model/user.js";

const movieRouter = Router();

movieRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.getAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

movieRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.getById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

movieRouter.post("/", async (req, res) => {
  try {
    const response = await UserModel.addNewUser(req.body);
    if (!response) return res.status(400).json({ error });
    return res.status(201).json({ data: response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

movieRouter.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const response = await UserModel.patchUser({ id, body });

    if (response.status === 404)
      return res.status(404).json({ error: response.error });

    if (response.status === 400)
      return res.status(400).json({ error: response.error });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in patching user:", error);
    return res
      .status(error.status || 500)
      .json({ error: error.error || "Internal server error" });
  }
});

movieRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [indexUser, users] = await Promise.all([
      findIndexUser(id),
      exportUsers(),
    ]);

    if (indexUser === -1)
      return res.status(404).json({ error: "User not found" });

    users.splice(indexUser, 1);

    return res.status(200).json({ message: `User ${id} deleted successfully` });
  } catch (error) {
    console.error("Error in patching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { movieRouter };
