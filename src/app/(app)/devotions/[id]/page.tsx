import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Globe2, Lock } from "lucide-react";

import { DevotionOwnerActions } from "@/components/devotion/devotion-owner-actions";
import { DevotionCard } from "@/components/feed/devotion-card";
import { requireUser } from "@/lib/auth/session";
import { formatRelativeDate } from "@/lib/date";
import { getPrisma } from "@/lib/prisma";

type DevotionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: DevotionPageProps): Promise<Metadata> {
  const { id } = await params;
  const database = getPrisma();

  const devotion = await database.devotion.findUnique({
    where: {
      id,
    },
    select: {
      scriptureReference: true,
    },
  });

  return {
    title: devotion?.scriptureReference ?? "Devotion",
  };
}

export default async function DevotionPage({ params }: DevotionPageProps) {
  const user = await requireUser();
  const { id } = await params;
  const database = getPrisma();

  const devotion = await database.devotion.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      userId: true,
      scriptureReference: true,
      scriptureText: true,
      observation: true,
      application: true,
      prayer: true,
      visibility: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          username: true,
        },
      },
      _count: {
        select: {
          amens: true,
          comments: true,
        },
      },
    },
  });

  if (!devotion) {
    notFound();
  }

  const isOwner = devotion.userId === user.id;

  if (devotion.visibility === "PRIVATE" && !isOwner) {
    notFound();
  }

  const VisibilityIcon = devotion.visibility === "PUBLIC" ? Globe2 : Lock;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <VisibilityIcon className="size-3.5" />
          <span>
            {devotion.visibility === "PUBLIC"
              ? "Shared with the community"
              : "Private devotion"}
          </span>
        </div>

        {isOwner ? <DevotionOwnerActions devotionId={devotion.id} /> : null}
      </div>

      <DevotionCard
        id={devotion.id}
        author={devotion.user}
        time={formatRelativeDate(devotion.createdAt)}
        scriptureReference={devotion.scriptureReference}
        scriptureText={devotion.scriptureText}
        observation={devotion.observation}
        application={devotion.application}
        prayer={devotion.prayer}
        amenCount={devotion._count.amens}
        commentCount={devotion._count.comments}
      />
    </main>
  );
}
