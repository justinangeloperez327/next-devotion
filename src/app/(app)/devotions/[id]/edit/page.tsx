import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { updateDevotionAction } from "@/actions/devotions";
import { DevotionComposer } from "@/components/devotion/devotion-composer";
import { requireUser } from "@/lib/auth/session";
import { isUuid } from "@/lib/id";
import { getPrisma } from "@/lib/prisma";

type EditDevotionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Edit Devotion",
};

export default async function EditDevotionPage({
  params,
}: EditDevotionPageProps) {
  const user = await requireUser();
  const { id } = await params;

  if (!isUuid(id)) {
    notFound();
  }

  const database = getPrisma();

  const devotion = await database.devotion.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
      scriptureReference: true,
      scriptureText: true,
      observation: true,
      application: true,
      prayer: true,
      visibility: true,
    },
  });

  if (!devotion) {
    notFound();
  }

  const action = updateDevotionAction.bind(null, devotion.id);

  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <DevotionComposer
        action={action}
        mode="edit"
        initialValues={{
          scriptureReference: devotion.scriptureReference,
          scriptureText: devotion.scriptureText ?? "",
          observation: devotion.observation,
          application: devotion.application,
          prayer: devotion.prayer,
          visibility: devotion.visibility,
        }}
      />
    </main>
  );
}
