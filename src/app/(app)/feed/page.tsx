import { logoutAction } from "@/actions/auth";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";

export default async function FeedPage() {
  const user = await requireUser();

  return (
    <main className="min-h-svh bg-background">
      <Container className="py-16">
        <div className="mx-auto max-w-2xl border-y border-border py-10">
          <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
            Authentication ready
          </p>
          <h1 className="mt-4 text-3xl font-medium tracking-[-0.025em] text-foreground">
            Welcome, {user.name}.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Your account and database session are active. The full social
            devotion feed and authenticated application shell arrive in the
            next implementation group.
          </p>

          <form action={logoutAction} className="mt-8">
            <Button type="submit" variant="secondary">
              Log out
            </Button>
          </form>
        </div>
      </Container>
    </main>
  );
}
