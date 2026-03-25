import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce.number().int(),
});

export const createUserSchema = z.object({
  username: z.string().min(3).max(100),
  phone: z.string().min(10).max(20),
  password: z.string().min(6).max(100),
  name: z.string().min(2).max(100).optional(),
  surname: z.string().min(2).max(100).optional(),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).max(100).optional(),
  phone: z.string().min(10).max(20).optional(),
  password: z.string().min(6).max(100).optional(),
  name: z.string().min(2).max(100).optional(),
  surname: z.string().min(2).max(100).optional(),
});
