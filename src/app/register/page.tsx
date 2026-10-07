import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a Next Devotion account and begin building a daily Scripture practice.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Create your account"
      title="Begin a daily rhythm."
      description="Create a simple profile for your devotions, your feed, and the reflections you want to keep over time."
    >
      <form className="grid gap-5" aria-describedby="register-status">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            required
          />
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
            required
          />
          <p className="text-xs leading-5 text-muted-foreground">
            This will identify your public devotion profile.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create password"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat password"
              required
            />
          </div>
        </div>

        <div className="pt-1">
          <Button type="submit" className="h-10 w-full" disabled>
            Create account
          </Button>
          <p
            id="register-status"
            className="mt-3 text-center text-xs leading-5 text-muted-foreground"
          >
            Account creation will be enabled when authentication is connected
            in Group 6.
          </p>
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
    </AuthShell>
  );
}
