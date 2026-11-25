import { FastifyHttpOptions, FastifyInstance } from "fastify";
import { userRoutes } from "./routers/userRoutes";
import { signinBodySchema } from "@/entities/User";
import { signin } from "./controllers/userController";
import { carRoutes } from "./routers/carRoutes";
import { categoryRoutes } from "./routers/categoryRoutes";

export async function apiRoutes(fastify: FastifyInstance) {
  fastify.register(categoryRoutes, { prefix: "/categories" });
  fastify.register(carRoutes, { prefix: "/cars" });
  fastify.register(userRoutes, { prefix: "/users" });
  fastify.post(
    "/signin",
    {
      schema: {
        body: signinBodySchema,
      },
    },
    signin,
  );
}
