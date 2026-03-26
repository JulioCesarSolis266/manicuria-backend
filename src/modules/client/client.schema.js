import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce.number().int(),
});

export const createClientSchema = z.object({
  name: z.string().min(2).max(100),
  surname: z.string().min(2).max(100),
  phone: z
    .string()
    .transform((val) => val.replace(/\D/g, "")) // elimina todo lo que no sea número
    .refine((val) => val.length >= 8 && val.length <= 20, {
      message: "Número inválido",
    }),
  notes: z.string().max(500).optional(),
});

export const updateClientSchema = createClientSchema.partial();
