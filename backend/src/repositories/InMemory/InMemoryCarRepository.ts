import { ICarRepository } from "../interfaces/ICarRepository";
import { Car } from "@/entities/Car";

class InMemoryCarRepository implements ICarRepository {
  cars: Car[] = [];

  async getAllCars() {
    return Promise.resolve(this.cars);
  }

  async create(car: Car) {
    this.cars.push(car);

    return Promise.resolve(car);
  }
}

const inMemoryCarRepository = new InMemoryCarRepository();

export { InMemoryCarRepository, inMemoryCarRepository };
