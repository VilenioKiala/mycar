import { ValidationError } from "@/helpers/errors/ValidationError";
import { InMemoryUserRepository } from "@/repositories/InMemory/InMemoryUserRepository";
import { SignupService } from "@/services/user/SignupService";
import { beforeEach, describe, expect, test } from "vitest";

describe("Signup Validation Tests", () => {
  let userRepository: InMemoryUserRepository;
  let service: SignupService;

  const validData = () => ({
    email: "cliente@vikey.com",
    name: "Vilénio Kiala",
    phone: "923456789",
    password: "123456789aB",
    role: undefined as any,
  });

  const getError = async (promise: Promise<unknown>) =>
    promise.then(
      () => undefined,
      (e: unknown) => e,
    );

  const expectFieldError = async (promise: Promise<unknown>, field: string) => {
    const error = await getError(promise);

    expect(
      error,
      `Expected a ValidationError on "${field}", received: ${String(error)}`,
    ).toHaveProperty("field", field);
  };

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    service = new SignupService(userRepository);
  });

  describe("validation error shape", () => {
    test("should throw an instance of ValidationError", async () => {
      const error = await getError(
        service.execute({ ...validData(), email: "invalid" }),
      );

      expect(error).toBeInstanceOf(ValidationError);
      expect(error).toBeInstanceOf(Error);
    });

    test("should expose the field and a non empty message", async () => {
      const error = (await getError(
        service.execute({ ...validData(), email: "invalid" }),
      )) as ValidationError;

      expect(error.field).toBe("email");
      expect(typeof error.message).toBe("string");
      expect(error.message.length).toBeGreaterThan(0);
    });

    test("should not throw when the data is valid", async () => {
      const error = await getError(service.execute(validData()));

      expect(error).toBeUndefined();
    });
  });

  describe("required fields", () => {
    test.each(["email", "name", "phone", "password"])(
      "should reject when %s is missing",
      async (field) => {
        const data: any = validData();
        delete data[field];

        await expectFieldError(service.execute(data), field);
      },
    );
  });

  describe("email", () => {
    test.each(["", "vilenio", "vilenio@", "@vikey.com", "vilenio vikey.com"])(
      "should reject invalid email %j",
      async (email) => {
        await expectFieldError(
          service.execute({ ...validData(), email }),
          "email",
        );
      },
    );

    test("should reject an email that is already registered", async () => {
      await service.execute(validData());

      await expectFieldError(
        service.execute({ ...validData(), phone: "923000111" }),
        "email",
      );
    });
  });

  describe("name", () => {
    test("should reject an empty name", async () => {
      await expectFieldError(
        service.execute({ ...validData(), name: "" }),
        "name",
      );
    });
  });

  describe("phone", () => {
    test.each(["", "12345", "abcdefghi", "9234567890123"])(
      "should reject invalid phone %j",
      async (phone) => {
        await expectFieldError(
          service.execute({ ...validData(), phone }),
          "phone",
        );
      },
    );

    test("should reject a phone that is already registered", async () => {
      await service.execute(validData());

      await expectFieldError(
        service.execute({ ...validData(), email: "outro@vikey.com" }),
        "phone",
      );
    });
  });

  describe("password", () => {
    test.each([
      "",
      "12345",
      "123456789",
      "abcdefghij",
      "ABCDEFGHIJ",
      "abcdefg123",
    ])("should reject weak password %j", async (password) => {
      await expectFieldError(
        service.execute({ ...validData(), password }),
        "password",
      );
    });

    test("should accept a strong password", async () => {
      const userCreated = await service.execute({
        ...validData(),
        password: "Str0ngPassw0rd",
      });

      expect(userCreated.comparePassword("Str0ngPassw0rd")).toBeTruthy();
    });

    test("should not match a wrong password", async () => {
      const userCreated = await service.execute(validData());

      expect(userCreated.comparePassword("WrongPassword1A")).toBeFalsy();
    });
  });

  describe("role", () => {
    test("should reject an invalid role", async () => {
      await expectFieldError(
        service.execute({ ...validData(), role: "superuser" as any }),
        "role",
      );
    });
  });

  describe("persistence", () => {
    test("should save the user in the repository", async () => {
      const userCreated = await service.execute(validData());
      const users = await userRepository.getAllUsers();

      expect(users).toHaveLength(1);
      expect(users[0]?.email).toBe(userCreated.email);
    });

    test("should not save any user when validation fails", async () => {
      await expectFieldError(
        service.execute({ ...validData(), email: "invalid" }),
        "email",
      );

      const users = await userRepository.getAllUsers();

      expect(users).toHaveLength(0);
    });

    test("should generate a different id for each user", async () => {
      const first = await service.execute(validData());
      const second = await service.execute({
        ...validData(),
        email: "segundo@vikey.com",
        phone: "923111222",
      });

      expect(first.id).not.toBe(second.id);
    });
  });
});
