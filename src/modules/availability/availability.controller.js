import availabilityService from "./availability.service.js";

const availabilityController = {
  get: async (req, res, next) => {
    try {
      const data = await availabilityService.getByUser(req.user.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  set: async (req, res, next) => {
    try {
      await availabilityService.setAvailability(req.user.id, req.body);
      res.json({ message: "Disponibilidad actualizada" });
    } catch (error) {
      next(error);
    }
  },
};

export default availabilityController;
