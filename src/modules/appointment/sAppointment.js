import { appointmentRepository } from "./appointment.repository";

const throwError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

const sAppointment = {
  create: async (data, user) => {
    const { serviceId, date, clientId, description } = data;
    const userId = user.id;

    if (!serviceId || !clientId || !date) {
      throwError("Los campos serviceId, clientId y date son obligatorios", 400);
    }

    const serviceIdNumber = parseInt(serviceId);
    const clientIdNumber = parseInt(clientId);

    if (isNaN(serviceIdNumber) || isNaN(clientIdNumber)) {
      throwError("serviceId y clientId deben ser numéricos", 400);
    }

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      throwError("La fecha es inválida", 400);
    }

    if (dateObj < new Date()) {
      throwError("No se pueden crear turnos en el pasado", 400);
    }

    const clientExists = await appointmentRepository.clientExists(
      clientIdNumber,
      userId,
    );

    if (!clientExists) {
      throwError("El cliente no existe o no pertenece al usuario", 400);
    }

    const serviceExists = await appointmentRepository.serviceExists(
      serviceIdNumber,
      userId,
    );

    if (!serviceExists) {
      throwError("El servicio no existe o no pertenece al usuario", 400);
    }

    const existingAppointment = await appointmentRepository.findByDateAndUser(
      dateObj,
      userId,
    );

    if (existingAppointment) {
      throwError("Ya existe un turno en esa fecha y hora", 400);
    }

    return appointmentRepository.create({
      serviceId: serviceIdNumber,
      clientId: clientIdNumber,
      date: dateObj,
      description: description || null,
      userId,
    });
  },

  getAll: async (user) => {
    let where = {};

    if (user.role !== "admin") {
      where.userId = user.id;
    }

    return appointmentRepository.findAll(where);
  },

  getOne: async (id, user) => {
    const appointmentId = parseInt(id);

    const appointment = await appointmentRepository.findById(appointmentId);

    if (!appointment) {
      throwError("No se encontró la cita", 404);
    }

    if (user.role !== "admin" && appointment.userId !== user.id) {
      throwError("No tenés permiso para ver esta cita", 403);
    }

    return appointment;
  },

  update: async (id, data, user) => {
    const appointmentId = parseInt(id);
    const { serviceId, date, clientId, status, description } = data;

    const existingAppointment =
      await appointmentRepository.findById(appointmentId);

    if (!existingAppointment) {
      throwError("No se encontró la cita", 404);
    }

    if (user.role !== "admin" && existingAppointment.userId !== user.id) {
      throwError("No tenés permiso para modificar esta cita", 403);
    }

    const now = new Date();
    const isPast = existingAppointment.date < now;

    const newDate = date ? new Date(date) : existingAppointment.date;

    if (date && isNaN(newDate.getTime())) {
      throwError("La fecha es inválida", 400);
    }

    if (date && newDate < now) {
      throwError("No se puede mover el turno al pasado", 400);
    }

    if (isPast) {
      if (clientId && parseInt(clientId) !== existingAppointment.clientId) {
        throwError(
          "No se puede cambiar el cliente de un turno pasado. Creá uno nuevo.",
          400,
        );
      }

      if (status === "pending") {
        throwError("Un turno pasado no puede volver a estado pendiente", 400);
      }
    }

    if (date) {
      const conflict = await appointmentRepository.findByDateAndUser(
        newDate,
        existingAppointment.userId,
        appointmentId,
      );

      if (conflict) {
        throwError("Ya existe otro turno en esa fecha y hora", 400);
      }
    }

    return appointmentRepository.update(appointmentId, {
      serviceId: serviceId ? parseInt(serviceId) : undefined,
      clientId: isPast ? undefined : clientId ? parseInt(clientId) : undefined,
      date: date ? newDate : undefined,
      status: status ?? undefined,
      description: description ?? undefined,
    });
  },

  delete: async (id, user) => {
    const appointmentId = parseInt(id);

    const appointment = await appointmentRepository.findById(appointmentId);

    if (!appointment) {
      throwError("No se encontró la cita", 404);
    }

    if (user.role !== "admin" && appointment.userId !== user.id) {
      throwError("No tenés permiso para eliminar esta cita", 403);
    }

    await appointmentRepository.delete(appointmentId);

    return true;
  },
};

export default sAppointment;
