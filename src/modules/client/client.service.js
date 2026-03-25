import { clientRepository } from "./client.repository.js";

const clientService = {
  create: async (data, userId) => {
    const { name, surname, phone, notes } = data;

    if (!name || !phone) {
      const error = new Error("Los campos nombre y teléfono son obligatorios");
      error.status = 400;
      throw error;
    }

    return await clientRepository.create({
      name,
      surname,
      phone,
      notes: notes || null,
      userId,
    });
  },

  getAll: async (userId) => {
    return await clientRepository.findAllByUser(userId);
  },

  getOne: async (id, userId) => {
    const client = await clientRepository.findByIdAndUser(
      Number(id),
      userId,
      true,
    );

    if (!client) {
      const error = new Error("Cliente no encontrado");
      error.status = 404;
      throw error;
    }

    return client;
  },

  update: async (id, data, userId) => {
    const client = await clientRepository.findByIdAndUser(Number(id), userId);

    if (!client) {
      const error = new Error("Cliente no encontrado o no autorizado");
      error.status = 404;
      throw error;
    }

    const { name, surname, phone, notes } = data;

    return await clientRepository.update(Number(id), {
      name: name ?? client.name,
      surname: surname ?? client.surname,
      phone: phone ?? client.phone,
      notes: notes ?? client.notes,
    });
  },

  delete: async (id, userId) => {
    const client = await clientRepository.findByIdAndUser(
      Number(id),
      userId,
      true,
    );

    if (!client) {
      const error = new Error("Cliente no encontrado o no autorizado");
      error.status = 404;
      throw error;
    }

    if (client.appointments.length > 0) {
      const error = new Error(
        "No se puede eliminar este cliente porque tiene turnos pendientes",
      );
      error.status = 400;
      throw error;
    }

    await clientRepository.delete(Number(id));

    return true;
  },
};

export default clientService;
