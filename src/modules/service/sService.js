import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sService = {
  create: async (data, user) => {
    let { name, price, durationMinutes, category, description } = data;
    const userId = user.id;

    name = name?.toString().trim();

    if (!name || name.length < 3) {
      const error = new Error(
        "El nombre es obligatorio y debe tener al menos 3 caracteres",
      );
      error.status = 400;
      throw error;
    }

    if (price === undefined || price === "") {
      const error = new Error("El precio es obligatorio");
      error.status = 400;
      throw error;
    }

    price = Number(price);
    if (!Number.isFinite(price) || price < 0) {
      const error = new Error(
        "El precio debe ser un número válido mayor o igual a 0",
      );
      error.status = 400;
      throw error;
    }

    if (durationMinutes === undefined || durationMinutes === "") {
      const error = new Error("La duración es obligatoria");
      error.status = 400;
      throw error;
    }

    durationMinutes = Number(durationMinutes);
    if (!Number.isInteger(durationMinutes) || durationMinutes < 5) {
      const error = new Error("La duración debe ser un entero (min 5 minutos)");
      error.status = 400;
      throw error;
    }

    if (category !== undefined && typeof category !== "string") {
      const error = new Error("La categoría debe ser texto");
      error.status = 400;
      throw error;
    }

    if (description !== undefined && typeof description !== "string") {
      const error = new Error("La descripción debe ser texto");
      error.status = 400;
      throw error;
    }

    const exists = await prisma.service.findFirst({
      where: { name, isActive: true, userId },
    });

    if (exists) {
      const error = new Error("Ya existe un servicio con ese nombre");
      error.status = 400;
      throw error;
    }

    return await prisma.service.create({
      data: {
        name,
        price,
        durationMinutes,
        category: category || null,
        description: description || null,
        userId,
      },
    });
  },

  getAll: async (user, includeInactive) => {
    const userId = user.id;

    return await prisma.service.findMany({
      where: {
        userId,
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { name: "asc" },
    });
  },

  getOne: async (id, user) => {
    const serviceId = Number(id);

    if (!Number.isInteger(serviceId)) {
      const error = new Error("ID inválido");
      error.status = 400;
      throw error;
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      const error = new Error("Servicio no encontrado");
      error.status = 404;
      throw error;
    }

    if (user.role !== "admin" && service.userId !== user.id) {
      const error = new Error("No tenés permiso para ver este servicio");
      error.status = 403;
      throw error;
    }

    return service;
  },

  update: async (id, data, user) => {
    let { name, price, durationMinutes, category, description, isActive } =
      data;
    const serviceId = Number(id);

    if (!Number.isInteger(serviceId)) {
      const error = new Error("ID inválido");
      error.status = 400;
      throw error;
    }

    const existing = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!existing) {
      const error = new Error("Servicio no encontrado");
      error.status = 404;
      throw error;
    }

    if (user.role !== "admin" && existing.userId !== user.id) {
      const error = new Error("No tenés permiso para modificar este servicio");
      error.status = 403;
      throw error;
    }

    const userId = user.id;

    if (name !== undefined) {
      name = name.toString().trim();

      if (name.length < 3) {
        const error = new Error("El nombre debe tener al menos 3 caracteres");
        error.status = 400;
        throw error;
      }

      if (name !== existing.name) {
        const duplicate = await prisma.service.findFirst({
          where: {
            name,
            isActive: true,
            userId,
            NOT: { id: existing.id },
          },
        });

        if (duplicate) {
          const error = new Error("Ya existe otro servicio con ese nombre");
          error.status = 400;
          throw error;
        }
      }
    }

    if (price !== undefined) {
      if (price === "") {
        const error = new Error("El precio no puede estar vacío");
        error.status = 400;
        throw error;
      }

      price = Number(price);

      if (!Number.isFinite(price) || price < 0) {
        const error = new Error("El precio debe ser un número válido >= 0");
        error.status = 400;
        throw error;
      }
    }

    if (durationMinutes !== undefined) {
      if (durationMinutes === "") {
        const error = new Error("La duración no puede estar vacía");
        error.status = 400;
        throw error;
      }

      durationMinutes = Number(durationMinutes);

      if (!Number.isInteger(durationMinutes) || durationMinutes < 5) {
        const error = new Error(
          "La duración debe ser un entero (min 5 minutos)",
        );
        error.status = 400;
        throw error;
      }
    }

    if (category !== undefined && typeof category !== "string") {
      const error = new Error("La categoría debe ser texto");
      error.status = 400;
      throw error;
    }

    if (description !== undefined && typeof description !== "string") {
      const error = new Error("La descripción debe ser texto");
      error.status = 400;
      throw error;
    }

    let parsedIsActive;

    if (isActive !== undefined) {
      if (typeof isActive === "boolean") {
        parsedIsActive = isActive;
      } else if (isActive === "true" || isActive === "false") {
        parsedIsActive = isActive === "true";
      } else {
        const error = new Error("isActive debe ser booleano");
        error.status = 400;
        throw error;
      }
    }

    return await prisma.service.update({
      where: { id: serviceId },
      data: {
        name: name !== undefined ? name : undefined,
        price: price !== undefined ? price : undefined,
        durationMinutes:
          durationMinutes !== undefined ? durationMinutes : undefined,
        category: category !== undefined ? category : undefined,
        description: description !== undefined ? description : undefined,
        isActive: parsedIsActive !== undefined ? parsedIsActive : undefined,
      },
    });
  },

  delete: async (id, user) => {
    const serviceId = Number(id);

    if (!Number.isInteger(serviceId)) {
      const error = new Error("ID inválido");
      error.status = 400;
      throw error;
    }

    const existing = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!existing) {
      const error = new Error("Servicio no encontrado");
      error.status = 404;
      throw error;
    }

    if (user.role !== "admin" && existing.userId !== user.id) {
      const error = new Error("No tenés permiso para eliminar este servicio");
      error.status = 403;
      throw error;
    }

    const now = new Date();

    const futureConflict = await prisma.appointment.findFirst({
      where: {
        serviceId: existing.id,
        date: { gte: now },
      },
    });

    if (futureConflict) {
      const error = new Error(
        "No se puede desactivar el servicio porque tiene turnos futuros",
      );
      error.status = 400;
      throw error;
    }

    return await prisma.service.update({
      where: { id: serviceId },
      data: { isActive: false },
    });
  },
};

export default sService;
