const error = {
  e400: (res, message = "Solicitud incorrecta") => {
    return res.status(400).json({ status: 400, message })
  },

  e401: (res, message = "No autorizado") => {
    return res.status(401).json({ status: 401, message })
  },

  e403: (res, message = "Prohibido") => {
    return res.status(403).json({ status: 403, message })
  },

  e404: (res, message = "Recurso no encontrado") => {
    return res.status(404).json({ status: 404, message })
  },

  e500: (res, message = "Error interno del servidor", err = null) => {
    if (err) console.error(err)
    return res.status(500).json({ status: 500, message })
  },
}

export default error
