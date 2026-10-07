"use server";

import { redirect } from "next/navigation";

import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteCurrentSession } from "@/lib/auth/session";
import type { AuthFormState } from "@/lib/auth/types";
import { loginSchema, registerSchema } from "@/lib/auth/validation";
import { getPrisma } from "@/lib/prisma";

function firstError(errors: string[] | undefined) {
  return errors?.[0];
}

export async function registerAction(
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

  const database = getPrisma();
  const { name, username, email, password } = parsed.data;

  const existing = await database.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
    select: {
      email: true,
      username: true,
    },
  });

  if (existing) {
    return {
      status: "error",
      message: "An account already uses these details.",
      errors: {
        email:
          existing.email === email ? "This email is already registered." : undefined,
        username:
          existing.username === username
            ? "This username is already taken."
            : undefined,
      },
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
  } catch {
    return {
      status: "error",
      message:
        "We could not create the account. The email or username may already be in use.",
    };
  }

  await createSession(userId);
  redirect("/feed");
}

export async function loginAction(
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

  if (
    !user ||
    !(await verifyPassword(parsed.data.password, user.passwordHash))
  ) {
    return {
      status: "error",
      message: "The email or password is incorrect.",
    };
  }

  await createSession(user.id);
  redirect("/feed");
}

export async function logoutAction() {
  await deleteCurrentSession();
  redirect("/login");
}
