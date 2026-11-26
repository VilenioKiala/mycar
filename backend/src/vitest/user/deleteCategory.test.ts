import { Category } from "@/entities/Category";
import { CategoryNotFoundError } from "@/helpers/errors/CategoryNotFoundError";
import { ValidationError } from "@/helpers/errors/ValidationError";
import { InMemoryCarRepository } from "@/repositories/InMemory/InMemoryCarRepository";
import { InMemoryCategoryRepository } from "@/repositories/InMemory/InMemoryCategoryRepository";
import { CreateACarService } from "@/services/administrator/createACarService";
import { CreateACategoryService } from "@/services/administrator/createACategoryService";
import { DeleteACategoryService } from "@/services/administrator/deleteCategoryService";
import { createACarUsecase } from "@/usecases/administrator/createACar";
import { createACategoryUsecase } from "@/usecases/administrator/createCategoryOfCars";
import { DeleteCategoryUsecase } from "@/usecases/administrator/deleteCategoryOfCars";
import { beforeEach, describe, expect, test } from "vitest";

describe("Category Services Tests", () => {
  describe("Delete A Category Tests", () => {
    let carRepository: InMemoryCarRepository;
    let categoryRepository: InMemoryCategoryRepository;
    let createACategoryService: createACategoryUsecase;
    let createACarService: createACarUsecase;
    let deleteACategoryService: DeleteCategoryUsecase;
    let suvCategory: Category;
    let sedanCategory: Category;

    const getError = async (promise: Promise<unknown>) =>
      promise.then(
        () => undefined,
        (e: unknown) => e,
      );

    const expectCategoryNotFound = async (promise: Promise<unknown>) => {
      const error = await getError(promise);

      expect(
        error,
        `Expected a CategoryNotFoundError, received: ${String(error)}`,
      ).toBeInstanceOf(CategoryNotFoundError);
    };

    beforeEach(async () => {
      carRepository = new InMemoryCarRepository();
      categoryRepository = new InMemoryCategoryRepository();
      createACategoryService = new CreateACategoryService(categoryRepository);
      createACarService = new CreateACarService(
        carRepository,
        categoryRepository,
      );
      deleteACategoryService = new DeleteACategoryService(categoryRepository);

      suvCategory = await createACategoryService.execute({
        name: "SUV",
        image: "",
      });

      sedanCategory = await createACategoryService.execute({
        name: "Sedan",
        image: "",
      });
    });

    describe("successful deletion", () => {
      test("should delete an existing category", async () => {
        await deleteACategoryService.execute({ categoryId: suvCategory.id });

        const category = await categoryRepository.getCategoryById(
          suvCategory.id,
        );

        expect(category).toBeFalsy();
      });

      test("should resolve without returning a value", async () => {
        const result = await deleteACategoryService.execute({
          categoryId: suvCategory.id,
        });

        expect(result).toBeInstanceOf(Category);
      });

      test("should remove only the requested category", async () => {
        await deleteACategoryService.execute({ categoryId: suvCategory.id });

        const categories = await categoryRepository.getAllCategories();

        expect(categories).toHaveLength(1);
        expect(categories[0]?.id).toBe(sedanCategory.id);
      });

      test("should not affect the other categories", async () => {
        await deleteACategoryService.execute({ categoryId: suvCategory.id });

        const otherCategory = await categoryRepository.getCategoryById(
          sedanCategory.id,
        );

        expect(otherCategory).toBeTruthy();
        expect(otherCategory?.name).toBe("Sedan");
      });

      test("should delete all categories one by one", async () => {
        await deleteACategoryService.execute({ categoryId: suvCategory.id });
        await deleteACategoryService.execute({ categoryId: sedanCategory.id });

        const categories = await categoryRepository.getAllCategories();

        expect(categories).toHaveLength(0);
      });

      test("should allow creating a category with the same name after deleting it", async () => {
        await deleteACategoryService.execute({ categoryId: suvCategory.id });

        const recreated = await createACategoryService.execute({
          name: "SUV",
          image: "",
        });

        expect(recreated.name).toBe("SUV");
        expect(recreated.id).not.toBe(suvCategory.id);
      });
    });

    describe("category not found", () => {
      test("should reject a category that does not exist", async () => {
        await expectCategoryNotFound(
          deleteACategoryService.execute({ categoryId: "non-existent-id" }),
        );
      });

      test("should reject deleting the same category twice", async () => {
        await deleteACategoryService.execute({ categoryId: suvCategory.id });

        await expectCategoryNotFound(
          deleteACategoryService.execute({ categoryId: suvCategory.id }),
        );
      });

      test("should not throw a ValidationError for a missing category", async () => {
        const error = await getError(
          deleteACategoryService.execute({ categoryId: "non-existent-id" }),
        );

        expect(error).not.toBeInstanceOf(ValidationError);
      });
    });

    describe("error shape", () => {
      test("should throw an instance of CategoryNotFoundError", async () => {
        const error = await getError(
          deleteACategoryService.execute({ categoryId: "non-existent-id" }),
        );

        expect(error).toBeInstanceOf(CategoryNotFoundError);
        expect(error).toBeInstanceOf(Error);
      });

      test("should expose the category not found message", async () => {
        const error = (await getError(
          deleteACategoryService.execute({ categoryId: "non-existent-id" }),
        )) as CategoryNotFoundError;

        expect(error.message).toBe("Category not found");
      });

      test("should throw an instance of ValidationError for an invalid categoryId", async () => {
        const error = await getError(
          deleteACategoryService.execute({ categoryId: "" }),
        );

        expect(error).toBeInstanceOf(CategoryNotFoundError);
      });

      test("should expose a non empty message for an invalid categoryId", async () => {
        const error = (await getError(
          deleteACategoryService.execute({ categoryId: "" }),
        )) as ValidationError;

        expect(typeof error.message).toBe("string");
        expect(error.message.length).toBeGreaterThan(0);
      });
    });

    describe("side effects", () => {
      test("should not delete anything when the category does not exist", async () => {
        await getError(
          deleteACategoryService.execute({ categoryId: "non-existent-id" }),
        );

        const categories = await categoryRepository.getAllCategories();

        expect(categories).toHaveLength(2);
      });

      test("should not delete anything when the categoryId is invalid", async () => {
        await getError(deleteACategoryService.execute({ categoryId: "" }));

        const categories = await categoryRepository.getAllCategories();

        expect(categories).toHaveLength(2);
      });

      test("should not delete the cars of other categories", async () => {
        const car = await createACarService.execute({
          name: "Hyundai Azera",
          brand: "Hyundai",
          image: "",
          pricePerDay: 4000,
          categoryId: sedanCategory.id,
        });

        await deleteACategoryService.execute({ categoryId: suvCategory.id });

        const carFound = await carRepository.getCarById(car.id);

        expect(carFound).toBeTruthy();
      });
    });
  });
});
