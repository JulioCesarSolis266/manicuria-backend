import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import mError from "../middlewares/mError.js"

const prisma = new PrismaClient()

const cUser = {
  // 🔹 Listar todos los usuarios activos
  getAll: async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        where: { isActive: true },
        select: { id: true, username: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      })

      res.status(200).json({ users })
    } catch (error) {
      mError.e500(res, "Error al obtener usuarios", error)
    }
  },

  // 🔹 Crear usuario (registro manual por admin)
  create: async (req, res) => {
    try {
      const { username, password } = req.body
      if (!username || !password) return mError.e400(res, "Usuario y contraseña son obligatorios")

      const existingUser = await prisma.user.findUnique({ where: { username } })
      if (existingUser) return mError.e400(res, "El usuario ya existe")

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
        data: { username, password: hashedPassword },
        select: { id: true, username: true, createdAt: true },
      })

      res.status(201).json({ message: "Usuario creado", user: newUser })
    } catch (error) {
      mError.e500(res, "Error al crear usuario", error)
    }
  },

  // 🔹 Actualizar usuario
  update: async (req, res) => {
    try {
      const { id } = req.params
      const { username, password } = req.body

      const user = await prisma.user.findUnique({ where: { id: Number(id) } })
      if (!user) return mError.e404(res, "Usuario no encontrado")

      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          username: username ?? user.username,
          password: password ? await bcrypt.hash(password, 10) : user.password,
        },
        select: { id: true, username: true, createdAt: true },
      })

      res.status(200).json({ message: "Usuario actualizado", user: updatedUser })
    } catch (error) {
      mError.e500(res, "Error al actualizar usuario", error)
    }
  },

  // 🔹 Borrado lógico (desactivar usuario)
  deactivate: async (req, res) => {
    try {
      const { id } = req.params

      const user = await prisma.user.findUnique({ where: { id: Number(id) } })
      if (!user) return mError.e404(res, "Usuario no encontrado")

      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: { isActive: false },
        select: { id: true, username: true, isActive: true },
      })

      res.status(200).json({ message: "Usuario desactivado", user: updatedUser })
    } catch (error) {
      mError.e500(res, "Error al desactivar usuario", error)
    }
  },
}

export default cUser
