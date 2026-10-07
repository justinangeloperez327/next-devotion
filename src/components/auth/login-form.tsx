"use client";

import { useActionState } from "react";
import Link from "next/link";

import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialAuthFormState } from "@/lib/auth/types";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialAuthFormState,
  );

  return (
    <>
      <form
        action={formAction}
        className="grid gap-5"
        aria-describedby={state.message ? "login-status" : undefined}
      >
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={state.errors?.email ? "login-email-error" : undefined}
            required
          />
          {state.errors?.email ? (
            <p id="login-email-error" className="text-xs text-destructive">
              {state.errors.email}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={Boolean(state.errors?.password)}
            aria-describedby={
              state.errors?.password ? "login-password-error" : undefined
            }
            required
          />
          {state.errors?.password ? (
            <p id="login-password-error" className="text-xs text-destructive">
              {state.errors.password}
            </p>
          ) : null}
        </div>

        <div className="pt-1">
          <Button type="submit" className="h-11 w-full" disabled={pending}>
            {pending ? "Logging in..." : "Log in"}
          </Button>
          {state.message ? (
            <p
              id="login-status"
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
          New to Next Devotion?{" "}
          <Link
            href="/register"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Create an account
          </Link>
        </p>
      </div>
    </>
  );
}
