const error = {
  e400: (res, message = "Solicitud incorrecta") => {
    res.status(400).json({ status: 400, error: message })
  },

  e401: (res, message = "No autorizado") => {
    res.status(401).json({ status: 401, error: message })
  },

  e403: (res, message = "Prohibido") => {
    res.status(403).json({ status: 403, error: message })
  },

  e404: (res, message = "Recurso no encontrado") => {
    res.status(404).json({ status: 404, error: message })
  },

  e500: (res, message = "Error interno del servidor", error = null) => {
    console.error(error)
    res.status(500).json({ status: 500, error: message })
  },
}

export default error