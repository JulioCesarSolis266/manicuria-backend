import { PrismaClient } from "@prisma/client"
import mError from "../middlewares/mError.js"

const prisma = new PrismaClient()

const cClient = {

  // 🔹 Crear un nuevo cliente (asociado a la manicura logueada)
  create: async (req, res) => {
    try {
      const { name, surname, phone, notes } = req.body
      const userId = req.user.id

      if (!name || !phone) {
        return mError.e400(res, "Los campos nombre y teléfono son obligatorios")
      }

      const newClient = await prisma.client.create({
        data: {
          name,
          surname: surname,
          phone,
          notes: notes || null,
          userId
        }
      })

      res.status(201).json({ message: "Cliente creado", client: newClient })

    } catch (error) {
      mError.e500(res, "Error al crear el cliente", error)
    }
  },

  // 🔹 Obtener todos los clientes de la manicura logueada
  getAll: async (req, res) => {
    try {
      const userId = req.user.id

      const clients = await prisma.client.findMany({
        where: { userId },
        include: { appointments: true },
        orderBy: { createdAt: "desc" }
      })

      if (clients.length === 0) {
        return res.status(200).json({
          clients: [],
          message: "No hay clientes registrados"
        })
      }

      res.status(200).json({ clients })

    } catch (error) {
      mError.e500(res, "Error al obtener los clientes", error)
    }
  },

  // 🔹 Obtener un cliente por ID (validando pertenencia)
  getOne: async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user.id

      const client = await prisma.client.findFirst({
        where: {
          id: parseInt(id),
          userId
        },
        include: { appointments: true }
      })

      if (!client) {
        return mError.e404(res, "Cliente no encontrado")
      }

      res.status(200).json(client)

    } catch (error) {
      mError.e500(res, "Error al obtener el cliente", error)
    }
  },

  // 🔹 Actualizar un cliente (solo si pertenece a la manicura)
  update: async (req, res) => {
    try {
      const { id } = req.params
      const { name, surname, phone, notes } = req.body
      const userId = req.user.id

      const client = await prisma.client.findFirst({
        where: {
          id: parseInt(id),
          userId
        }
      })

      if (!client) {
        return mError.e404(res, "Cliente no encontrado o no autorizado")
      }

      const updatedClient = await prisma.client.update({
        where: { id: parseInt(id) },
        data: {
          name: name ?? client.name,
          surname: surname ?? client.surname,
          phone: phone ?? client.phone,
          notes: notes ?? client.notes
        }
      })

      res.status(200).json({
        message: "Cliente actualizado",
        client: updatedClient
      })

    } catch (error) {
      mError.e500(res, "Error al actualizar el cliente", error)
    }
  },

  // 🔹 Eliminar un cliente (solo si pertenece a la manicura)
  // 🔹 Eliminar un cliente (solo si pertenece a la manicura)
delete: async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const client = await prisma.client.findFirst({
      where: {
        id: parseInt(id),
        userId
      },
      include: { appointments: true } // traer citas
    })

    if (!client) {
      return mError.e404(res, "Cliente no encontrado o no autorizado")
    }

    if (client.appointments.length > 0) {
      return res.status(400).json({
        message: "No se puede eliminar este cliente porque tiene turnos pendientes"
      })
    }

    await prisma.client.delete({
      where: { id: parseInt(id) }
    })

    res.status(200).json({ message: "Cliente eliminado" })

  } catch (error) {
    mError.e500(res, "Error al eliminar el cliente", error)
  }
}

}

export default cClient
