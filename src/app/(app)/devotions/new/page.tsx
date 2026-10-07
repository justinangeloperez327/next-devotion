import type { Metadata } from "next";

import { createDevotionAction } from "@/actions/devotions";
import { DevotionComposer } from "@/components/devotion/devotion-composer";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "New Devotion",
  description:
    "Write a Scripture, Observation, Application, and Prayer devotion.",
};

export default async function NewDevotionPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <DevotionComposer
        action={createDevotionAction}
        initialValues={{
          scriptureReference: "",
          scriptureText: "",
          observation: "",
          application: "",
          prayer: "",
          visibility: user.defaultDevotionVisibility,
        }}
      />
    </main>
  );
}
