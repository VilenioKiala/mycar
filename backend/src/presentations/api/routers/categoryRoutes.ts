import { FastifyHttpOptions, FastifyInstance } from "fastify";
import { createCategoryBodySchema } from "@/entities/Category";
import {
  createCategory,
  deleteCategory,
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
  fastify.delete("/:categoryId", deleteCategory);
}
