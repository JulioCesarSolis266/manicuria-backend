export const schemas = {
  Login: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: {
        type: "string",
        example: "admin",
      },
      password: {
        type: "string",
        example: "123456",
      },
    },
  },

  User: {
    type: "object",
    required: ["name", "surname", "username", "password", "phone"],
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      name: {
        type: "string",
        example: "Ana",
      },
      surname: {
        type: "string",
        example: "García",
      },
      username: {
        type: "string",
        example: "ana_admin",
      },
      password: {
        type: "string",
        example: "password123",
      },
      role: {
        type: "string",
        example: "admin",
      },
      phone: {
        type: "string",
        example: "3415551234",
      },
      isActive: {
        type: "boolean",
        example: true,
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  Employee: {
    type: "object",
    required: ["name", "surname"],
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      name: {
        type: "string",
        example: "Laura",
      },
      surname: {
        type: "string",
        example: "Martinez",
      },
      phone: {
        type: "string",
        example: "3415559999",
      },
      isActive: {
        type: "boolean",
        example: true,
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  Client: {
    type: "object",
    required: ["name", "surname", "phone"],
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      name: {
        type: "string",
        example: "Carla",
      },
      surname: {
        type: "string",
        example: "Fernandez",
      },
      phone: {
        type: "string",
        example: "3411234567",
      },
      notes: {
        type: "string",
        example: "Prefiere turnos por la tarde",
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  Service: {
    type: "object",
    required: ["name", "price", "durationMinutes"],
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      name: {
        type: "string",
        example: "Manicura semipermanente",
      },
      price: {
        type: "number",
        example: 4500,
      },
      durationMinutes: {
        type: "integer",
        example: 60,
      },
      category: {
        type: "string",
        example: "Manos",
      },
      description: {
        type: "string",
        example: "Esmaltado semipermanente con preparación de uñas",
      },
      isActive: {
        type: "boolean",
        example: true,
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  Appointment: {
    type: "object",
    required: ["date", "clientId", "serviceId"],
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      date: {
        type: "string",
        format: "date-time",
        example: "2026-03-10T14:00:00Z",
      },
      status: {
        type: "string",
        example: "pending",
      },
      description: {
        type: "string",
        example: "Cliente pidió diseño especial",
      },
      clientId: {
        type: "integer",
        example: 3,
      },
      serviceId: {
        type: "integer",
        example: 2,
      },
      employeeId: {
        type: "integer",
        example: 1,
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
};
