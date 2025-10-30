import { PrismaClient } from "@prisma/client"
import mError from "../middlewares/mError.js"

const prisma = new PrismaClient()

const cDashboard = {
  getStats: async (req, res) => {
    try {
      const totalClients = await prisma.client.count()
      const allAppointments = await prisma.appointment.count()
      const completedAppointments = await prisma.appointment.count({
        where: { status: "completed" },
      })
      const pendingAppointments = await prisma.appointment.count({
        where: { status: "pending" },
      })

      res.status(200).json({
        message: "Estadísticas del dashboard",
        totalClients,
        allAppointments,
        completedAppointments,
        pendingAppointments,
      })
    } catch (error) {
      mError.e500(res, "Error al obtener estadísticas del dashboard", error)
    }
  },
}

export default cDashboard
