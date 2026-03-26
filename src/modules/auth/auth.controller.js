import authService from "./auth.service.js";
import errorMiddleware from "../../middlewares/error.middleware.js";
import { registerSchema, loginSchema } from "./auth.schema.js";

const authController = {
  register: async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await authService.register(validatedData, req.user);

      res.status(201).json({
        message: "Usuario creado correctamente por el administrador",
        user,
      });
    } catch (error) {
      if (error.status === 400) return errorMiddleware.e400(res, error.message);
      if (error.status === 403) return errorMiddleware.e403(res, error.message);

      errorMiddleware.e500(res, "Error en el registro de usuario", error);
    }
  },

  login: async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      if (error.status === 400) return errorMiddleware.e400(res, error.message);
      if (error.status === 401) return errorMiddleware.e401(res, error.message);
      if (error.status === 403) return errorMiddleware.e403(res, error.message);
      if (error.status === 404) return errorMiddleware.e404(res, error.message);

      errorMiddleware.e500(res, "Error en el inicio de sesión", error);
    }
  },
};

export default authController;
