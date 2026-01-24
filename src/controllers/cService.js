import { PrismaClient } from "@prisma/client";
import mError from "../middlewares/mError.js";

const prisma = new PrismaClient();

const cService = {

  // Crear servicio (pertenece a la manicura logueada)
  create: async (req, res) => {
    try {
      let { name, price, durationMinutes, category, description } = req.body;

      // Normalización
      name = name?.toString().trim();

      if (!name || name.length < 3) {
        return mError.e400(res, "El nombre es obligatorio y debe tener al menos 3 caracteres");
      }

      if (price === undefined || price === "") {
        return mError.e400(res, "El precio es obligatorio");
      }
      price = Number(price);
      if (!Number.isFinite(price) || price < 0) {
        return mError.e400(res, "El precio debe ser un número válido mayor o igual a 0");
      }

      if (durationMinutes === undefined || durationMinutes === "") {
        return mError.e400(res, "La duración es obligatoria");
      }
      durationMinutes = Number(durationMinutes);
      if (!Number.isInteger(durationMinutes) || durationMinutes < 5) {
        return mError.e400(res, "La duración debe ser un entero (min 5 minutos)");
      }

      if (category !== undefined && typeof category !== "string") {
        return mError.e400(res, "La categoría debe ser texto");
      }

      if (description !== undefined && typeof description !== "string") {
        return mError.e400(res, "La descripción debe ser texto");
      }

      const userId = req.user.id;

      // Validar duplicados SOLO dentro de la misma manicura
      const exists = await prisma.service.findFirst({
        where: { name, isActive: true, userId }
      });

      if (exists) return mError.e400(res, "Ya existe un servicio con ese nombre");

      const newService = await prisma.service.create({
        data: {
          name,
          price,
          durationMinutes,
          category: category || null,
          description: description || null,
          userId
        }
      });

      res.status(201).json({ message: "Servicio creado", service: newService });

    } catch (error) {
      mError.e500(res, "Error al crear el servicio", error);
    }
  },

  // Obtener servicios (solo de la manicura)
  getAll: async (req, res) => {
    try {
      const includeInactive = req.query.all === "true";
      const userId = req.user.id;

      const services = await prisma.service.findMany({
        where: {
          userId,
          ...(includeInactive ? {} : { isActive: true })
        },
        orderBy: { name: "asc" }
      });

      res.status(200).json({ services });

    } catch (error) {
      mError.e500(res, "Error al obtener los servicios", error);
    }
  },

  // Obtener un servicio por ID
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const serviceId = Number(id);

      if (!Number.isInteger(serviceId)) {
        return mError.e400(res, "ID inválido");
      }

      const service = await prisma.service.findUnique({
        where: { id: serviceId }
      });

      if (!service) return mError.e404(res, "Servicio no encontrado");

      // Seguridad: solo su dueña o admin
      if (req.user.role !== "admin" && service.userId !== req.user.id) {
        return mError.e403(res, "No tenés permiso para ver este servicio");
      }

      res.status(200).json(service);

    } catch (error) {
      mError.e500(res, "Error al obtener el servicio", error);
    }
  },

  // Actualizar servicio
  update: async (req, res) => {
    try {
      const { id } = req.params;
      let { name, price, durationMinutes, category, description, isActive } = req.body;

      const serviceId = Number(id);
      if (!Number.isInteger(serviceId)) {
        return mError.e400(res, "ID inválido");
      }

      const existing = await prisma.service.findUnique({
        where: { id: serviceId }
      });

      if (!existing) return mError.e404(res, "Servicio no encontrado");

      // Seguridad
      if (req.user.role !== "admin" && existing.userId !== req.user.id) {
        return mError.e403(res, "No tenés permiso para modificar este servicio");
      }

      const userId = req.user.id;

      // Validación de nombre
      if (name !== undefined) {
        name = name.toString().trim();
        if (name.length < 3) {
          return mError.e400(res, "El nombre debe tener al menos 3 caracteres");
        }

        if (name !== existing.name) {
          const duplicate = await prisma.service.findFirst({
            where: {
              name,
              isActive: true,
              userId,
              NOT: { id: existing.id }
            }
          });
          if (duplicate) return mError.e400(res, "Ya existe otro servicio con ese nombre");
        }
      }

      // Validación de precio
      if (price !== undefined) {
        if (price === "") return mError.e400(res, "El precio no puede estar vacío");
        price = Number(price);
        if (!Number.isFinite(price) || price < 0) {
          return mError.e400(res, "El precio debe ser un número válido >= 0");
        }
      }

      // Validación de duración
      if (durationMinutes !== undefined) {
        if (durationMinutes === "") return mError.e400(res, "La duración no puede estar vacía");
        durationMinutes = Number(durationMinutes);
        if (!Number.isInteger(durationMinutes) || durationMinutes < 5) {
          return mError.e400(res, "La duración debe ser un entero (min 5 minutos)");
        }
      }

      // Validación de categoría y descripción
      if (category !== undefined && typeof category !== "string") {
        return mError.e400(res, "La categoría debe ser texto");
      }

      if (description !== undefined && typeof description !== "string") {
        return mError.e400(res, "La descripción debe ser texto");
      }

      // Validación segura de isActive
      let parsedIsActive;
      if (isActive !== undefined) {
        if (typeof isActive === "boolean") {
          parsedIsActive = isActive;
        } else if (isActive === "true" || isActive === "false") {
          parsedIsActive = isActive === "true";
        } else {
          return mError.e400(res, "isActive debe ser booleano");
        }
      }

      const updated = await prisma.service.update({
        where: { id: serviceId },
        data: {
          name: name !== undefined ? name : undefined,
          price: price !== undefined ? price : undefined,
          durationMinutes: durationMinutes !== undefined ? durationMinutes : undefined,
          category: category !== undefined ? category : undefined,
          description: description !== undefined ? description : undefined,
          isActive: parsedIsActive !== undefined ? parsedIsActive : undefined
        }
      });

      res.status(200).json({ message: "Servicio actualizado", service: updated });

    } catch (error) {
      mError.e500(res, "Error al actualizar el servicio", error);
    }
  },

  // Eliminar (soft delete)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const serviceId = Number(id);

      if (!Number.isInteger(serviceId)) {
        return mError.e400(res, "ID inválido");
      }

      const existing = await prisma.service.findUnique({
        where: { id: serviceId }
      });

      if (!existing) return mError.e404(res, "Servicio no encontrado");

      // Seguridad
      if (req.user.role !== "admin" && existing.userId !== req.user.id) {
        return mError.e403(res, "No tenés permiso para eliminar este servicio");
      }

      // Verificar turnos futuros
      const now = new Date();
      const futureConflict = await prisma.appointment.findFirst({
        where: {
          serviceId: existing.id,
          date: { gte: now }
        }
      });

      if (futureConflict) {
        return mError.e400(res, "No se puede desactivar el servicio porque tiene turnos futuros");
      }

      const updated = await prisma.service.update({
        where: { id: serviceId },
        data: { isActive: false }
      });

      res.status(200).json({ message: "Servicio desactivado", service: updated });

    } catch (error) {
      mError.e500(res, "Error al eliminar el servicio", error);
    }
  }
};

export default cService;
