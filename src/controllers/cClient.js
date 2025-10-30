import { PrismaClient } from "@prisma/client"
import mError from "../middlewares/mError.js"

const prisma = new PrismaClient()

const cClient = {
  // Crear un nuevo cliente
  create: async (req, res) => {
    try {
      const { name, phone, notes } = req.body

      if (!name || !phone) {
        return mError.e400(res, "Los campos name y phone son obligatorios")
      }

      const newClient = await prisma.client.create({
        data: {
          name,
          phone,
          notes: notes || null
        }
      })

      res.status(201).json({ message: "Cliente creado", client: newClient })
    } catch (error) {
      mError.e500(res, "Error al crear el cliente", error)
    }
  },

  // Obtener todos los clientes
  getAll: async (req, res) => {
    try {
      const clients = await prisma.client.findMany({
        include: { appointments: true }
      })

      if (clients.length === 0) {
        return res.status(200).json({ clients: [], message: "No hay clientes registrados" })
      }

      res.status(200).json({ clients })
    } catch (error) {
      mError.e500(res, "Error al obtener los clientes", error)
    }
  },

  // Obtener un cliente por ID
  getOne: async (req, res) => {
    try {
      const { id } = req.params
      const client = await prisma.client.findUnique({
        where: { id: parseInt(id) },
        include: { appointments: true }
      })

      if (!client) return mError.e404(res, "Cliente no encontrado")

      res.status(200).json(client)
    } catch (error) {
      mError.e500(res, "Error al obtener el cliente", error)
    }
  },

  // Actualizar un cliente
  update: async (req, res) => {
    try {
      const { id } = req.params
      const { name, phone, notes } = req.body

      const updatedClient = await prisma.client.update({
        where: { id: parseInt(id) },
        data: { name, phone, notes }
      })

      res.status(200).json({ message: "Cliente actualizado", client: updatedClient })
    } catch (error) {
      mError.e500(res, "Error al actualizar el cliente", error)
    }
  },

  // Eliminar un cliente
  delete: async (req, res) => {
    try {
      const { id } = req.params

      await prisma.client.delete({ where: { id: parseInt(id) } })

      res.status(200).json({ message: "Cliente eliminado" })
    } catch (error) {
      mError.e500(res, "Error al eliminar el cliente", error)
    }
  }
}

export default cClient
