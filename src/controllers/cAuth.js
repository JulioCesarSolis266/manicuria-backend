import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import mError from "../middlewares/mError.js"

const prisma = new PrismaClient()

const cAuth = {
  // 🧾 Registro de usuarias (socias)
  register: async (req, res) => {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return mError.e400(res, "Usuario y contraseña son obligatorios")
      }

      const existingUser = await prisma.user.findUnique({ where: { username } })
      if (existingUser) return mError.e400(res, "El usuario ya existe")

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
        data: { username, password: hashedPassword },
        select: { id: true, username: true, createdAt: true },
      })

      res.status(201).json({
        message: "Usuario registrado correctamente",
        user: newUser,
      })
    } catch (error) {
      mError.e500(res, "Error en el registro de usuario", error)
    }
  },

  // 🔐 Login de usuarias
  login: async (req, res) => {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return mError.e400(res, "Usuario y contraseña son obligatorios")
      }

      const user = await prisma.user.findUnique({ where: { username } })
      if (!user) return mError.e404(res, "Usuario no encontrado")

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return mError.e401(res, "Contraseña incorrecta")

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      })

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        token,
        user: { id: user.id, username: user.username },
      })
    } catch (error) {
      mError.e500(res, "Error en el inicio de sesión", error)
    }
  },
}

export default cAuth
