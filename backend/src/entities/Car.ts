import { v4 } from "uuid";
import { Category } from "./Category";
import z from "zod";

export const carErrorMessages = {
  createCar: {
    name: {
      required: "Name is required",
    },
    brand: {
      required: "Brand is required",
    },
    pricePerDay: {
      required: "Price Per Day is required",
    },
    category: {
      required: "Category is required",
    },
  },
};

export class Car {
  id: string;
  name: string;
  brand: string;
  image?: string;
  pricePerDay: number;
  available: boolean;
  category: Category;
  createdAt: Date;

  constructor(data: {
    name: string;
    brand: string;
    image?: string;
    pricePerDay: number;
    category: Category;
    available?: boolean;
    created_at?: Date;
  }) {
    this.id = v4();
    this.name = data.name;
    this.brand = data.brand;
    this.image = data.image ?? "";
    this.pricePerDay = data.pricePerDay;
    this.category = data.category;
    this.available = data.available ?? true;
    this.createdAt = data.created_at ?? new Date();
  }

  priceFormat(): string {
    const valor = this.pricePerDay.toLocaleString("pt-AO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${valor} AOA / DIA`;
  }

  calculateTotal(delivery: Date, devolution: Date): number {
    const miliSecondsPerDay = 1000 * 60 * 60 * 24;
    const days = Math.max(
      1,
      Math.ceil(
        (devolution.getTime() - delivery.getTime()) / miliSecondsPerDay,
      ),
    );
    return days * this.pricePerDay;
  }
}

export const CarSchema = z.object({
  name: z.string().min(1, carErrorMessages.createCar.name.required),
  brand: z.string().min(1, carErrorMessages.createCar.brand.required),
  categoryId: z.string().min(1, carErrorMessages.createCar.category.required),
  pricePerDay: z
    .number()
    .min(0, carErrorMessages.createCar.pricePerDay.required),
});

export const createCarBodySchema = {
  type: "object",
  required: ["name", "brand", "pricePerDay", "categoryId"],
  properties: {
    name: { type: "string" },
    brand: { type: "string" },
    pricePerDay: { type: "number" },
    categoryId: { type: "string" },
    image: { type: "string" },
  },
};
