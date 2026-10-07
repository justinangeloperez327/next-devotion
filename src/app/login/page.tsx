import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Next Devotion and continue your daily practice.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Continue your devotion."
      description="Log in to return to your feed, your saved reflections, and the daily practice you are building."
    >
      <form className="grid gap-5" aria-describedby="login-status">
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

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <span className="text-xs text-muted-foreground">
              Password recovery comes with authentication.
            </span>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="pt-1">
          <Button type="submit" className="h-10 w-full" disabled>
            Log in
          </Button>
          <p
            id="login-status"
            className="mt-3 text-center text-xs leading-5 text-muted-foreground"
          >
            Login will be enabled when authentication is connected in Group 6.
          </p>
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
    </AuthShell>
  );
}
