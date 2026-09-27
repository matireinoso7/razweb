import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword, signToken, verifyToken } from "@/lib/auth";

describe("JWT Authentication & Password Security", () => {
  it("hashes password and verifies match correctly", async () => {
    const plain = "SuperSecretPassword123!";
    const hash = await hashPassword(plain);

    expect(hash).not.toBe(plain);
    const isMatch = await comparePassword(plain, hash);
    expect(isMatch).toBe(true);

    const isWrong = await comparePassword("WrongPassword", hash);
    expect(isWrong).toBe(false);
  });

  it("signs and verifies JWT payload", async () => {
    const payload = {
      userId: "user-123-uuid",
      email: "matias@razweb.ai",
      name: "Matias",
    };

    const token = await signToken(payload);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);

    const verified = await verifyToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.email).toBe(payload.email);
    expect(verified?.name).toBe(payload.name);
  });

  it("fails verification on invalid or tampered JWT", async () => {
    const verified = await verifyToken("invalid.token.signature");
    expect(verified).toBeNull();
  });
});
