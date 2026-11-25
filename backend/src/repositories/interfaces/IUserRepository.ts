import { User } from "../../entities/User";

interface IUserRepository {
  getAllUsers(): Promise<User[]>;
  getUsersByEmail(email: string): Promise<User[]>;
  createUser(user: User): Promise<User>;
  getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined>;
}

export type { IUserRepository };
