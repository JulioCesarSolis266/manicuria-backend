import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce.number().int(),
});

export const createServiceSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  price: z.coerce.number().min(0, "El precio debe ser >= 0"),
  durationMinutes: z.coerce
    .number()
    .int("Debe ser entero")
    .min(5, "Mínimo 5 minutos"),
  category: z.string().optional(),
  description: z.string().optional(),
});

export const updateServiceSchema = z.object({
  name: z.string().min(3).optional(),
  price: z.coerce.number().min(0).optional(),
  durationMinutes: z.coerce.number().int().min(5).optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});
