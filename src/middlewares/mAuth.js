import jwt from "jsonwebtoken"
import mError from "./mError.js"

const mAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization // Obtenemos el header Authorization

    // Verificamos si el header existe
    if (!authHeader || !authHeader.startsWith("Bearer ")) { //bearer es el tipo de token que se usa comunmente. Su nombre significa portador.
      return mError.e401(res, "Token no proporcionado o inválido")
    }

    // Obtenemos el token (quitamos la palabra "Bearer " porque viene en el header)
    const token = authHeader.split(" ")[1]

    // Verificamos el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Guardamos la info del usuario en la request
    req.user = decoded

    // Pasamos al siguiente middleware o controlador
    next() // Todo bien, seguimos adelante
  } catch (error) {
    console.error("Error en mAuth:", error.message)
    return mError.e401(res, "Token inválido o expirado")
  }
}

export default mAuth
