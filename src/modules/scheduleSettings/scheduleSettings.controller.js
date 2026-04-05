import scheduleSettingsService from "./scheduleSettings.service.js";

const scheduleSettingsController = {
  get: async (req, res, next) => {
    try {
      const data = await scheduleSettingsService.getByUser(req.user.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const data = await scheduleSettingsService.update(req.user.id, req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },
};

export default scheduleSettingsController;
