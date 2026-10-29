import Link from "next/link";
import { MessageCircle, ArrowUpRight } from "lucide-react";

import { devotionPreview } from "@/lib/devotion/preview";
import { AmenButton } from "@/components/feed/amen-button";
import { SaveDevotionButton } from "@/components/feed/save-devotion-button";
import { UserAvatar } from "@/components/user/user-avatar";

type DevotionCardProps = {
  id: string;
  preview?: boolean;
  author: {
    name: string;
    username: string;
    avatarUrl?: string | null;
  };
  time: string;
  scriptureReference: string;
  scriptureText?: string | null;
  observation: string;
  application: string;
  prayer: string;
  amenCount: number;
  commentCount: number;
  hasAmen?: boolean;
  canAmen?: boolean;
  isSaved?: boolean;
  canSave?: boolean;
};

function DevotionSection({
  label,
  children,
}: {
  label: string;
  children: string;
}) {
  return (
    <section>
      <h3 className="text-xs font-medium text-muted-foreground">
        {label}
      </h3>
      <p className="mt-2 reading-content whitespace-pre-line text-base leading-7 text-foreground">
        {children}
      </p>
    </section>
  );
}

export function DevotionCard({
  id,
  preview = true,
  author,
  time,
  scriptureReference,
  scriptureText,
  observation,
  application,
  prayer,
  amenCount,
  commentCount,
  hasAmen = false,
  canAmen = true,
  isSaved = false,
  canSave = true,
}: DevotionCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card">
      <header className="flex items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
        <Link
          href={`/profile/${author.username}`}
          aria-label={`View ${author.name}'s profile`}
        >
          <UserAvatar name={author.name} avatarUrl={author.avatarUrl} />
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/profile/${author.username}`}
            className="block truncate text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            {author.name}
          </Link>
          <p className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
            <span className="max-w-[10rem] truncate">@{author.username}</span>
            <span aria-hidden="true">·</span>
            <Link
              href={`/devotions/${id}`}
              className="shrink-0 transition-colors hover:text-foreground"
            >
              {time}
            </Link>
          </p>
        </div>


      </header>

      <div className="px-4 pb-5 pt-5 sm:px-5">
        <div className="border-l-2 border-primary/70 pl-4">
          <Link
            href={`/devotions/${id}`}
            className="text-xs font-medium text-primary transition-colors hover:underline"
          >
            {scriptureReference}
          </Link>
          {scriptureText ? (
            <blockquote className="reading-content scripture mt-3 text-xl leading-8 text-foreground sm:text-[22px]">
              “{preview ? devotionPreview(scriptureText, 300) : scriptureText}”
            </blockquote>
          ) : null}
        </div>

        <div className="mt-6 space-y-5">
          <DevotionSection label="Observation">{preview ? devotionPreview(observation, 240) : observation}</DevotionSection>
          <DevotionSection label="Application">{preview ? devotionPreview(application, 180) : application}</DevotionSection>
          <DevotionSection label="Prayer">{preview ? devotionPreview(prayer, 180) : prayer}</DevotionSection>
        </div>
        {preview ? (
          <Link href={`/devotions/${id}`} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline">
            Read devotion <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      <footer className="grid grid-cols-3 border-t border-border">
        <AmenButton
          devotionId={id}
          initialHasAmen={hasAmen}
          initialAmenCount={amenCount}
          disabled={!canAmen}
        />
        <Link
          href={`/devotions/${id}#comments`}
          aria-label={`View ${commentCount} ${commentCount === 1 ? "comment" : "comments"}`}
          className="flex h-12 min-w-0 items-center justify-center gap-1.5 border-l border-border px-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:h-11 sm:gap-2"
        >
          <MessageCircle className="size-4" />
          <span>Comments</span>
          <span>{commentCount}</span>
        </Link>
        <SaveDevotionButton
          devotionId={id}
          initialSaved={isSaved}
          disabled={!canSave}
        />
      </footer>
    </article>
  );
}
