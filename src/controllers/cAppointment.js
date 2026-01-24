import { PrismaClient } from "@prisma/client"
import mError from "../middlewares/mError.js"

const prisma = new PrismaClient()

const cAppointment = {

  // =========================
  // Crear una nueva cita
  // =========================
  create: async (req, res) => {
    try {
      const { serviceId, date, clientId, description } = req.body
      const userId = req.user.id

      // -------------------------
      // Validaciones básicas
      // -------------------------
      if (!serviceId || !clientId || !date) {
        return mError.e400(
          res,
          "Los campos serviceId, clientId y date son obligatorios"
        )
      }

      const serviceIdNumber = parseInt(serviceId)
      const clientIdNumber = parseInt(clientId)

      if (isNaN(serviceIdNumber) || isNaN(clientIdNumber)) {
        return mError.e400(res, "serviceId y clientId deben ser numéricos")
      }

      // -------------------------
      // Validación de fecha
      // -------------------------
      const dateObj = new Date(date)

      if (isNaN(dateObj.getTime())) {
        return mError.e400(res, "La fecha es inválida")
      }

      if (dateObj < new Date()) {
        return mError.e400(res, "No se pueden crear turnos en el pasado")
      }

      // -------------------------
      // Validar cliente
      // -------------------------
      const clientExists = await prisma.client.findFirst({
        where: {
          id: clientIdNumber,
          userId
        }
      })

      if (!clientExists) {
        return mError.e400(
          res,
          "El cliente no existe o no pertenece al usuario"
        )
      }

      // -------------------------
      // Validar servicio
      // -------------------------
      const serviceExists = await prisma.service.findFirst({
        where: {
          id: serviceIdNumber,
          userId
        }
      })

      if (!serviceExists) {
        return mError.e400(
          res,
          "El servicio no existe o no pertenece al usuario"
        )
      }

      // -------------------------
      // Validar conflicto de horarios
      // -------------------------
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          date: dateObj,
          userId
        }
      })

      if (existingAppointment) {
        return mError.e400(
          res,
          "Ya existe un turno en esa fecha y hora"
        )
      }

      // -------------------------
      // Crear turno
      // -------------------------
      const newAppointment = await prisma.appointment.create({
        data: {
          serviceId: serviceIdNumber,
          clientId: clientIdNumber,
          date: dateObj,
          description: description || null,
          userId
        },
        include: {
          client: true,
          service: true
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

  // =========================
  // Obtener todas las citas
  // =========================
  getAll: async (req, res) => {
    try {
      let where = {}

      if (req.user.role !== "admin") {
        where.userId = req.user.id
      }

      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          client: true,
          service: true
        },
        orderBy: { date: "desc" }
      })

      res.status(200).json({ appointments })

    } catch (error) {
      mError.e500(res, "Error al obtener las citas", error)
    }
  },

  // =========================
  // Obtener cita por ID
  // =========================
  getOne: async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id)

      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          client: true,
          service: true
        }
      })

      if (!appointment) {
        return mError.e404(res, "No se encontró la cita")
      }

      if (
        req.user.role !== "admin" &&
        appointment.userId !== req.user.id
      ) {
        return mError.e403(
          res,
          "No tenés permiso para ver esta cita"
        )
      }

      res.status(200).json(appointment)

    } catch (error) {
      mError.e500(res, "Error al obtener la cita", error)
    }
  },

  // =========================
  // Actualizar cita
  // =========================
  update: async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id)
      const { serviceId, date, clientId, status, description } = req.body

      const existingAppointment = await prisma.appointment.findUnique({
        where: { id: appointmentId }
      })

      if (!existingAppointment) {
        return mError.e404(res, "No se encontró la cita")
      }

      if (
        req.user.role !== "admin" &&
        existingAppointment.userId !== req.user.id
      ) {
        return mError.e403(
          res,
          "No tenés permiso para modificar esta cita"
        )
      }

      const newDate = date ? new Date(date) : existingAppointment.date

      // Validar fecha si se envía
      if (date && isNaN(newDate.getTime())) {
        return mError.e400(res, "La fecha es inválida")
      }

      if (date && newDate < new Date()) {
        return mError.e400(res, "No se puede mover el turno al pasado")
      }

      // Validar conflicto si cambia la fecha
      if (date) {
        const conflict = await prisma.appointment.findFirst({
          where: {
            id: { not: appointmentId },
            date: newDate,
            userId: existingAppointment.userId
          }
        })

        if (conflict) {
          return mError.e400(
            res,
            "Ya existe otro turno en esa fecha y hora"
          )
        }
      }

      const updatedAppointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          serviceId: serviceId ? parseInt(serviceId) : undefined,
          clientId: clientId ? parseInt(clientId) : undefined,
          date: date ? newDate : undefined,
          status: status ?? undefined,
          description: description ?? undefined
        },
        include: {
          client: true,
          service: true
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

  // =========================
  // Eliminar cita
  // =========================
  delete: async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id)

      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId }
      })

      if (!appointment) {
        return mError.e404(res, "No se encontró la cita")
      }

      if (
        req.user.role !== "admin" &&
        appointment.userId !== req.user.id
      ) {
        return mError.e403(
          res,
          "No tenés permiso para eliminar esta cita"
        )
      }

      await prisma.appointment.delete({
        where: { id: appointmentId }
      })

      res.status(200).json({ message: "Cita eliminada correctamente" })

    } catch (error) {
      mError.e500(res, "Error al eliminar la cita", error)
    }
  }
}

export default cAppointment
