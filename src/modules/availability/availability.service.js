import { availabilityRepository } from "./availability.repository.js";

const availabilityService = {
  getByUser: async (userId) => {
    return availabilityRepository.findByUser(userId);
  },

  setAvailability: async (userId, data) => {
    if (!Array.isArray(data) || data.length === 0) {
      throwError("Debes enviar al menos un horario", 400);
    }

    // validación básica
    data.forEach((slot) => {
      if (slot.dayOfWeek === undefined || !slot.startTime || !slot.endTime) {
        throwError("Datos de disponibilidad inválidos", 400);
      }

      if (slot.startTime >= slot.endTime) {
        throwError("startTime debe ser menor que endTime", 400);
      }
    });

    await availabilityRepository.deleteByUser(userId);

    const formatted = data.map((slot) => ({
      userId,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    await availabilityRepository.createMany(formatted);

    return true;
  },
};

export default availabilityService;
