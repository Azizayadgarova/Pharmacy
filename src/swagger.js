import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Apteka API hujjatlari",
      version: "1.0.0",
      description: "Dori ombori tizimi uchun Swagger hujjatlari",
    },
    servers: [
      {
        url: "http://localhost:4000/api", // ⚙️ Lokal server
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // 🔹 Router fayllardagi JSDoc izohlarni o‘qiydi
};

const swaggerSpec = swaggerJSDoc(options);

export default function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
