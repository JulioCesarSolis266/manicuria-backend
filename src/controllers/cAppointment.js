import { PrismaClient } from "@prisma/client"
import mError from "../middlewares/mError.js"

const prisma = new PrismaClient()

const cAppointment = {

  // Crear una nueva cita
  create: async (req, res) => {
    try {
      const { serviceId, date, clientId, employeeId, description } = req.body

      const clientIdNumber = parseInt(clientId)
      const employeeIdNumber = employeeId ? parseInt(employeeId) : null

      if (!serviceId || !date || !clientIdNumber) {
        return mError.e400(res, "Los campos serviceId, date y clientId son obligatorios")
      }

      const userId = req.user.id   // 👈 Dueña del turno (manicura)
      const dateObj = new Date(date)

      // Validar conflicto de horarios (misma empleada en misma fecha/hora)
      const existing = await prisma.appointment.findFirst({
        where: {
          date: dateObj,
          employeeId: employeeIdNumber,
          userId: userId   // 👈 Solo dentro de la misma manicura
        }
      })

      if (existing) {
        return mError.e400(res, "Ya existe un turno en esa fecha y hora con la misma manicura.")
      }

      // Crear turno
      const newAppointment = await prisma.appointment.create({
        data: {
          serviceId: parseInt(serviceId),
          date: dateObj,
          clientId: clientIdNumber,
          userId,
          employeeId: employeeIdNumber,
          description: description || null
        },
        include: {
          client: true,
          service: true,
          employee: { select: { id: true, name: true } }
        }
      })

      res.status(201).json({
        message: "Cita creada correctamente",
        appointment: newAppointment
      })

    } catch (error) {
      mError.e500(res, "Error al crear la cita", error)
    }
  },


  // Obtener todas las citas
  getAll: async (req, res) => {
    try {
      let where = {}

      // Si no es admin, solo ver sus propias citas
      if (req.user.role !== "admin") {
        where.userId = req.user.id
      }

      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          client: true,
          service: true,
          employee: { select: { id: true, name: true } }
        },
        orderBy: { date: "desc" }
      })

      if (appointments.length === 0) {
        return res.status(200).json({
          appointments: [],
          message: "No hay citas registradas"
        })
      }

      res.status(200).json({ appointments })

    } catch (error) {
      mError.e500(res, "Error al obtener las citas", error)
    }
  },


  // Obtener cita por ID
  getOne: async (req, res) => {
    try {
      const { id } = req.params
      const appointmentId = parseInt(id)

      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          client: true,
          service: true,
          employee: { select: { id: true, name: true } }
        }
      })

      if (!appointment) {
        return mError.e404(res, "No se encontró la cita")
      }

      // Seguridad: si no es admin, verificar que sea de su propiedad
      if (req.user.role !== "admin" && appointment.userId !== req.user.id) {
        return mError.e403(res, "No tenés permiso para ver esta cita")
      }

      res.status(200).json(appointment)

    } catch (error) {
      mError.e500(res, "Error al obtener la cita", error)
    }
  },


  // Actualizar cita
  update: async (req, res) => {
    try {
      const { id } = req.params
      const { serviceId, date, clientId, employeeId, status, description } = req.body

      const appointmentId = parseInt(id)

      const existingAppointment = await prisma.appointment.findUnique({
        where: { id: appointmentId }
      })

      if (!existingAppointment) {
        return mError.e404(res, "No se encontró la cita")
      }

      // Seguridad: si no es admin, solo puede modificar sus citas
      if (req.user.role !== "admin" && existingAppointment.userId !== req.user.id) {
        return mError.e403(res, "No tenés permiso para modificar esta cita")
      }

      const employeeIdNumber = employeeId ? parseInt(employeeId) : null
      const newDate = date ? new Date(date) : existingAppointment.date

      // Validación de conflicto (misma empleada, mismo horario, misma manicura)
      const conflict = await prisma.appointment.findFirst({
        where: {
          id: { not: appointmentId },
          date: newDate,
          employeeId: employeeIdNumber ?? existingAppointment.employeeId,
          userId: existingAppointment.userId
        }
      })

      if (conflict) {
        return mError.e400(res, "Ya existe otra cita en esa fecha y hora para esa manicura.")
      }

      const updatedAppointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          serviceId: serviceId ? parseInt(serviceId) : undefined,
          date: date ? newDate : undefined,
          clientId: clientId ? parseInt(clientId) : undefined,
          employeeId: employeeIdNumber ?? existingAppointment.employeeId,
          status: status ?? existingAppointment.status,
          description: description ?? existingAppointment.description
        },
        include: {
          client: true,
          service: true,
          employee: { select: { id: true, name: true } }
        }
      })

      res.status(200).json({
        message: "Cita actualizada correctamente",
        appointment: updatedAppointment
      })

    } catch (error) {
      mError.e500(res, "Error al actualizar la cita", error)
    }
  },


  // Eliminar cita
  delete: async (req, res) => {
    try {
      const { id } = req.params
      const appointmentId = parseInt(id)

      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId }
      })

      if (!appointment) {
        return mError.e404(res, "No se encontró la cita")
      }

      // Seguridad: si no es admin, solo puede borrar sus citas
      if (req.user.role !== "admin" && appointment.userId !== req.user.id) {
        return mError.e403(res, "No tenés permiso para eliminar esta cita")
      }

      await prisma.appointment.delete({
        where: { id: appointmentId }
      })

      res.status(200).json({ message: "Cita eliminada" })

    } catch (error) {
      mError.e500(res, "Error al eliminar la cita", error)
    }
  }
}

export default cAppointment
