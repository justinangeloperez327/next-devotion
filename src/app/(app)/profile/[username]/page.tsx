import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DevotionCard } from "@/components/feed/devotion-card";
import { ProfileHeader } from "@/components/profile/profile-header";
import { EmptyState } from "@/components/states/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { formatRelativeDate } from "@/lib/date";
import { getPrisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `@${username}`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const viewer = await requireUser();
  const { username } = await params;
  const database = getPrisma();

  const profile = await database.user.findUnique({
    where: {
      username: username.toLowerCase(),
    },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  if (!profile) {
    notFound();
  }

  const [devotions, devotionCount, amenCount, commentCount] = await Promise.all([
    database.devotion.findMany({
      where: {
        userId: profile.id,
        visibility: "PUBLIC",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      select: {
        id: true,
        scriptureReference: true,
        scriptureText: true,
        observation: true,
        application: true,
        prayer: true,
        createdAt: true,
        amens: {
          where: {
            userId: viewer.id,
          },
          select: {
            userId: true,
          },
          take: 1,
        },
        savedBy: {
          where: {
            userId: viewer.id,
          },
          select: {
            userId: true,
          },
          take: 1,
        },
        _count: {
          select: {
            amens: true,
            comments: true,
          },
        },
      },
    }),
    database.devotion.count({
      where: {
        userId: profile.id,
        visibility: "PUBLIC",
      },
    }),
    database.amen.count({
      where: {
        devotion: {
          is: {
            userId: profile.id,
            visibility: "PUBLIC",
          },
        },
      },
    }),
    database.comment.count({
      where: {
        devotion: {
          is: {
            userId: profile.id,
            visibility: "PUBLIC",
          },
        },
      },
    }),
  ]);

  const isOwner = viewer.id === profile.id;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ProfileHeader
        profile={profile}
        isOwner={isOwner}
        stats={{
          devotions: devotionCount,
          amens: amenCount,
          comments: commentCount,
        }}
      />

      <section className="pt-8" aria-labelledby="profile-devotions-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Public journal
            </p>
            <h2
              id="profile-devotions-heading"
              className="mt-2 text-xl font-medium text-foreground"
            >
              Recent devotions
            </h2>
          </div>

          {isOwner ? (
            <Link
              href="/my-devotions"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "shrink-0",
              )}
            >
              View all
            </Link>
          ) : null}
        </div>

        {devotions.length > 0 ? (
          <div className="mt-5 space-y-5">
            {devotions.map((devotion) => (
              <DevotionCard
                key={devotion.id}
                id={devotion.id}
                author={{
                  name: profile.name,
                  username: profile.username,
                  avatarUrl: profile.avatarUrl,
                }}
                time={formatRelativeDate(devotion.createdAt)}
                scriptureReference={devotion.scriptureReference}
                scriptureText={devotion.scriptureText}
                observation={devotion.observation}
                application={devotion.application}
                prayer={devotion.prayer}
                amenCount={devotion._count.amens}
                commentCount={devotion._count.comments}
                hasAmen={devotion.amens.length > 0}
                isSaved={devotion.savedBy.length > 0}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-5"
            title="No public devotions yet."
            description={
              isOwner
                ? "Your private journal remains private. Share a devotion publicly when you want it to appear here."
                : "This person has not shared a public devotion yet."
            }
            actionHref={isOwner ? "/devotions/new" : undefined}
            actionLabel={isOwner ? "Write devotion" : undefined}
          />
        )}

        {devotionCount > devotions.length ? (
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Showing the 20 most recent public devotions.
          </p>
        ) : null}
      </section>
    </main>
  );
}
