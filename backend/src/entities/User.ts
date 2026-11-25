import { v4 } from "uuid";
import bcrypt from "bcrypt";
import z from "zod";

export const userErrorMessages = {
  signin: {
    email: "Email or Password are wrong!",
    password: "Email or Password are wrong!",
    active: "This account is not active.",
  },
  createUser: {
    name: {
      required: "Name is required",
    },
  },
};

export enum UserRole {
  CLIENT = "client",
  ADMIN = "admin",
}

export class User {
  id: string;
  name: string;
  email: string;
  phone: string;
  emailConfirmed?: boolean;
  phoneConfirmed?: boolean;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  favourites: string[];
  createdAt: Date;

  constructor(data: {
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role?: UserRole;
    active?: boolean;
    favourites?: string[];
    created_at?: Date;
  }) {
    this.id = v4();
    this.name = data.name;
    this.email = data.email.toLowerCase().trim();
    this.phone = data.phone;
    this.passwordHash = data.passwordHash;
    this.role = data.role ?? UserRole.CLIENT;
    this.active = data.active ?? true;
    this.emailConfirmed = false;
    this.phoneConfirmed = false;
    this.favourites = data.favourites ?? [];
    this.createdAt = data.created_at ?? new Date();
  }

  changeFavourite(carId: string): void {
    const index = this.favourites.indexOf(carId);
    if (index === -1) {
      this.favourites.push(carId);
    } else {
      this.favourites.splice(index, 1);
    }
  }

  isFavourite(carId: string): boolean {
    return this.favourites.includes(carId);
  }

  get totalFavourites(): number {
    return this.favourites.length;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  hashPassword(password: string): void {
    this.passwordHash = bcrypt.hashSync(password, 10);
  }

  comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.passwordHash);
  }
}

export const UserSchema = z.object({
  name: z.string().min(1, userErrorMessages.createUser.name.required),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .regex(/^9\d{8}$/, "O número deve ter 9 dígitos e começar por 9"),
  password: z
    .string()
    .min(8, "A palavra-passe deve ter pelo menos 8 caracteres.")
    .max(100, "A palavra-passe não pode exceder 100 caracteres.")
    .regex(/[A-Z]/, "Deve incluir pelo menos uma letra maiúscula.")
    .regex(/[a-z]/, "Deve incluir pelo menos uma letra minúscula.")
    .regex(/[0-9]/, "Deve incluir pelo menos um número."),
  role: z.enum(UserRole).default(UserRole.CLIENT),
});

export const createUserBodySchema = {
  type: "object",
  required: ["name", "phone", "email", "password"],
  properties: {
    name: { type: "string" },
    phone: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    userRole: { type: "string", enum: ["client", "admin"] },
  },
};

export const signinBodySchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
};
