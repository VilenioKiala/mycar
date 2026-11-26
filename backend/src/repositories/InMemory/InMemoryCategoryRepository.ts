import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { Category } from "@/entities/Category";

class InMemoryCategoryRepository implements ICategoryRepository {
  categories: Category[] = [];

  async getAllCategories() {
    return Promise.resolve(this.categories);
  }

  getCategoryById(id: string): Promise<Category | undefined> {
    const categories = this.categories.filter((category) => category.id == id);

    return Promise.resolve(categories[0]);
  }

  getCategoryByName(name: string): Promise<Category | undefined> {
    const categories = this.categories.filter(
      (category) => category.name == name,
    );

    return Promise.resolve(categories[0]);
  }

  async create(category: Category): Promise<Category> {
    this.categories.push(category);

    return Promise.resolve(category);
  }

  async deleteCategory(id: string) {
    const categoryToDelete = this.categories.filter(
      (category) => category.id == id,
    )[0];

    if (categoryToDelete) {
      this.categories = [
        ...this.categories.filter((category) => category.id != id),
      ];

      return Promise.resolve(categoryToDelete);
    }

    return undefined;
  }
}

const inMemoryCategoryRepository = new InMemoryCategoryRepository();

export { InMemoryCategoryRepository, inMemoryCategoryRepository };
