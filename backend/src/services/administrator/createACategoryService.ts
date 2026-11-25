import { Category, CategorySchema } from "@/entities/Category";
import { ValidationError } from "@/helpers/errors/ValidationError";
import { inMemoryCategoryRepository } from "@/repositories/InMemory/InMemoryCategoryRepository";
import { ICategoryRepository } from "@/repositories/interfaces/ICategoryRepository";
import {
  createACategoryUsecase,
  createACategoryUsecaseParams,
} from "@/usecases/administrator/createCategoryOfCars";

export class CreateACategoryService implements createACategoryUsecase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async validateParams(params: createACategoryUsecaseParams): Promise<any> {
    const result = CategorySchema.safeParse(params);

    if (result.error) {
      throw new ValidationError({
        field: result.error.issues[0]?.path[0]?.toString() || "",
        message: result.error.issues[0]?.message || "",
      });
    }

    const categoryAlreadyExists =
      await this.categoryRepository.getCategoryByName(result.data.name);

    if (categoryAlreadyExists) {
      throw new ValidationError({
        field: "name",
        message: "Category already exists",
      });
    }

    return result.data;
  }

  async execute(params: createACategoryUsecaseParams): Promise<Category> {
    const { name, image } = await this.validateParams(params);

    const category = new Category({
      name,
      image: image ?? "",
    });

    const categoryCreated = await this.categoryRepository.create(category);

    return categoryCreated;
  }
}

export const createACategoryService = new CreateACategoryService(
  inMemoryCategoryRepository,
);
