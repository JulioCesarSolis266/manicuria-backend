import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce.number().int(),
});

export const createClientSchema = z.object({
  name: z.string().min(2).max(100),
  surname: z.string().min(2).max(100),
  phone: z.string().regex(/^\d{10,20}$/, "Debe contener solo números"),
  notes: z.string().max(500).optional(),
});

export const updateClientSchema = createClientSchema.partial();
