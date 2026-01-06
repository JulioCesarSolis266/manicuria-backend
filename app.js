import express from "express"
import cors from "cors"
import dotenv from "dotenv"

// Rutas
import rAuth from "./src/routes/rAuth.js"
import rAppointment from "./src/routes/rAppointment.js"
import rUser from "./src/routes/rUser.js"
import rClient from "./src/routes/rClient.js"
import rAppointmentFilter from "./src/routes/rAppointmentFilter.js"
import rDashboard from "./src/routes/rDashboard.js"

// Middleware de errores
import mError from "./src/middlewares/mError.js"

dotenv.config()// Esto sirve para cargar las variables de entorno desde el archivo .env, por ejemplo process.env.PORT o process.env.JWT_SECRET

const app = express()

// Middleware global
app.use(cors())
app.use(express.json())

// Rutas públicas y protegidas
app.use("/api/auth", rAuth)
app.use("/api/appointments", rAppointment)
app.use("/api/users", rUser)
app.use("/api/clients", rClient);
app.use("/api/appointments/filter", rAppointmentFilter)
app.use("/api/dashboard", rDashboard)

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  mError.e404(res, `Ruta ${req.originalUrl} no encontrada`)
})

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error("Error inesperado:", err.stack)
  mError.e500(res, "Error inesperado del servidor", err)
})

// Levantar servidor
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))
