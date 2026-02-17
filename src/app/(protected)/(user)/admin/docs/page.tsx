"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
// import swaggerDocument from "../../../../../../public/swagger.json";
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Vrrittih API",
    version: "1.0.0",
    description: "API documentation for Vrrittih platform"
  },
  servers: [{ url: "/api", description: "Development server" }],
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: { "200": { description: "API is healthy" } }
      }
    }
  }
};

const page = () => {
  return (
    <div>
      <SwaggerUI spec={swaggerDocument} />
    </div>
  );
};
export default page;
