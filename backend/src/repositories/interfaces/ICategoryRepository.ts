import { Category } from "@/entities/Category";

interface ICategoryRepository {
  create(category: Category): Promise<Category>;
  getCategoryById(id: string): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  getAllCategories(): Promise<Category[]>;
}

export type { ICategoryRepository };
