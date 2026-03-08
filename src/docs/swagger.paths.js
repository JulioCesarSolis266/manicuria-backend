export const paths = {
  // AUTH
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login de usuario",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Login",
            },
          },
        },
      },
      responses: {
        200: { description: "Login exitoso" },
        401: { description: "Credenciales inválidas" },
      },
    },
  },

  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Registrar nuevo usuario (solo admin)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/User",
            },
          },
        },
      },
      responses: {
        201: { description: "Usuario creado" },
      },
    },
  },

  // CLIENTS
  "/clients": {
    get: {
      tags: ["Clients"],
      summary: "Obtener todos los clientes",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Lista de clientes",
        },
      },
    },

    post: {
      tags: ["Clients"],
      summary: "Crear cliente",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Client",
            },
          },
        },
      },
      responses: {
        201: { description: "Cliente creado" },
      },
    },
  },

  "/clients/{id}": {
    get: {
      tags: ["Clients"],
      summary: "Obtener cliente por ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: { description: "Cliente encontrado" },
        404: { description: "Cliente no encontrado" },
      },
    },

    put: {
      tags: ["Clients"],
      summary: "Actualizar cliente",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: { description: "Cliente actualizado" },
      },
    },

    delete: {
      tags: ["Clients"],
      summary: "Eliminar cliente",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: { description: "Cliente eliminado" },
      },
    },
  },

  // APPOINTMENTS
  "/appointments": {
    get: {
      tags: ["Appointments"],
      summary: "Obtener todos los turnos",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Lista de turnos" },
      },
    },

    post: {
      tags: ["Appointments"],
      summary: "Crear turno",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Appointment",
            },
          },
        },
      },
      responses: {
        201: { description: "Turno creado" },
      },
    },
  },

  "/appointments/{id}": {
    get: {
      tags: ["Appointments"],
      summary: "Obtener turno por ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: { description: "Turno encontrado" },
      },
    },

    put: {
      tags: ["Appointments"],
      summary: "Actualizar turno",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: { description: "Turno actualizado" },
      },
    },

    delete: {
      tags: ["Appointments"],
      summary: "Eliminar turno",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: { description: "Turno eliminado" },
      },
    },
  },

  // SERVICES
  "/services": {
    get: {
      tags: ["Services"],
      summary: "Obtener todos los servicios",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Lista de servicios" },
      },
    },

    post: {
      tags: ["Services"],
      summary: "Crear servicio",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Service",
            },
          },
        },
      },
      responses: {
        201: { description: "Servicio creado" },
      },
    },
  },

  // DASHBOARD
  "/dashboard": {
    get: {
      tags: ["Dashboard"],
      summary: "Estadísticas del sistema",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Estadísticas obtenidas" },
      },
    },
  },
};
