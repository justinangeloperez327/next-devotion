export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl space-y-5 text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Next Devotion
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          A quiet place for daily devotion.
        </h1>
        <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          The application foundation is ready. We can build the devotion
          experience from here.
        </p>
      </section>
    </main>
  );
}
