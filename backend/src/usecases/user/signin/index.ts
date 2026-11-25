import { User } from "@/entities/User";

type SigninUsecaseParams = {
  email: string;
  password: string;
};

interface SigninUsecase {
  execute(params: SigninUsecaseParams): Promise<User>;
}

export type { SigninUsecase, SigninUsecaseParams };
