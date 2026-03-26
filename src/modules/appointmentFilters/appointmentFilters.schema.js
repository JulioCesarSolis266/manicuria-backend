import { z } from "zod";

export const filterAppointmentsSchema = z
  .object({
    status: z.enum(["pending", "confirmed", "cancelled"]).optional(),

    startDate: z
      .string()
      .transform((val) => new Date(val))
      .refine((date) => !isNaN(date.getTime()), "Fecha inválida")
      .optional(),

    endDate: z
      .string()
      .transform((val) => new Date(val))
      .refine((date) => !isNaN(date.getTime()), "Fecha inválida")
      .optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "startDate no puede ser mayor que endDate",
    },
  );
