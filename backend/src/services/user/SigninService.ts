import { User, userErrorMessages } from "@/entities/User";
import { SigninError } from "@/helpers/errors/SigninError";
import { inMemoryUserRepository } from "@/repositories/InMemory/InMemoryUserRepository";
import { IUserRepository } from "@/repositories/interfaces/IUserRepository";
import { SigninUsecase, SigninUsecaseParams } from "@/usecases/user/signin";

class SigninService implements SigninUsecase {
  constructor(private userRepository: IUserRepository) {}

  async execute(params: SigninUsecaseParams): Promise<User> {
    const { email, password } = params;
    const results = await this.userRepository.getUsersByEmail(email);

    if (results.length == 0) {
      throw new SigninError({
        field: "email",
        message: userErrorMessages.signin.email,
      });
    }

    const user = results[0];

    if (!user?.comparePassword(password))
      throw new SigninError({
        field: "password",
        message: userErrorMessages.signin.password,
      });

    if (!user?.active)
      throw new SigninError({
        field: "",
        message: userErrorMessages.signin.active,
      });

    return user;
  }
}

const signinService = new SigninService(inMemoryUserRepository);

export { signinService, SigninService };
