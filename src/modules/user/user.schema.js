import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce.number().int(),
});

export const createUserSchema = z.object({
  username: z.string().min(3).max(100),
  phone: z.string().regex(/^\d{7,20}$/, "Teléfono inválido"),
  password: z.string().min(5).max(100), // Solo para creación, no se puede actualizar la contraseña con este esquema
  name: z.string().min(3).max(100).optional(),
  surname: z.string().min(3).max(100).optional(),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).max(100).optional(),
  phone: z
    .string()
    .regex(/^\d{7,20}$/, "Teléfono inválido")
    .optional(),
  name: z.string().min(3).max(100).optional(),
  surname: z.string().min(3).max(100).optional(),
});
