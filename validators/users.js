import z from "zod";

const userSchema = z.object({
  name: z.string(),
  age: z.number().int().min(18),
  email: z.string().email(),
  city: z.string(),
  password: z.string(),
  state: z.enum(["Active", "Inactive"]).default("Inactive"),
  role: z
    .enum(["User", "Admin"], {
      errorMap: () => ({ message: "Invalid role" }),
    })
    .default("User"),
});

const validateUser = (obj) => {
  return userSchema.safeParseAsync(obj);
};

const validatePartialUser = (obj) => {
  return userSchema.partial().safeParseAsync(obj);
};

export { validateUser, validatePartialUser };
