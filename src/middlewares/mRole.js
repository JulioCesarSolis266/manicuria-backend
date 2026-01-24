import mError from "./mError.js"

// Middleware que verifica el rol del usuario
const mRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (!req.user || req.user.role !== requiredRole) {// Verifica si el usuario tiene el rol adecuado para acceder a la ruta protegida.
        return mError.e403(res, "No tienes permisos para realizar esta acción")
      }
      next()
    } catch (error) {
      mError.e500(res, "Error al verificar rol", error)// Si ocurre un error durante la verificación del rol, se maneja el error utilizando el middleware de manejo de errores mError. Esto es para que el servidor no se caiga y se informe adecuadamente del problema al cliente.
    }
  }
}

export default mRole
//Lo que hace este archivo es definir un middleware llamado mRole que verifica si el usuario autenticado tiene el rol requerido para acceder a una ruta o recurso específico. Si el usuario no tiene el rol adecuado, se devuelve un error 403 (Prohibido). Si todo está bien, se llama a next() para continuar con la siguiente función en la cadena de middleware.