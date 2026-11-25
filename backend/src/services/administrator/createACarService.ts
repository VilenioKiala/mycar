import { Car, CarSchema } from "@/entities/Car";
import { Category } from "@/entities/Category";
import { ValidationError } from "@/helpers/errors/ValidationError";
import { inMemoryCarRepository } from "@/repositories/InMemory/InMemoryCarRepository";
import { inMemoryCategoryRepository } from "@/repositories/InMemory/InMemoryCategoryRepository";
import { ICarRepository } from "@/repositories/interfaces/ICarRepository";
import { ICategoryRepository } from "@/repositories/interfaces/ICategoryRepository";
import {
  createACarUsecase,
  createACarUsecaseParams,
} from "@/usecases/administrator/createACar";

export class CreateACarService implements createACarUsecase {
  constructor(
    private carRepository: ICarRepository,
    private categoryRepository: ICategoryRepository,
  ) {}

  async validateParams(params: createACarUsecaseParams): Promise<any> {
    const result = CarSchema.safeParse(params);

    if (result.error) {
      throw new ValidationError({
        field: result.error.issues[0]?.path[0]?.toString() || "",
        message: result.error.issues[0]?.message || "",
      });
    }

    const hasCategory = await this.categoryRepository.getCategoryById(
      result.data.categoryId,
    );

    if (!hasCategory) {
      throw new ValidationError({
        field: "categoryId",
        message: "Category doesn't exist",
      });
    }

    return result.data;
  }

  async execute(params: createACarUsecaseParams): Promise<Car> {
    const { categoryId, brand, image, name, pricePerDay } =
      await this.validateParams(params);
    const category = <Category>(
      await this.categoryRepository.getCategoryById(categoryId)
    );

    const car = new Car({
      brand,
      image: image ?? "",
      name,
      pricePerDay,
      category,
    });

    const carCreated = await this.carRepository.create(car);

    return carCreated;
  }
}

export const createACarService = new CreateACarService(
  inMemoryCarRepository,
  inMemoryCategoryRepository,
);
