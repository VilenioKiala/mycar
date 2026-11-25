import { Car } from "@/entities/Car";

export type createACarUsecaseParams = {
  name: string;
  brand: string;
  image?: string;
  pricePerDay: number;
  categoryId: string;
};

export interface createACarUsecase {
  execute(params: createACarUsecaseParams): Promise<Car>;
}
