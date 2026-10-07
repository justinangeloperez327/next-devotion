import type { Metadata } from "next";

import { DevotionComposer } from "@/components/devotion/devotion-composer";

export const metadata: Metadata = {
  title: "New Devotion",
  description:
    "Write a Scripture, Observation, Application, and Prayer devotion.",
};

export default function NewDevotionPage() {
  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <DevotionComposer />
    </main>
  );
}
