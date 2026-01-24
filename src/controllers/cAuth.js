import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import mError from "../middlewares/mError.js"

const prisma = new PrismaClient()

const cAuth = {
  // 🧾 Registro de usuarios (solo admin)
  register: async (req, res) => {
    try {
      const { name, surname, username, password, role, phone } = req.body

      // 🔐 Usuario logueado
      const loggedUser = await prisma.user.findUnique({
        where: { id: req.user.id },
      })

      if (!loggedUser || loggedUser.role !== "admin") {
        return mError.e403(res, "Solo el administrador puede crear cuentas")
      }

      // ❗ Validaciones obligatorias
      if (!name || !surname || !username || !password || !phone) {
        return mError.e400(
          res,
          "Nombre, apellido, usuario, teléfono y contraseña son obligatorios"
        )
      }

      // 🧼 Normalización
      const nameClean = name.trim()
      const surnameClean = surname.trim()
      const usernameClean = username.trim()
      const phoneClean = phone.trim()

      if (
        !nameClean ||
        !surnameClean ||
        !usernameClean ||
        !phoneClean
      ) {
        return mError.e400(res, "Los campos no pueden estar vacíos")
      }

      // 🔎 Usuario existente
      const existingUser = await prisma.user.findUnique({
        where: { username: usernameClean },
      })

      const hashedPassword = await bcrypt.hash(password, 10)

      // 🔁 Reactivar usuario desactivado
      if (existingUser && existingUser.isActive === false) {
        const phoneInUse = await prisma.user.findFirst({
          where: {
            phone: phoneClean,
            NOT: { id: existingUser.id },
          },
        })

        if (phoneInUse) {
          return mError.e400(res, "Ese teléfono ya está registrado")
        }

        const reactivatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            password: hashedPassword,
            phone: phoneClean,
            role: role || "user",
            isActive: true,
            forcePasswordReset: true,
          },
          select: {
            id: true,
            name: true,
            surname: true,
            username: true,
            phone: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        })

        return res.status(200).json({
          message: "Usuario reactivado correctamente",
          user: reactivatedUser,
        })
      }

      // ❌ Usuario activo ya existente
      if (existingUser) {
        return mError.e400(res, "El usuario ya existe")
      }

      // 🔎 Teléfono único
      const existingPhone = await prisma.user.findFirst({
        where: { phone: phoneClean },
      })

      if (existingPhone) {
        return mError.e400(res, "Ese teléfono ya está registrado")
      }

      // ✅ Crear usuario
      const newUser = await prisma.user.create({
        data: {
          name: nameClean,
          surname: surnameClean,
          username: usernameClean,
          password: hashedPassword,
          role: role || "user",
          phone: phoneClean,
          isActive: true,
          forcePasswordReset: true,
        },
        select: {
          id: true,
          name: true,
          surname: true,
          username: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      })

      res.status(201).json({
        message: "Usuario creado correctamente por el administrador",
        user: newUser,
      })
    } catch (error) {
      mError.e500(res, "Error en el registro de usuario", error)
    }
  },

  // 🔐 Login (NO SE TOCA)
  login: async (req, res) => {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return mError.e400(res, "Usuario y contraseña son obligatorios")
      }

      const user = await prisma.user.findUnique({
        where: { username },
      })

      if (!user) return mError.e404(res, "Usuario no encontrado")

      if (user.isActive === false) {
        return mError.e403(res, "El usuario está desactivado")
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return mError.e401(res, "Contraseña incorrecta")

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      )

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          forcePasswordReset: user.forcePasswordReset,
        },
      })
    } catch (error) {
      mError.e500(res, "Error en el inicio de sesión", error)
    }
  },
}

export default cAuth
