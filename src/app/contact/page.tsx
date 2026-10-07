import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Next Devotion team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />

      <main>
        <section className="border-b border-border">
          <Container className="grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-medium tracking-[0.22em] text-primary uppercase">
                Contact
              </p>
              <h1 className="mt-5 max-w-lg text-balance text-4xl font-medium tracking-[-0.035em] text-foreground sm:text-6xl">
                We would like to hear from you.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
                Use this page for feedback, questions, or ideas about Next
                Devotion. Keep the message simple and we will connect delivery
                once the application backend is in place.
              </p>
            </div>

            <div className="border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              <form className="grid gap-6" aria-describedby="contact-status">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    className="min-h-44"
                    placeholder="Write your message..."
                  />
                </div>

                <div className="flex flex-col items-start gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    id="contact-status"
                    className="max-w-md text-xs leading-5 text-muted-foreground"
                  >
                    Message delivery is not connected yet. The form is ready for
                    the backend integration phase.
                  </p>
                  <Button type="submit" disabled>
                    Send message
                  </Button>
                </div>
              </form>
            </div>
          </Container>
        </section>

        <section>
          <Container className="grid gap-8 py-16 sm:py-20 md:grid-cols-3">
            <div>
              <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
                Feedback
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Tell us what would make the daily devotion experience clearer
                or more useful.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
                Support
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Report an account or application issue once the service is live.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
                Ideas
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Suggest features that support Scripture, reflection, prayer, and
                healthy community.
              </p>
            </div>
          </Container>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
