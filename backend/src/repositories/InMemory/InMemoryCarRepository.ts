import { ICarRepository } from "../interfaces/ICarRepository";
import { Car } from "@/entities/Car";

class InMemoryCarRepository implements ICarRepository {
  cars: Car[] = [];

  async getAllCars() {
    return Promise.resolve(this.cars);
  }

  async getCarById(id: string) {
    return Promise.resolve(this.cars.filter((car) => car.id == id)[0]);
  }

  async create(car: Car) {
    this.cars.push(car);

    return Promise.resolve(car);
  }

  async delete(id: string) {
    const carToDelete = this.cars.filter((car) => car.id == id)[0];

    if (carToDelete) {
      this.cars = [...this.cars.filter((car) => car.id != id)];

      return Promise.resolve(carToDelete);
    }

    return undefined;
  }
}

const inMemoryCarRepository = new InMemoryCarRepository();

export { InMemoryCarRepository, inMemoryCarRepository };
