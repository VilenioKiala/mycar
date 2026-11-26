import { Car } from "@/entities/Car";
import { CarNotFoundError } from "@/helpers/errors/CarNotFound";
import { inMemoryCarRepository } from "@/repositories/InMemory/InMemoryCarRepository";
import { ICarRepository } from "@/repositories/interfaces/ICarRepository";
import {
  DeleteCarUsecase,
  DeleteCarUsecaseParams,
} from "@/usecases/administrator/deleteCar";

export class DeleteACarService implements DeleteCarUsecase {
  constructor(private carRepository: ICarRepository) {}

  async validateParams(id: string): Promise<Car> {
    const car = await this.carRepository.getCarById(id);

    if (!car) {
      throw new CarNotFoundError();
    }

    return car;
  }

  async execute(params: DeleteCarUsecaseParams) {
    const car = await this.validateParams(params.carId);

    const carDeleted = await this.carRepository.delete(car.id);

    return <Car>carDeleted;
  }
}

export const deleteACarService = new DeleteACarService(inMemoryCarRepository);
