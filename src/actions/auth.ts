"use server";

import { redirect } from "next/navigation";

import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteCurrentSession } from "@/lib/auth/session";
import type { AuthFormState } from "@/lib/auth/types";
import { loginSchema, registerSchema } from "@/lib/auth/validation";
import { getPrisma } from "@/lib/prisma";
import { consumeRateLimit, getRequestFingerprint } from "@/lib/security/rate-limit";

function errorCode(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") return error.code;
  return "UNKNOWN";
}

function logAuthFailure(operation: string, error: unknown) {
  // Never log credentials, connection strings, or raw database errors.
  console.error("Authentication service failure", { operation, code: errorCode(error) });
}

function unavailableState(): AuthFormState {
  return { status: "error", message: "Sign-in and registration are temporarily unavailable. Please try again shortly. If this continues, contact the site administrator." };
}

function firstError(errors: string[] | undefined) {
  return errors?.[0];
}

async function register(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;

    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors: {
        name: firstError(errors.name),
        username: firstError(errors.username),
        email: firstError(errors.email),
        password: firstError(errors.password),
        confirmPassword: firstError(errors.confirmPassword),
      },
    };
  }

  try {
    const fingerprint = await getRequestFingerprint();
    const registrationAllowed = await consumeRateLimit({
      scope: "auth-register",
      identifier: fingerprint,
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });

    if (!registrationAllowed) {
      return {
        status: "error",
        message: "Too many registration attempts. Try again later.",
      };
    }

    const database = getPrisma();
    const { name, username, email, password } = parsed.data;

    const existing = await database.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      return {
        status: "error",
        message: "An account already uses these details.",
      };
    }

    let userId: string;

    try {
      const user = await database.user.create({
        data: {
          name,
          username,
          email,
          passwordHash: await hashPassword(password),
        },
        select: {
          id: true,
        },
      });

      userId = user.id;
    } catch (error) {
      if (errorCode(error) !== "P2002") throw error;
      return { status: "error", message: "An account already uses this email or username. Log in or use different details." };
    }

    try {
      await createSession(userId);
    } catch (error) {
      logAuthFailure("register-session", error);
      return { status: "error", message: "Your account was created, but we could not sign you in. Go to Log in to continue." };
    }
  } catch (error) {
    logAuthFailure("register", error);
    return unavailableState();
  }
  redirect("/feed");
}

async function login(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;

    return {
      status: "error",
      message: "Check your email and password.",
      errors: {
        email: firstError(errors.email),
        password: firstError(errors.password),
      },
    };
  }

  try {
    const fingerprint = await getRequestFingerprint();
    const requestAllowed = await consumeRateLimit({
      scope: "auth-login-request",
      identifier: fingerprint,
      limit: 30,
      windowMs: 15 * 60 * 1000,
    });

    if (!requestAllowed) {
      return {
        status: "error",
        message: "Too many login attempts. Try again later.",
      };
    }

    const accountAllowed = await consumeRateLimit({
      scope: "auth-login-account",
      identifier: parsed.data.email,
      limit: 8,
      windowMs: 15 * 60 * 1000,
    });

    if (!accountAllowed) {
      return {
        status: "error",
        message: "Too many login attempts. Try again later.",
      };
    }

    const database = getPrisma();
    const user = await database.user.findUnique({
      where: {
        email: parsed.data.email,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    const passwordMatches = user
      ? await verifyPassword(parsed.data.password, user.passwordHash)
      : (await hashPassword(parsed.data.password), false);

    if (!user || !passwordMatches) {
      return {
        status: "error",
        message: "The email or password is incorrect.",
      };
    }

    await createSession(user.id);
  } catch (error) {
    logAuthFailure("login", error);
    return unavailableState();
  }
  redirect("/feed");
}

export async function logoutAction() {
  await deleteCurrentSession();
  redirect("/login");
}


export async function registerAction(previousState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const state = await register(previousState, formData);
  return { ...state, values: safeValues(formData) };
}

export async function loginAction(previousState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const state = await login(previousState, formData);
  return { ...state, values: { email: safeValues(formData).email } };
}

function safeValues(formData: FormData) {
  const value = (name: string, max: number) => {
    const entry = formData.get(name);
    return typeof entry === "string" ? entry.slice(0, max) : "";
  };
  return { name: value("name", 80), username: value("username", 30), email: value("email", 254) };
}
