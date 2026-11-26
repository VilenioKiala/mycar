import { Category } from "@/entities/Category";
import { CategoryNotFoundError } from "@/helpers/errors/CategoryNotFoundError";
import { inMemoryCategoryRepository } from "@/repositories/InMemory/InMemoryCategoryRepository";
import { ICategoryRepository } from "@/repositories/interfaces/ICategoryRepository";
import {
  DeleteCategoryUsecase,
  DeleteCategoryUsecaseParams,
} from "@/usecases/administrator/deleteCategoryOfCars";

export class DeleteACategoryService implements DeleteCategoryUsecase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async validateParams(id: string): Promise<Category> {
    const category = await this.categoryRepository.getCategoryById(id);

    if (!category) {
      throw new CategoryNotFoundError();
    }

    return category;
  }

  async execute(params: DeleteCategoryUsecaseParams) {
    const category = await this.validateParams(params.categoryId);

    const categoryDeleted = await this.categoryRepository.deleteCategory(
      category.id,
    );

    return <Category>categoryDeleted;
  }
}

export const deleteACategoryService = new DeleteACategoryService(
  inMemoryCategoryRepository,
);
