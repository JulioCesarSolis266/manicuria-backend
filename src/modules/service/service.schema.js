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
    .min(5, "Mínimo 5 minutos")
    .max(1440, "Máximo 24 horas"),
  category: z.string().optional(),
  description: z.string().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();
