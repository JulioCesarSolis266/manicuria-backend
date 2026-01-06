import mError from "./mError.js"

// Middleware que verifica el rol del usuario
const mRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (!req.user || req.user.role !== requiredRole) {
        return mError.e403(res, "No tienes permisos para realizar esta acción")
      }
      next()
    } catch (error) {
      mError.e500(res, "Error al verificar rol", error)
    }
  }
}

export default mRole
