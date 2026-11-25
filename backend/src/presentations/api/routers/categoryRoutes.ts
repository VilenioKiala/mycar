import { FastifyHttpOptions, FastifyInstance } from "fastify";
import { createCategoryBodySchema } from "@/entities/Category";
import {
  createCategory,
  getAllCategories,
} from "../controllers/categoryController";

export async function categoryRoutes(
  fastify: FastifyInstance,
  options: FastifyHttpOptions<any>,
) {
  fastify.post(
    "/",
    {
      schema: {
        body: createCategoryBodySchema,
      },
    },
    createCategory,
  );
  fastify.get("/", getAllCategories);
}
