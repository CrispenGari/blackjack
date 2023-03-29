import { z } from "zod";

export const loginSchema = z.object({
  nickname: z.string(),
  password: z.string(),
  web: z.boolean(),
});

export const registerSchema = z.object({
  nickname: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
  web: z.boolean(),
});

export const onAuthStateChangeSchema = z.object({
  gamerId: z.string(),
});
