import { User, UserRole, UserSchema } from "@/entities/User";
import { ValidationError } from "@/helpers/errors/ValidationError";
import { inMemoryUserRepository } from "@/repositories/InMemory/InMemoryUserRepository";
import { IUserRepository } from "@/repositories/interfaces/IUserRepository";
import { SignupUsecase, SignupUsecaseParams } from "@/usecases/user/signup";

class SignupService implements SignupUsecase {
  constructor(private userRepository: IUserRepository) {}

  async validateParams(params: SignupUsecaseParams): Promise<any> {
    const result = UserSchema.safeParse(params);

    if (result.error) {
      throw new ValidationError({
        field: result.error.issues[0]?.path[0]?.toString() || "",
        message: result.error.issues[0]?.message || "",
      });
    }

    const hasUserWithTheSameEmail = await this.userRepository.getUsersByEmail(
      result.data.email,
    );

    const hasUserWithThePhoneNumber =
      await this.userRepository.getUserByPhoneNumber(result.data.phone);

    if (hasUserWithThePhoneNumber) {
      throw new ValidationError({
        field: "phone",
        message: "Phone Number already exists",
      });
    }

    if (hasUserWithTheSameEmail.length > 0) {
      throw new ValidationError({
        field: "email",
        message: "Email already exists",
      });
    }

    return result.data;
  }

  async execute(params: SignupUsecaseParams): Promise<User> {
    const { email, name, phone, password, role } =
      await this.validateParams(params);

    const user = new User({
      email,
      name,
      phone,
      passwordHash: password,
      role: role || UserRole.CLIENT,
    });

    user.hashPassword(password);

    const userCreated = await this.userRepository.createUser(user);

    return userCreated;
  }
}

const signupService = new SignupService(inMemoryUserRepository);

export { signupService, SignupService };
