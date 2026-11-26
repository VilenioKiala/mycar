import { FastifyHttpOptions, FastifyInstance } from "fastify";
import { createCarBodySchema } from "@/entities/Car";
import {
  createCar,
  deleteACar,
  getAllCars,
} from "../controllers/carController";

export async function carRoutes(
  fastify: FastifyInstance,
  options: FastifyHttpOptions<any>,
) {
  fastify.post(
    "/",
    {
      schema: {
        body: createCarBodySchema,
      },
    },
    createCar,
  );
  fastify.get("/", getAllCars);
  fastify.delete("/:carId", deleteACar);
}
