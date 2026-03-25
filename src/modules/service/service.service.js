import { serviceRepository } from "./service.repository.js";

const sService = {
  create: async (data, user) => {
    const { name, price, durationMinutes, category, description } = data;
    const userId = user.id;

    const exists = await serviceRepository.findByName(name, userId);

    if (exists) {
      const error = new Error("Ya existe un servicio con ese nombre");
      error.status = 400;
      throw error;
    }

    return await serviceRepository.create({
      name,
      price,
      durationMinutes,
      category: category || null,
      description: description || null,
      userId,
    });
  },

  getAll: async (user, includeInactive) => {
    return await serviceRepository.findAllByUser(user.id, includeInactive);
  },

  getOne: async (id, user) => {
    const service = await serviceRepository.findById(id);

    if (!service) {
      const error = new Error("Servicio no encontrado");
      error.status = 404;
      throw error;
    }

    if (user.role !== "admin" && service.userId !== user.id) {
      const error = new Error("No autorizado");
      error.status = 403;
      throw error;
    }

    return service;
  },

  update: async (id, data, user) => {
    const existing = await serviceRepository.findById(id);

    if (!existing) {
      const error = new Error("Servicio no encontrado");
      error.status = 404;
      throw error;
    }

    if (user.role !== "admin" && existing.userId !== user.id) {
      const error = new Error("No autorizado");
      error.status = 403;
      throw error;
    }

    if (data.name && data.name !== existing.name) {
      const duplicate = await serviceRepository.findByName(
        data.name,
        user.id,
        existing.id,
      );

      if (duplicate) {
        const error = new Error("Ya existe otro servicio con ese nombre");
        error.status = 400;
        throw error;
      }
    }

    return await serviceRepository.update(id, data);
  },

  delete: async (id, user) => {
    const existing = await serviceRepository.findById(id);

    if (!existing) {
      const error = new Error("Servicio no encontrado");
      error.status = 404;
      throw error;
    }

    if (user.role !== "admin" && existing.userId !== user.id) {
      const error = new Error("No autorizado");
      error.status = 403;
      throw error;
    }

    const now = new Date();

    const futureConflict =
      await serviceRepository.findFutureAppointmentConflict(existing.id, now);

    if (futureConflict) {
      const error = new Error("No se puede desactivar: tiene turnos futuros");
      error.status = 400;
      throw error;
    }

    return await serviceRepository.update(id, {
      isActive: false,
    });
  },
};

export default sService;
