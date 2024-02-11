import z from "zod";

const movieSchema = z.object({
  title: z.string().min(1),
  year: z.number().int().min(1888).max(new Date().getFullYear()),
  director: z.string().min(1),
  poster: z.string().url({
    message: "Poster must be a valid URL",
  }),
  genre: z.array(
    z.enum(["Sci-Fi", "Action", "Thriller", "Drama", "Crime", "Comedy"]),
    {
      required_error: "Genre is required",
      invalid_type_error: "Genre must be an array of strings",
      min_items: 1,
    }
  ),
  rate: z.number().min(0).max(10, {
    message: "Rate must be between 0 and 10",
  }),
  duration: z.number().int().positive(),
});

const validateMovie = async (obj) => {
  return await movieSchema.safeParseAsync(obj);
};

const modifyPartialMovie = async (obj) => {
  return await movieSchema.partial().safeParseAsync(obj);
};

console.log(
  await modifyPartialMovie({
    title: "The Matrix",
  })
);

export { validateMovie, modifyPartialMovie };
