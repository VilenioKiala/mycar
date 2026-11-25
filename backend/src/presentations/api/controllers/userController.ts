import { SigninError } from "@/helpers/errors/SigninError";
import { ValidationError } from "@/helpers/errors/ValidationError";
import { inMemoryUserRepository } from "@/repositories/InMemory/InMemoryUserRepository";
import { signinService } from "@/services/user/SigninService";
import { signupService } from "@/services/user/SignupService";
import { FastifyReply, FastifyRequest } from "fastify";

async function createUser(
  req: FastifyRequest,
  res: FastifyReply,
): Promise<void> {
  const { email, name, phone, password, role } = req.body as {
    email: string;
    name: string;
    phone: string;
    password: string;
    role: string;
  };

  let userCreated;

  try {
    userCreated = await signupService.execute({
      email,
      name,
      phone,
      password,
      role: role as any,
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({
        ...e,
        field: e.field,
      });
    }

    res.status(500).send("Error creating user: " + (e as Error).message);
  }

  return res.send(userCreated);
}

async function getAllUsers() {
  const users = await inMemoryUserRepository.getAllUsers();

  return users;
}

async function signin(req: FastifyRequest, res: FastifyReply) {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  try {
    const user = await signinService.execute({ email, password });

    return res.send(user);
  } catch (e) {
    if (e instanceof SigninError) {
      return res.status(400).send(e);
    }

    throw e;
  }
}

export { createUser, getAllUsers, signin };
