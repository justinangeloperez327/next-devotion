"use client";

import { useActionState } from "react";
import Link from "next/link";

import { registerAction } from "@/actions/auth";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialAuthFormState } from "@/lib/auth/types";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialAuthFormState,
  );

  return (
    <>
      <form
        action={formAction}
        className="grid gap-5"
        aria-describedby={state.message ? "register-status" : undefined}
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby={
              state.errors?.name ? "register-name-error" : undefined
            }
            required
          />
          {state.errors?.name ? (
            <p id="register-name-error" className="text-xs text-destructive">
              {state.errors.name}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="yourname"
            aria-invalid={Boolean(state.errors?.username)}
            aria-describedby={
              state.errors?.username
                ? "register-username-error"
                : "register-username-help"
            }
            required
          />
          {state.errors?.username ? (
            <p id="register-username-error" className="text-xs text-destructive">
              {state.errors.username}
            </p>
          ) : (
            <p
              id="register-username-help"
              className="text-xs leading-5 text-muted-foreground"
            >
              Used for your public devotion profile.
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={
              state.errors?.email ? "register-email-error" : undefined
            }
            required
          />
          {state.errors?.email ? (
            <p id="register-email-error" className="text-xs text-destructive">
              {state.errors.email}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="Create password"
              minLength={8}
              maxLength={72}
              aria-invalid={Boolean(state.errors?.password)}
              aria-describedby={
                state.errors?.password
                  ? "register-password-error"
                  : "register-password-help"
              }
              required
            />
            {state.errors?.password ? (
              <p
                id="register-password-error"
                className="text-xs text-destructive"
              >
                {state.errors.password}
              </p>
            ) : (
              <p
                id="register-password-help"
                className="text-xs leading-5 text-muted-foreground"
              >
                Use at least 8 characters.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <PasswordInput
              id="confirm-password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Repeat password"
              minLength={8}
              maxLength={72}
              showLabel="Show confirmation password"
              hideLabel="Hide confirmation password"
              aria-invalid={Boolean(state.errors?.confirmPassword)}
              aria-describedby={
                state.errors?.confirmPassword
                  ? "register-confirm-password-error"
                  : "register-confirm-password-help"
              }
              required
            />
            {state.errors?.confirmPassword ? (
              <p
                id="register-confirm-password-error"
                className="text-xs text-destructive"
              >
                {state.errors.confirmPassword}
              </p>
            ) : (
              <p
                id="register-confirm-password-help"
                className="text-xs leading-5 text-muted-foreground"
              >
                Enter the same password again.
              </p>
            )}
          </div>
        </div>

        <div className="pt-1">
          <Button type="submit" className="h-11 w-full" disabled={pending}>
            {pending ? "Creating account..." : "Create account"}
          </Button>
          {state.message ? (
            <p
              id="register-status"
              role="alert"
              className="mt-3 text-center text-xs leading-5 text-destructive"
            >
              {state.message}
            </p>
          ) : null}
        </div>
      </form>

      <div className="mt-8 border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}
