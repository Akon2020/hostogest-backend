import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { API_URL, HOST_URL } from "./config/env.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Medicure API",
      version: "1.0.0",
      description: "Documentation de l'API Medicure",
    },
    servers: [{ url: HOST_URL }, { url: API_URL }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        withCredentials: true,
      },
    })
  );
};

/*
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { API_URL, HOST_URL } from "./config/env.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Medicure API",
      version: "1.0.0",
      description: "Documentation de l'API Medicure",
    },
    servers: [{ url: API_URL }, { url: HOST_URL }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description:
            "Authentification JWT via cookie. Le token est un cookie HttpOnly nommé 'token' et est envoyé automatiquement par le navigateur.",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Authentification JWT via l'en-tête Authorization (Bearer Token). Utile pour les clients non-navigateurs.",
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        withCredentials: true,
        persistAuthorization: true,
      },
    })
  );
};

*/
