import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a Next Devotion account and begin building a daily Scripture practice.",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/feed");
  }

  return (
    <AuthShell
      eyebrow="Create your account"
      title="Begin a daily rhythm."
      description="Create a simple profile for your devotions, your feed, and the reflections you want to keep over time."
    >
      <RegisterForm />
    </AuthShell>
  );
}
