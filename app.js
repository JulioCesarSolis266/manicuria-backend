import express from "express";
import cors from "cors"; // CORS es un middleware que permite controlar qué dominios pueden acceder a tu API. En desarrollo, puedes usar cors() sin argumentos para permitir todas las solicitudes, pero en producción es recomendable configurar los orígenes permitidos para mayor seguridad.
import dotenv from "dotenv"; //Esto sirve para cargar las variables de entorno desde el archivo .env, por ejemplo process.env.PORT o process.env.JWT_SECRET

// Rutas
import rAuth from "./src/modules/auth/rAuth.js";
import rAppointment from "./src/modules/appointment/rAppointment.js";
import rUser from "./src/modules/user/rUser.js";
import rClient from "./src/modules/client/rClient.js";
import rAppointmentFilters from "./src/modules/appointmentFilters/rAppointmentFilters.js";
import rDashboard from "./src/modules/dashboard/rDashboard.js";
import rService from "./src/modules/service/rService.js";

// Middleware de errores
import mError from "./src/middlewares/mError.js";

dotenv.config(); // Esto sirve para cargar las variables de entorno desde el archivo .env, por ejemplo process.env.PORT o process.env.JWT_SECRET

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas públicas y protegidas
app.use("/api/auth", rAuth);
app.use("/api/appointments", rAppointment);
app.use("/api/users", rUser);
app.use("/api/clients", rClient);
app.use("/api/appointments/filters", rAppointmentFilters);
app.use("/api/dashboard", rDashboard);
app.use("/api/services", rService);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  mError.e404(res, `Ruta ${req.originalUrl} no encontrada`);
});

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error("Error inesperado:", err.stack);
  mError.e500(res, "Error inesperado del servidor", err);
});

// Levantar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en: http://localhost:${PORT}`),
);
