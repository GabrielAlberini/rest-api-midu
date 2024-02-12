import express from "express";
import { movieRouter } from "./routes/users.js";
import { corsMiddleware } from "./middlewares/cors.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.disable("x-powered-by");
app.use(express.json());

//Middleware para cors
app.use(corsMiddleware());
app.use("/users", movieRouter);

app.get("/", (req, res) => {
  res.send({
    apiStatus: "200",
    index: {
      allUsers: "/users",
      userById: "/users/:id",
      addNewUser: "/users",
      patchUser: "/users/:id",
    },
    dev: "gabrielalberini",
    linkedin: "https://www.linkedin.com/in/gabriel-alberini/",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
