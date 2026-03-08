import swaggerUi from "swagger-ui-express";
import { paths } from "./swagger.paths.js";
import { schemas } from "./swagger.schemas.js";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Appointment Manager API",
    version: "1.0.0",
    description: "API para gestión de turnos",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas,
  },
  paths,
};

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
