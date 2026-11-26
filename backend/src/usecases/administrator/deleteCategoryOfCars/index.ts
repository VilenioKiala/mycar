import { Category } from "@/entities/Category";

type DeleteCategoryUsecaseParams = {
  categoryId: string;
};

interface DeleteCategoryUsecase {
  execute(params: DeleteCategoryUsecaseParams): Promise<Category>;
}

export type { DeleteCategoryUsecase, DeleteCategoryUsecaseParams };
