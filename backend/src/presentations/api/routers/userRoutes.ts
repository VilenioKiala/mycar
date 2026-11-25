import { FastifyHttpOptions, FastifyInstance } from "fastify";
import { createUser, getAllUsers } from "../controllers/userController";
import { createUserBodySchema } from "@/entities/User";

export async function userRoutes(
  fastify: FastifyInstance,
  options: FastifyHttpOptions<any>,
) {
  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    createUser,
  );
  fastify.get("/", getAllUsers);
}
