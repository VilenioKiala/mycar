import { FastifyReply, FastifyRequest } from "fastify";
import { ValidationError } from "@/helpers/errors/ValidationError";
import { inMemoryCategoryRepository } from "@/repositories/InMemory/InMemoryCategoryRepository";
import { createACategoryService } from "@/services/administrator/createACategoryService";
import { deleteACategoryService } from "@/services/administrator/deleteCategoryService";
import { CategoryNotFoundError } from "@/helpers/errors/CategoryNotFoundError";

async function createCategory(
  req: FastifyRequest,
  res: FastifyReply,
): Promise<void> {
  const { name, image, description } = req.body as {
    name: string;
    image?: string;
    description: string;
  };

  let categoryCreated;

  try {
    categoryCreated = await createACategoryService.execute({
      name,
      image,
      description,
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400).send({
        ...e,
        field: e.field,
      });
    }

    return res
      .status(500)
      .send("Error creating category: " + (e as Error).message);
  }

  return res.send(categoryCreated);
}

async function getAllCategories() {
  const categories = await inMemoryCategoryRepository.getAllCategories();

  return categories;
}

async function deleteCategory(req: FastifyRequest, res: FastifyReply) {
  const { categoryId } = req.params as {
    categoryId: string;
  };

  let categoryDeleted;

  try {
    categoryDeleted = await deleteACategoryService.execute({ categoryId });
    return res.send(categoryDeleted);
  } catch (e) {
    if (e instanceof CategoryNotFoundError) {
      return res.status(404).send({ message: e.message });
    }

    return res
      .status(500)
      .send("Error deleting category: " + (e as Error).message);
  }
}

export { createCategory, getAllCategories, deleteCategory };
