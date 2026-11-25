import { v4 } from "uuid";
import z from "zod";

export class Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  active: boolean;
  createdAt: Date;

  constructor(data: {
    name: string;
    image?: string;
    slug?: string;
    description?: string;
    active?: boolean;
    createdAt?: Date;
  }) {
    this.id = v4();
    this.name = data.name;
    this.slug = data.slug ?? Category.generateSlug(data.name);
    this.image = data.image ?? "";
    this.description = data.description ?? "";
    this.active = data.active ?? true;
    this.createdAt = data.createdAt ?? new Date();
  }

  /** Converte "Carrinhas Pickup" em "carrinhas-pickup" */
  static generateSlug(text: string): string {
    return text
      .normalize("NFC")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}

export const categoryErrorMessages = {
  createCategory: {
    name: {
      required: "Name is required",
    },
    description: {
      required: "Description is required",
    },
  },
};

export const CategorySchema = z.object({
  name: z.string().min(1, categoryErrorMessages.createCategory.name.required),
  description: z.string(),
});

export const createCategoryBodySchema = {
  type: "object",
  required: ["name"],
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    image: { type: "string" },
  },
};
