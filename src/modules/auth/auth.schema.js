import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(3).max(100),

    phone: z.string().regex(/^\d{8,20}$/, "Teléfono inválido"), //

    password: z.string().min(5, "Mínimo 5 caracteres").max(100),
    // .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
    // .regex(/[a-z]/, "Debe tener al menos una minúscula")
    // .regex(/\d/, "Debe tener al menos un número"),

    name: z.string().min(3).max(100).optional(),
    surname: z.string().min(3).max(100).optional(),
  })
  .strict();

export const loginSchema = z
  .object({
    username: z.string().min(3),
    password: z.string().min(5, "Mínimo 5 caracteres"),
  })
  .strict();
