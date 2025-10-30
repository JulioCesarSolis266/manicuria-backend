import { PrismaClient } from "@prisma/client";
import mError from "../middlewares/mError.js";


const prisma = new PrismaClient();

const cAppointment = {

  // Crear una nueva cita
  create: async (req, res) => {
    try {
      const { service, date, clientId, attendedById } = req.body;

      if (!service || !date || !clientId) {
        return mError.e400(res, "service, date y clientId son obligatorios");
      }

      const createdById = req.user.id;

      const newAppointment = await prisma.appointment.create({
        data: {
          service,
          date: new Date(date),
          clientId,
          createdById,
          attendedById: attendedById || null,
        },
        include: {
          client: true,
          createdBy: { select: { id: true, username: true } },
          attendedBy: { select: { id: true, username: true } },
        },
      });

      res.status(201).json({ message: "Appointment created", appointment: newAppointment });
    } catch (error) {
      mError.e500(res, "Error creating appointment", error);
    }
  },

  // Obtener todas las citas
  getAll: async (req, res) => {
    try {
      const appointments = await prisma.appointment.findMany({
        include: {
          client: true,
          createdBy: { select: { id: true, username: true } },
          attendedBy: { select: { id: true, username: true } },
        },
      });
      res.status(200).json(appointments);
    } catch (error) {
      mError.e500(res, "Error fetching appointments", error);
    }
  },

  // Obtener una cita por ID
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const appointment = await prisma.appointment.findUnique({
        where: { id: parseInt(id) },
        include: {
          client: true,
          createdBy: { select: { id: true, username: true } },
          attendedBy: { select: { id: true, username: true } },
        },
      });

      if (!appointment) return mError.e404(res, "Appointment not found");

      res.status(200).json(appointment);
    } catch (error) {
      mError.e500(res, "Error fetching appointment", error);
    }
  },

  // Actualizar una cita
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { service, date, clientId, attendedById, status } = req.body;

      const updatedAppointment = await prisma.appointment.update({
        where: { id: parseInt(id) },
        data: {
          service,
          date: date ? new Date(date) : undefined,
          clientId,
          attendedById,
          status,
        },
        include: {
          client: true,
          createdBy: { select: { id: true, username: true } },
          attendedBy: { select: { id: true, username: true } },
        },
      });

      res.status(200).json({ message: "Appointment updated", appointment: updatedAppointment });
    } catch (error) {
      mError.e500(res, "Error updating appointment", error);
    }
  },

  // Eliminar una cita
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.appointment.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: "Appointment deleted" });
    } catch (error) {
      mError.e500(res, "Error deleting appointment", error);
    }
  },
};

export default cAppointment;
