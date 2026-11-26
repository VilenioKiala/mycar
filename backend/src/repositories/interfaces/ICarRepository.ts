import { Car } from "@/entities/Car";

interface ICarRepository {
  create(car: Car): Promise<Car>;
  getAllCars(): Promise<Car[]>;
  getCarById(id: string): Promise<Car | undefined>;
  delete(id: string): Promise<Car | undefined>;
}

export type { ICarRepository };
