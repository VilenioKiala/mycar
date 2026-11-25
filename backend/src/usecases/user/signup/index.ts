import { User, UserRole } from "@/entities/User";

type SignupUsecaseParams = {
  email: string;
  phone: string;
  name: string;
  password: string;
  role: UserRole | undefined;
};

interface SignupUsecase {
  execute(params: SignupUsecaseParams): Promise<User>;
}

export type { SignupUsecase, SignupUsecaseParams };
