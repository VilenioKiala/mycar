import { CarNotFoundError } from "@/helpers/errors/CarNotFound";
import { ValidationError } from "@/helpers/errors/ValidationError";
import { inMemoryCarRepository } from "@/repositories/InMemory/InMemoryCarRepository";
import { createACarService } from "@/services/administrator/createACarService";
import { deleteACarService } from "@/services/administrator/deleteACarService";
import { FastifyReply, FastifyRequest } from "fastify";

async function createCar(
  req: FastifyRequest,
  res: FastifyReply,
): Promise<void> {
  const { brand, name, categoryId, pricePerDay, image } = req.body as {
    brand: string;
    name: string;
    categoryId: string;
    pricePerDay: number;
    image?: string;
  };

  let carCreated;

  try {
    carCreated = await createACarService.execute({
      brand,
      name,
      categoryId,
      pricePerDay,
      image: image ?? "",
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({
        ...e,
        field: e.field,
      });
    }

    res.status(500).send("Error creating car: " + (e as Error).message);
  }

  return res.send(carCreated);
}

async function getAllCars() {
  const cars = await inMemoryCarRepository.getAllCars();

  return cars;
}

export async function deleteACar(req: FastifyRequest, res: FastifyReply) {
  const { carId } = req.params as { carId: string };

  let carDeleted;

  try {
    carDeleted = await deleteACarService.execute({ carId: carId });

    return res.send(carDeleted);
  } catch (e) {
    if (e instanceof CarNotFoundError) {
      return res.status(404).send(e);
    }
  }
}

export { createCar, getAllCars };
