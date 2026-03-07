import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sAppointment = {
  create: async (data, user) => {
    const { serviceId, date, clientId, description } = data;
    const userId = user.id;

    if (!serviceId || !clientId || !date) {
      const error = new Error(
        "Los campos serviceId, clientId y date son obligatorios",
      );
      error.status = 400;
      throw error;
    }

    const serviceIdNumber = parseInt(serviceId);
    const clientIdNumber = parseInt(clientId);

    if (isNaN(serviceIdNumber) || isNaN(clientIdNumber)) {
      const error = new Error("serviceId y clientId deben ser numéricos");
      error.status = 400;
      throw error;
    }

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      const error = new Error("La fecha es inválida");
      error.status = 400;
      throw error;
    }

    if (dateObj < new Date()) {
      const error = new Error("No se pueden crear turnos en el pasado");
      error.status = 400;
      throw error;
    }

    const clientExists = await prisma.client.findFirst({
      where: {
        id: clientIdNumber,
        userId,
      },
    });

    if (!clientExists) {
      const error = new Error("El cliente no existe o no pertenece al usuario");
      error.status = 400;
      throw error;
    }

    const serviceExists = await prisma.service.findFirst({
      where: {
        id: serviceIdNumber,
        userId,
      },
    });

    if (!serviceExists) {
      const error = new Error(
        "El servicio no existe o no pertenece al usuario",
      );
      error.status = 400;
      throw error;
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: dateObj,
        userId,
      },
    });

    if (existingAppointment) {
      const error = new Error("Ya existe un turno en esa fecha y hora");
      error.status = 400;
      throw error;
    }

    return await prisma.appointment.create({
      data: {
        serviceId: serviceIdNumber,
        clientId: clientIdNumber,
        date: dateObj,
        description: description || null,
        userId,
      },
      include: {
        client: true,
        service: true,
      },
    });
  },

  getAll: async (user) => {
    let where = {};

    if (user.role !== "admin") {
      where.userId = user.id;
    }

    return await prisma.appointment.findMany({
      where,
      include: {
        client: true,
        service: true,
      },
      orderBy: { date: "desc" },
    });
  },

  getOne: async (id, user) => {
    const appointmentId = parseInt(id);

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        service: true,
      },
    });

    if (!appointment) {
      const error = new Error("No se encontró la cita");
      error.status = 404;
      throw error;
    }

    if (user.role !== "admin" && appointment.userId !== user.id) {
      const error = new Error("No tenés permiso para ver esta cita");
      error.status = 403;
      throw error;
    }

    return appointment;
  },

  update: async (id, data, user) => {
    const appointmentId = parseInt(id);
    const { serviceId, date, clientId, status, description } = data;

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existingAppointment) {
      const error = new Error("No se encontró la cita");
      error.status = 404;
      throw error;
    }

    if (user.role !== "admin" && existingAppointment.userId !== user.id) {
      const error = new Error("No tenés permiso para modificar esta cita");
      error.status = 403;
      throw error;
    }

    const now = new Date();
    const isPast = existingAppointment.date < now;

    const newDate = date ? new Date(date) : existingAppointment.date;

    if (date && isNaN(newDate.getTime())) {
      const error = new Error("La fecha es inválida");
      error.status = 400;
      throw error;
    }

    if (date && newDate < now) {
      const error = new Error("No se puede mover el turno al pasado");
      error.status = 400;
      throw error;
    }

    if (isPast) {
      if (clientId && parseInt(clientId) !== existingAppointment.clientId) {
        const error = new Error(
          "No se puede cambiar el cliente de un turno pasado. Creá uno nuevo.",
        );
        error.status = 400;
        throw error;
      }

      if (status === "pending") {
        const error = new Error(
          "Un turno pasado no puede volver a estado pendiente",
        );
        error.status = 400;
        throw error;
      }
    }

    if (date) {
      const conflict = await prisma.appointment.findFirst({
        where: {
          id: { not: appointmentId },
          date: newDate,
          userId: existingAppointment.userId,
        },
      });

      if (conflict) {
        const error = new Error("Ya existe otro turno en esa fecha y hora");
        error.status = 400;
        throw error;
      }
    }

    return await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        serviceId: serviceId ? parseInt(serviceId) : undefined,
        clientId: isPast
          ? undefined
          : clientId
            ? parseInt(clientId)
            : undefined,
        date: date ? newDate : undefined,
        status: status ?? undefined,
        description: description ?? undefined,
      },
      include: {
        client: true,
        service: true,
      },
    });
  },

  delete: async (id, user) => {
    const appointmentId = parseInt(id);

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      const error = new Error("No se encontró la cita");
      error.status = 404;
      throw error;
    }

    if (user.role !== "admin" && appointment.userId !== user.id) {
      const error = new Error("No tenés permiso para eliminar esta cita");
      error.status = 403;
      throw error;
    }

    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return true;
  },
};

export default sAppointment;
