import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import mError from "../middlewares/mError.js"

const prisma = new PrismaClient()

const cUser = {
  // 🔹 Listar usuarios
  getAll: async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          surname: true,
          username: true,
          phone: true,
          role: true,
          createdAt: true,
          isActive: true,
        },
        orderBy: { createdAt: "desc" },
      })

      res.status(200).json({ users })
    } catch (error) {
      mError.e500(res, "Error al obtener usuarios", error)
    }
  },

  // 🔹 Crear usuario (admin)
  create: async (req, res) => {
    try {
      const { username, phone, password, name, surname } = req.body

      if (!username || !phone || !password) {
        return mError.e400(res, "Usuario, teléfono y contraseña son obligatorios")
      }

      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ username }, { phone }] },
      })

      if (existingUser) {
        if (!existingUser.isActive) {
          return mError.e400(
            res,
            "El usuario existe pero está desactivado. Reactívalo."
          )
        }
        return mError.e400(res, "Usuario o teléfono ya registrados")
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          phone,
          name: name || "Sin nombre",
          surname: surname || "Sin apellido",
          role: "user",
          forcePasswordReset: true,
        },
        select: {
          id: true,
          username: true,
          name: true,
          surname: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
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
      const { username, phone, password, name, surname } = req.body

      const user = await prisma.user.findUnique({ where: { id: Number(id) } })
      if (!user) return mError.e404(res, "Usuario no encontrado")

      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          username: username ?? user.username,
          phone: phone ?? user.phone,
          name: name ?? user.name,
          surname: surname ?? user.surname,
          password: password
            ? await bcrypt.hash(password, 10)
            : user.password,
        },
        select: {
          id: true,
          username: true,
          name: true,
          surname: true,
          phone: true,
          role: true,
          isActive: true,
        },
      })

      res.status(200).json({ message: "Usuario actualizado", user: updatedUser })
    } catch (error) {
      mError.e500(res, "Error al actualizar usuario", error)
    }
  },

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

  reactivate: async (req, res) => {
    try {
      const { id } = req.params

      const user = await prisma.user.findUnique({ where: { id: Number(id) } })
      if (!user) return mError.e404(res, "Usuario no encontrado")

      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: { isActive: true },
        select: { id: true, username: true, isActive: true },
      })

      res.status(200).json({ message: "Usuario reactivado", user: updatedUser })
    } catch (error) {
      mError.e500(res, "Error al reactivar usuario", error)
    }
  },
}

export default cUser
