import sAuth from "./auth.service.js";
import mError from "../../middlewares/error.middleware.js";

const cAuth = {
  register: async (req, res) => {
    try {
      const user = await sAuth.register(req.body, req.user);

      res.status(201).json({
        message: "Usuario creado correctamente por el administrador",
        user,
      });
    } catch (error) {
      if (error.status === 400) return mError.e400(res, error.message);
      if (error.status === 403) return mError.e403(res, error.message);

      mError.e500(res, "Error en el registro de usuario", error);
    }
  },

  login: async (req, res) => {
    try {
      const result = await sAuth.login(req.body);

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      if (error.status === 400) return mError.e400(res, error.message);
      if (error.status === 401) return mError.e401(res, error.message);
      if (error.status === 403) return mError.e403(res, error.message);
      if (error.status === 404) return mError.e404(res, error.message);

      mError.e500(res, "Error en el inicio de sesión", error);
    }
  },
};

export default cAuth;
