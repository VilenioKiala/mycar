import { User } from "@/entities/User";
import { IUserRepository } from "@/repositories/interfaces/IUserRepository";

class InMemoryUserRepository implements IUserRepository {
  users: User[] = [];

  async getAllUsers(): Promise<User[]> {
    const users = this.users;

    return Promise.resolve(users);
  }

  createUser(user: User): Promise<User> {
    this.users.push(user);

    return Promise.resolve(user);
  }

  getUsersByEmail(email: string): Promise<User[]> {
    return Promise.resolve(this.users.filter((user) => user.email === email));
  }

  getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    return Promise.resolve(
      this.users.filter((user) => user.phone === phoneNumber)[0],
    );
  }
}

const inMemoryUserRepository = new InMemoryUserRepository();

export { InMemoryUserRepository, inMemoryUserRepository };
