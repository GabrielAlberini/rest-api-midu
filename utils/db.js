import { createRequire } from "module";
import fs from "fs/promises";
import path from "path";

const require = createRequire(import.meta.url);
const filePath = path.join(process.cwd(), "users.json");

const readDb = async () => {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

const writeDb = async (data) => {
  try {
    const usersData = await readDb();
    usersData.push(data);
    await fs.writeFile(filePath, JSON.stringify(usersData), "utf-8");
    console.log("The file has been saved!");
    return usersData;
  } catch (error) {
    console.error("Error writing to file:", error);
    throw error;
  }
};

export { readDb, writeDb };
