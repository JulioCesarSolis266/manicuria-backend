import { PrismaClient } from "@prisma/client";
import mError from "../middlewares/mError.js";

const prisma = new PrismaClient();

const cEmployee = {
  // Crear empleado
  create: async (req, res) => {
    try {
      let { name, phone, userId } = req.body;

      name = name?.toString().trim();

      if (!name || name.length < 3) {
        return mError.e400(res, "El nombre es obligatorio y debe tener al menos 3 caracteres");
      }

      // Validar duplicados por nombre (solo activos)
      const exists = await prisma.employee.findFirst({
        where: { name, isActive: true }
      });
      if (exists) {
        return mError.e400(res, "Ya existe un empleado activo con ese nombre");
      }

      const newEmployee = await prisma.employee.create({
        data: {
          name,
          phone: phone || null,
          userId: userId ? parseInt(userId) : null
        }
      });

      res.status(201).json({ message: "Empleado creado", employee: newEmployee });
    } catch (error) {
      mError.e500(res, "Error al crear el empleado", error);
    }
  },

  // Obtener todos los empleados (solo activos por defecto)
  getAll: async (req, res) => {
    try {
      const includeInactive = req.query.all === "true";

      const employees = await prisma.employee.findMany({
        where: includeInactive ? {} : { isActive: true },
        orderBy: { name: "asc" }
      });

      res.status(200).json({ employees });
    } catch (error) {
      mError.e500(res, "Error al obtener los empleados", error);
    }
  },

  // Obtener un empleado por ID
  getOne: async (req, res) => {
    try {
      const { id } = req.params;

      const employee = await prisma.employee.findUnique({
        where: { id: parseInt(id) }
      });

      if (!employee) return mError.e404(res, "Empleado no encontrado");

      res.status(200).json(employee);
    } catch (error) {
      mError.e500(res, "Error al obtener el empleado", error);
    }
  },

  // Actualizar empleado
  update: async (req, res) => {
    try {
      const { id } = req.params;
      let { name, phone, userId, isActive } = req.body;

      const existing = await prisma.employee.findUnique({
        where: { id: parseInt(id) }
      });
      if (!existing) return mError.e404(res, "Empleado no encontrado");

      if (name) {
        name = name.toString().trim();
        if (name.length < 3) return mError.e400(res, "El nombre debe tener al menos 3 caracteres");

        // Validar duplicado si cambia el nombre
        if (name !== existing.name) {
          const duplicate = await prisma.employee.findFirst({
            where: { name, isActive: true }
          });
          if (duplicate) {
            return mError.e400(res, "Ya existe otro empleado activo con ese nombre");
          }
        }
      }

      const updated = await prisma.employee.update({
        where: { id: parseInt(id) },
        data: {
          name: name || undefined,
          phone: phone !== undefined ? phone : undefined,
          userId: userId !== undefined ? parseInt(userId) : undefined,
          isActive: isActive !== undefined ? Boolean(isActive) : undefined
        }
      });

      res.status(200).json({ message: "Empleado actualizado", employee: updated });
    } catch (error) {
      mError.e500(res, "Error al actualizar el empleado", error);
    }
  },

  // Eliminar (soft delete) con verificación de turnos futuros
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const existing = await prisma.employee.findUnique({
        where: { id: parseInt(id) }
      });
      if (!existing) return mError.e404(res, "Empleado no encontrado");

      // Verificar si existen turnos futuros que usan este empleado
      const now = new Date();
      const futureConflict = await prisma.appointment.findFirst({
        where: {
          employeeId: existing.id,
          date: { gte: now }
        }
      });

      if (futureConflict) {
        return mError.e400(res, "No se puede desactivar el empleado porque tiene turnos futuros asignados");
      }

      const updated = await prisma.employee.update({
        where: { id: parseInt(id) },
        data: { isActive: false }
      });

      res.status(200).json({ message: "Empleado desactivado", employee: updated });
    } catch (error) {
      mError.e500(res, "Error al eliminar el empleado", error);
    }
  }
};

export default cEmployee;
