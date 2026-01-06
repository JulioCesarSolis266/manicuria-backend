import { PrismaClient } from "@prisma/client"
import mError from "../middlewares/mError.js"

const prisma = new PrismaClient()

const cAppointmentFilter = {
  filter: async (req, res) => {
    try {
      const { status, startDate, endDate } = req.query

      const filters = {}

      if (status) filters.status = status

      if (startDate || endDate) {
        filters.date = {}
        if (startDate) filters.date.gte = new Date(startDate)
        if (endDate) filters.date.lte = new Date(endDate)
      }

      const appointments = await prisma.appointment.findMany({
        where: filters,
        include: {
          client: true,
          createdBy: { select: { id: true, username: true } }
        }
      })

      if (appointments.length === 0) {
        return res.status(200).json({
          appointments: [],
          message: "No hay citas que coincidan con los filtros"
        })
      }

      res.status(200).json({ appointments })

    } catch (error) {
      mError.e500(res, "Error al filtrar citas", error)
    }
  }
}

export default cAppointmentFilter
