import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Next Devotion and continue your daily practice.",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/feed");
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Continue your devotion."
      description="Log in to return to your feed, your saved reflections, and the daily practice you are building."
    >
      <LoginForm />
    </AuthShell>
  );
}
