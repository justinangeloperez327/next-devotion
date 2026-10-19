import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findFirst: vi.fn(), findUnique: vi.fn(), create: vi.fn(),
  createSession: vi.fn(), deleteCurrentSession: vi.fn(),
  consumeRateLimit: vi.fn(), hashPassword: vi.fn(), verifyPassword: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({ getPrisma: () => ({ user: mocks }) }));
vi.mock("@/lib/auth/session", () => ({ createSession: mocks.createSession, deleteCurrentSession: mocks.deleteCurrentSession }));
vi.mock("@/lib/auth/password", () => ({ hashPassword: mocks.hashPassword, verifyPassword: mocks.verifyPassword }));
vi.mock("@/lib/security/rate-limit", () => ({ consumeRateLimit: mocks.consumeRateLimit, getRequestFingerprint: async () => "test-client" }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error(`REDIRECT:${path}`); } }));
import { loginAction, registerAction } from "@/actions/auth";
const idle = { status: "idle" } as const;
function details() {
  return new FormData();
}
function form() {
  const data = details();
  Object.entries({ name: "Test Person", username: "testperson", email: "Person@Example.com", password: "password123", confirmPassword: "password123" }).forEach(([key,value]) => data.set(key,value));
  return data;
}
beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.consumeRateLimit.mockResolvedValue(true);
  mocks.findFirst.mockResolvedValue(null);
  mocks.create.mockResolvedValue({ id: "user-1" });
  mocks.findUnique.mockResolvedValue({ id: "user-1", passwordHash: "hash" });
  mocks.hashPassword.mockResolvedValue("hash");
  mocks.verifyPassword.mockResolvedValue(true);
});
describe("authentication actions", () => {
  it("creates a normalized account and session and preserves the redirect", async () => {
    await expect(registerAction(idle, form())).rejects.toThrow("REDIRECT:/feed");
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ email: "person@example.com", passwordHash: "hash" }) }));
    expect(mocks.createSession).toHaveBeenCalledWith("user-1");
  });
  it("logs in and redirects after session creation", async () => {
    await expect(loginAction(idle, form())).rejects.toThrow("REDIRECT:/feed");
    expect(mocks.createSession).toHaveBeenCalledWith("user-1");
  });
  it("handles a missing rate-limit table without an unhandled exception", async () => {
    mocks.consumeRateLimit.mockRejectedValue({ code: "P2021", message: "sensitive db details" });
    const result = await loginAction(idle, form());
    expect(result.message).toContain("temporarily unavailable");
    expect(result.values).toEqual({ email: "Person@Example.com" });
    expect(JSON.stringify(result)).not.toContain("password123");
    expect(console.error).toHaveBeenCalledWith("Authentication service failure", { operation: "login", code: "P2021" });
  });
  it("does not describe database outages as duplicate accounts", async () => {
    mocks.create.mockRejectedValue({ code: "P1001" });
    expect((await registerAction(idle, form())).message).toContain("temporarily unavailable");
  });
  it("handles a duplicate registration race", async () => {
    mocks.create.mockRejectedValue({ code: "P2002" });
    expect((await registerAction(idle, form())).message).toContain("already uses");
    expect(mocks.createSession).not.toHaveBeenCalled();
  });
  it("explains when the account exists but automatic sign-in failed", async () => {
    mocks.createSession.mockRejectedValue({ code: "P1001" });
    expect((await registerAction(idle, form())).message).toContain("Your account was created");
  });
  it("rejects wrong credentials without creating a session", async () => {
    mocks.verifyPassword.mockResolvedValue(false);
    expect((await loginAction(idle, form())).message).toContain("incorrect");
    expect(mocks.createSession).not.toHaveBeenCalled();
  });
  it("retains rate-limit protection", async () => {
    mocks.consumeRateLimit.mockResolvedValue(false);
    expect((await loginAction(idle, form())).message).toContain("Too many");
    expect(mocks.findUnique).not.toHaveBeenCalled();
  });
  it("rejects mismatched confirmation before accessing the database", async () => {
    const data = form(); data.set("confirmPassword", "different");
    expect((await registerAction(idle, data)).errors?.confirmPassword).toBe("Passwords do not match.");
    expect(mocks.consumeRateLimit).not.toHaveBeenCalled();
  });
});
