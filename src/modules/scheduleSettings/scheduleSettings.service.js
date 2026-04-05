import { scheduleSettingsRepository } from "./scheduleSettings.repository.js";

const scheduleSettingsService = {
  getByUser: async (userId) => {
    let settings = await scheduleSettingsRepository.findByUserId(userId);

    if (!settings) {
      settings = await scheduleSettingsRepository.create({ userId });
    }

    return settings;
  },

  update: async (userId, data) => {
    const { maxConcurrentAppointments } = data;

    if (
      maxConcurrentAppointments !== undefined &&
      maxConcurrentAppointments < 1
    ) {
      throwError("Debe ser al menos 1", 400);
    }

    let settings = await scheduleSettingsRepository.findByUserId(userId);

    if (!settings) {
      return scheduleSettingsRepository.create({
        userId,
        maxConcurrentAppointments: parseInt(maxConcurrentAppointments) || 1,
      });
    }

    return scheduleSettingsRepository.update(userId, {
      maxConcurrentAppointments:
        maxConcurrentAppointments !== undefined
          ? parseInt(maxConcurrentAppointments)
          : settings.maxConcurrentAppointments,
    });
  },
};

export default scheduleSettingsService;
