import { Category } from "@/entities/Category";

export type createACategoryUsecaseParams = {
  name: string;
  image?: string | undefined;
  description: string;
};

export interface createACategoryUsecase {
  execute(params: createACategoryUsecaseParams): Promise<Category>;
}
