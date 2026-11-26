import { Car } from "@/entities/Car";
import { Category } from "@/entities/Category";
import { CarNotFoundError } from "@/helpers/errors/CarNotFound";
import { ValidationError } from "@/helpers/errors/ValidationError";
import { InMemoryCarRepository } from "@/repositories/InMemory/InMemoryCarRepository";
import { InMemoryCategoryRepository } from "@/repositories/InMemory/InMemoryCategoryRepository";
import { CreateACarService } from "@/services/administrator/createACarService";
import { DeleteACarService } from "@/services/administrator/deleteACarService";
import { createACarUsecase } from "@/usecases/administrator/createACar";
import { DeleteCarUsecase } from "@/usecases/administrator/deleteCar";
import { beforeEach, describe, expect, test } from "vitest";

describe("Car Services Tests", () => {
  describe("Delete A Car Tests", () => {
    let carRepository: InMemoryCarRepository;
    let categoryRepository: InMemoryCategoryRepository;
    let createACarService: createACarUsecase;
    let deleteACarService: DeleteCarUsecase;
    let firstCarId: string;
    let secondCarId: string;

    const getError = async (promise: Promise<unknown>) =>
      promise.then(
        () => undefined,
        (e: unknown) => e,
      );

    const expectCarNotFound = async (promise: Promise<unknown>) => {
      const error = await getError(promise);

      expect(
        error,
        `Expected a CarNotFoundError, received: ${String(error)}`,
      ).toBeInstanceOf(CarNotFoundError);
    };

    beforeEach(async () => {
      carRepository = new InMemoryCarRepository();
      categoryRepository = new InMemoryCategoryRepository();
      createACarService = new CreateACarService(
        carRepository,
        categoryRepository,
      );
      deleteACarService = new DeleteACarService(carRepository);

      const category = await categoryRepository.create(
        new Category({ name: "SUV", image: "" }),
      );

      const firstCar = await createACarService.execute({
        name: "Toyota Prado",
        brand: "Toyota",
        image: "",
        pricePerDay: 4000,
        categoryId: category.id,
      });

      const secondCar = await createACarService.execute({
        name: "Mercedes AMG G-63",
        brand: "Mercedes",
        image: "",
        pricePerDay: 10000,
        categoryId: category.id,
      });

      firstCarId = firstCar.id;
      secondCarId = secondCar.id;
    });

    describe("successful deletion", () => {
      test("should delete an existing car", async () => {
        await deleteACarService.execute({ carId: firstCarId });

        const car = await carRepository.getCarById(firstCarId);

        expect(car).toBeFalsy();
      });

      test("should resolve and return the car deleted", async () => {
        const result = await deleteACarService.execute({ carId: firstCarId });

        expect(result).toBeInstanceOf(Car);
      });

      test("should remove only the requested car", async () => {
        await deleteACarService.execute({ carId: firstCarId });

        const cars = await carRepository.getAllCars();

        expect(cars).toHaveLength(1);
        expect(cars[0]?.id).toBe(secondCarId);
      });

      test("should not affect the other cars", async () => {
        await deleteACarService.execute({ carId: firstCarId });

        const otherCar = await carRepository.getCarById(secondCarId);

        expect(otherCar).toBeTruthy();
        expect(otherCar?.name).toBe("Mercedes AMG G-63");
      });

      test("should delete all cars one by one", async () => {
        await deleteACarService.execute({ carId: firstCarId });
        await deleteACarService.execute({ carId: secondCarId });

        const cars = await carRepository.getAllCars();

        expect(cars).toHaveLength(0);
      });
    });

    describe("car not found", () => {
      test("should reject a car that does not exist", async () => {
        await expectCarNotFound(
          deleteACarService.execute({ carId: "non-existent-id" }),
        );
      });

      test("should reject deleting the same car twice", async () => {
        await deleteACarService.execute({ carId: firstCarId });

        await expectCarNotFound(
          deleteACarService.execute({ carId: firstCarId }),
        );
      });

      test("should not throw a ValidationError for a missing car", async () => {
        const error = await getError(
          deleteACarService.execute({ carId: "non-existent-id" }),
        );

        expect(error).not.toBeInstanceOf(ValidationError);
      });
    });

    describe("error shape", () => {
      test("should throw an instance of CarNotFoundError", async () => {
        const error = await getError(
          deleteACarService.execute({ carId: "non-existent-id" }),
        );

        expect(error).toBeInstanceOf(CarNotFoundError);
        expect(error).toBeInstanceOf(Error);
      });

      test("should expose the car not found message", async () => {
        const error = (await getError(
          deleteACarService.execute({ carId: "non-existent-id" }),
        )) as CarNotFoundError;

        expect(error.message).toBe("Car not found");
      });

      test("should throw an instance of ValidationError for an invalid carId", async () => {
        const error = await getError(deleteACarService.execute({ carId: "" }));

        expect(error).toBeInstanceOf(CarNotFoundError);
      });

      test("should expose a non empty message for an invalid carId", async () => {
        const error = (await getError(
          deleteACarService.execute({ carId: "" }),
        )) as ValidationError;

        expect(typeof error.message).toBe("string");
        expect(error.message.length).toBeGreaterThan(0);
      });
    });

    describe("side effects", () => {
      test("should not delete anything when the car does not exist", async () => {
        await getError(deleteACarService.execute({ carId: "non-existent-id" }));

        const cars = await carRepository.getAllCars();

        expect(cars).toHaveLength(2);
      });

      test("should not delete anything when the carId is invalid", async () => {
        await getError(deleteACarService.execute({ carId: "" }));

        const cars = await carRepository.getAllCars();

        expect(cars).toHaveLength(2);
      });

      test("should not delete the category of the car", async () => {
        await deleteACarService.execute({ carId: firstCarId });

        const categories = await categoryRepository.getAllCategories();

        expect(categories).toHaveLength(1);
      });
    });
  });
});
