import { PrismaClient } from "@prisma/client";
import mError from "../middlewares/mError.js";

const prisma = new PrismaClient();

const cService = {
  // Crear servicio
  create: async (req, res) => {
    try {
      let { name, price, durationMinutes, category, description } = req.body;

      name = name?.toString().trim();
      price = Number(price);
      durationMinutes = Number(durationMinutes);

      if (!name || name.length < 3) {
        return mError.e400(res, "El nombre es obligatorio y debe tener al menos 3 caracteres");
      }
      if (!Number.isFinite(price) || price < 0) {
        return mError.e400(res, "El precio debe ser un número válido mayor o igual a 0");
      }
      if (!Number.isInteger(durationMinutes) || durationMinutes < 5) {
        return mError.e400(res, "La duración debe ser un entero (min 5 minutos)");
      }

      // Validar duplicados (activos)
      const exists = await prisma.service.findFirst({
        where: { name, isActive: true }
      });
      if (exists) return mError.e400(res, "Ya existe un servicio con ese nombre");

      const newService = await prisma.service.create({
        data: {
          name,
          price,
          durationMinutes,
          category: category || null,
          description: description || null
        }
      });

      res.status(201).json({ message: "Servicio creado", service: newService });
    } catch (error) {
      mError.e500(res, "Error al crear el servicio", error);
    }
  },

  // Obtener todos los servicios (por defecto activos)
  getAll: async (req, res) => {
    try {
      // opcional: permitir query ?all=true para traer inactivos también
      const includeInactive = req.query.all === "true";

      const services = await prisma.service.findMany({
        where: includeInactive ? {} : { isActive: true },
        orderBy: { name: "asc" }
      });

      res.status(200).json({ services });
    } catch (error) {
      mError.e500(res, "Error al obtener los servicios", error);
    }
  },

  // Obtener servicio por ID
  getOne: async (req, res) => {
    try {
      const { id } = req.params;

      const service = await prisma.service.findUnique({
        where: { id: parseInt(id) }
      });

      if (!service) return mError.e404(res, "Servicio no encontrado");

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

      const existing = await prisma.service.findUnique({
        where: { id: parseInt(id) }
      });
      if (!existing) return mError.e404(res, "Servicio no encontrado");

      if (name) {
        name = name.toString().trim();
        if (name.length < 3) return mError.e400(res, "El nombre debe tener al menos 3 caracteres");
        // Validar duplicado si cambia nombre
        if (name !== existing.name) {
          const duplicate = await prisma.service.findFirst({
            where: { name, isActive: true }
          });
          if (duplicate) return mError.e400(res, "Ya existe otro servicio con ese nombre");
        }
      }

      if (price !== undefined) {
        price = Number(price);
        if (!Number.isFinite(price) || price < 0) {
          return mError.e400(res, "El precio debe ser un número válido >= 0");
        }
      }

      if (durationMinutes !== undefined) {
        durationMinutes = Number(durationMinutes);
        if (!Number.isInteger(durationMinutes) || durationMinutes < 5) {
          return mError.e400(res, "La duración debe ser un entero (min 5 minutos)");
        }
      }

      const updated = await prisma.service.update({
        where: { id: parseInt(id) },
        data: {
          name: name || undefined,
          price: price !== undefined ? price : undefined,
          durationMinutes: durationMinutes !== undefined ? durationMinutes : undefined,
          category: category || undefined,
          description: description || undefined,
          isActive: isActive !== undefined ? Boolean(isActive) : undefined
        }
      });

      res.status(200).json({ message: "Servicio actualizado", service: updated });
    } catch (error) {
      mError.e500(res, "Error al actualizar el servicio", error);
    }
  },

  // Eliminar (soft delete) con verificación de turnos futuros
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const existing = await prisma.service.findUnique({
        where: { id: parseInt(id) }
      });
      if (!existing) return mError.e404(res, "Servicio no encontrado");

      // Verificar si existen turnos futuros que usen este servicio
      const now = new Date();
      const futureConflict = await prisma.appointment.findFirst({
        where: {
          serviceId: existing.id,
          date: { gte: now }
        }
      });

      if (futureConflict) {
        return mError.e400(res, "No se puede desactivar el servicio porque tiene turnos programados en el futuro");
      }

      const updated = await prisma.service.update({
        where: { id: parseInt(id) },
        data: { isActive: false }
      });

      res.status(200).json({ message: "Servicio desactivado", service: updated });
    } catch (error) {
      mError.e500(res, "Error al eliminar el servicio", error);
    }
  }
};

export default cService;
