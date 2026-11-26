import { Car } from "@/entities/Car";

type DeleteCarUsecaseParams = {
  carId: string;
};

interface DeleteCarUsecase {
  execute(params: DeleteCarUsecaseParams): Promise<Car>;
}

export type { DeleteCarUsecase, DeleteCarUsecaseParams };
