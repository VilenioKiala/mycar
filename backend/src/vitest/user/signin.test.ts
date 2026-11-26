import { UserRole } from "@/entities/User";
import { InMemoryUserRepository } from "@/repositories/InMemory/InMemoryUserRepository";
import { SigninService } from "@/services/user/SigninService";
import { SignupService } from "@/services/user/SignupService";
import { SigninUsecase } from "@/usecases/user/signin";
import { SignupUsecase } from "@/usecases/user/signup";
import { beforeEach, describe, expect, test } from "vitest";

describe("Sign In Tests", () => {
  let userRepository: InMemoryUserRepository;
  let signupService: SignupUsecase;
  let signInService: SigninUsecase;

  const credentials = {
    email: "cliente@vikey.com",
    password: "123456789aB",
  };

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    signupService = new SignupService(userRepository);
    signInService = new SigninService(userRepository);

    await signupService.execute({
      email: credentials.email,
      name: "Vilénio Kiala",
      phone: "923456789",
      password: credentials.password,
      role: undefined as any,
    });
  });

  describe("successful login", () => {
    test("should sign in with correct credentials", async () => {
      const result = await signInService.execute(credentials);

      expect(result).toBeDefined();
      expect(result).toBeTruthy();
    });

    test("should sign in more than once with the same credentials", async () => {
      const first = await signInService.execute(credentials);
      const second = await signInService.execute(credentials);

      expect(first).toBeTruthy();
      expect(second).toBeTruthy();
    });

    test("should sign in an administrator", async () => {
      await signupService.execute({
        email: "admin@vikey.com",
        name: "Administrador",
        phone: "923000999",
        password: "Adm1nPassword",
        role: UserRole.ADMIN,
      });

      const result = await signInService.execute({
        email: "admin@vikey.com",
        password: "Adm1nPassword",
      });

      expect(result).toBeTruthy();
    });
  });

  describe("wrong credentials", () => {
    test("should reject a wrong password", async () => {
      await expect(
        signInService.execute({ ...credentials, password: "WrongPassword1A" }),
      ).rejects.toThrow();
    });

    test("should reject an email that is not registered", async () => {
      await expect(
        signInService.execute({ ...credentials, email: "naoexiste@vikey.com" }),
      ).rejects.toThrow();
    });

    test("should reject the password of another user", async () => {
      await signupService.execute({
        email: "outro@vikey.com",
        name: "Outro Cliente",
        phone: "923111222",
        password: "OutraPassw0rd",
        role: undefined as any,
      });

      await expect(
        signInService.execute({
          email: credentials.email,
          password: "OutraPassw0rd",
        }),
      ).rejects.toThrow();
    });

    test("should not accept the password with different letter case", async () => {
      await expect(
        signInService.execute({
          ...credentials,
          password: credentials.password.toLowerCase(),
        }),
      ).rejects.toThrow();
    });
  });

  describe("invalid input", () => {
    test.each(["", "vilenio", "vilenio@", "@vikey.com"])(
      "should reject invalid email %j",
      async (email) => {
        await expect(
          signInService.execute({ ...credentials, email }),
        ).rejects.toThrow();
      },
    );

    test("should reject an empty password", async () => {
      await expect(
        signInService.execute({ ...credentials, password: "" }),
      ).rejects.toThrow();
    });

    test("should reject when email is missing", async () => {
      const data: any = { password: credentials.password };

      await expect(signInService.execute(data)).rejects.toThrow();
    });

    test("should reject when password is missing", async () => {
      const data: any = { email: credentials.email };

      await expect(signInService.execute(data)).rejects.toThrow();
    });
  });

  describe("side effects", () => {
    test("should not create or remove users when signing in", async () => {
      await signInService.execute(credentials);

      const users = await userRepository.getAllUsers();

      expect(users).toHaveLength(1);
    });

    test("should not create a user when the login fails", async () => {
      await signInService
        .execute({ ...credentials, email: "naoexiste@vikey.com" })
        .catch(() => undefined);

      const users = await userRepository.getAllUsers();

      expect(users).toHaveLength(1);
    });
  });
});
