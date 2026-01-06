import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import mError from "../middlewares/mError.js"

const prisma = new PrismaClient()

const cAuth = {
  // 🧾 Registro de usuarias (solo admin)
  register: async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // ✅ Verificar que haya un usuario autenticado (req.user viene del middleware mAuth)
    const loggedUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!loggedUser || loggedUser.role !== "admin") {
      return mError.e403(res, "Solo el administrador puede crear cuentas");
    }

    if (!username || !password) {
      return mError.e400(res, "Usuario y contraseña son obligatorios");
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return mError.e400(res, "El usuario ya existe");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: role || "user", // el admin puede definir rol, por defecto "user"
      },
      select: { id: true, username: true, role: true, createdAt: true },
    });

    res.status(201).json({
      message: "Usuario creado correctamente por el administrador",
      user: newUser,
    });
  } catch (error) {
    mError.e500(res, "Error en el registro de usuario", error);
  }
},


  // 🔐 Login
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
        },
      })
    } catch (error) {
      mError.e500(res, "Error en el inicio de sesión", error)
    }
  },
}

export default cAuth
