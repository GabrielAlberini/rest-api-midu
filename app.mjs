import express from "express";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import movies from "./movies.json" assert { type: "json" };
import { validateMovie, modifyPartialMovie } from "./schemas/movies.mjs";

const app = express();
app.disable("x-powered-by");

app.use(express.json());

app.get("/movies", async (req, res) => {
  try {
    const { genre } = req.query;

    const filteredMovies = genre
      ? movies.filter((movie) =>
          movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
        )
      : movies;

    res.send(filteredMovies);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/movies/:id", async (req, res) => {
  try {
    const movie = movies.find((movie) => movie.id === req.params.id);
    if (!movie) {
      res.status(404).send({ message: "Movie not found" });
    }
    res.send(movie);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/movies", async (req, res) => {
  try {
    const result = await validateMovie(req.body);
    if (result.error) {
      return res.status(400).send(result.error.message);
    }
    const newMovie = {
      id: crypto.randomUUID(),
      ...result.data,
    };
    movies.push(newMovie);
    await fs.writeFile("./movies.json", JSON.stringify(movies));
    return res.status(201).send(newMovie);
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.patch("/movies/:id", async (req, res) => {
  const result = await modifyPartialMovie(req.body);

  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  const movieIndex = movies.findIndex((movie) => movie.id === req.params.id);

  if (movieIndex === -1) {
    return res.status(404).send({ message: "Movie not found" });
  }

  movies[movieIndex] = { ...movies[movieIndex], ...result.data };

  await fs.writeFile("./movies.json", JSON.stringify(movies));

  res.send(movies[movieIndex]);
});

app.use((req, res) => {
  res.status(404).send({
    status: 404,
    message: "Not found",
    index: {
      title: "Movies api",
      url: "/movies",
    },
  });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
