import { PrismaClient } from "@prisma/client"
import mError from "../middlewares/mError.js"

const prisma = new PrismaClient()

const cAppointment = {

  // Crear una nueva cita (MVP)
  create: async (req, res) => {
    try {
      const { date, clientId } = req.body

      const clientIdNumber = parseInt(clientId)

      if (!date || !clientIdNumber) {
        return mError.e400(res, "Los campos date y clientId son obligatorios")
      }

      const createdById = req.user.id
      const dateObj = new Date(date)

      // Crear turno sin servicio ni empleada
      const newAppointment = await prisma.appointment.create({
        data: {
          date: dateObj,
          clientId: clientIdNumber,
          createdById
        },
        include: {
          client: true,
          createdBy: { select: { id: true, username: true } }
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
      const appointments = await prisma.appointment.findMany({
        include: {
          client: true,
          createdBy: { select: { id: true, username: true } }
        }
      })

      res.status(200).json({ appointments })

    } catch (error) {
      mError.e500(res, "Error al obtener las citas", error)
    }
  },

  // Obtener cita por ID
  getOne: async (req, res) => {
    try {
      const { id } = req.params

      const appointment = await prisma.appointment.findUnique({
        where: { id: parseInt(id) },
        include: {
          client: true,
          createdBy: { select: { id: true, username: true } }
        }
      })

      if (!appointment) {
        return mError.e404(res, "No se encontró la cita")
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
      const { date, clientId, status } = req.body

      const appointmentId = parseInt(id)

      const existingAppointment = await prisma.appointment.findUnique({
        where: { id: appointmentId }
      })

      if (!existingAppointment) {
        return mError.e404(res, "No se encontró la cita")
      }

      const newDate = date ? new Date(date) : existingAppointment.date

      const updatedAppointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          date: date ? newDate : undefined,
          clientId: clientId ? parseInt(clientId) : undefined,
          status: status ?? existingAppointment.status
        },
        include: {
          client: true,
          createdBy: { select: { id: true, username: true } }
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

      await prisma.appointment.delete({
        where: { id: parseInt(id) }
      })

      res.status(200).json({ message: "Cita eliminada" })

    } catch (error) {
      mError.e500(res, "Error al eliminar la cita", error)
    }
  }
}

export default cAppointment
