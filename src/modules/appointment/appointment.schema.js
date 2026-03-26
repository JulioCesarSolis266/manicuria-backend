import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce.number().int(),
});

export const createAppointmentSchema = z.object({
  date: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Fecha inválida",
    }),
  clientId: z.coerce.number().int(),
  serviceId: z.coerce.number().int(),
  description: z.string().max(500).optional(),
});

export const updateAppointmentSchema = createAppointmentSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo",
  });
