import { PrismaClient } from "@prisma/client"
import mError from "../middlewares/mError.js"

const prisma = new PrismaClient()

const cAppointmentFilter = {
  filter: async (req, res) => {
    try {
      const { status, employeeId, startDate, endDate } = req.query

      const filters = {}

      if (status) filters.status = status
      if (employeeId) filters.employeeId = parseInt(employeeId)

      if (startDate || endDate) {
        filters.date = {}
        if (startDate) filters.date.gte = new Date(startDate)
        if (endDate) filters.date.lte = new Date(endDate)
      }

      const appointments = await prisma.appointment.findMany({
        where: filters,
        include: {
          client: true,
          service: true,
          createdBy: { select: { id: true, username: true } },
          employee: { select: { id: true, name: true } }
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
