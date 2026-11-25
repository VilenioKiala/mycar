import { Car } from "@/entities/Car";

interface ICarRepository {
  create(car: Car): Promise<Car>;
  getAllCars(): Promise<Car[]>;
}

export type { ICarRepository };
