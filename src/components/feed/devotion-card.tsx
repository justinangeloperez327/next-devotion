import Link from "next/link";
import { Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react";

type DevotionCardProps = {
  id: string;
  author: {
    name: string;
    username: string;
  };
  time: string;
  scriptureReference: string;
  scriptureText?: string | null;
  observation: string;
  application: string;
  prayer: string;
  amenCount: number;
  commentCount: number;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function DevotionSection({
  label,
  children,
}: {
  label: string;
  children: string;
}) {
  return (
    <section>
      <h3 className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-foreground/90 sm:text-[15px]">
        {children}
      </p>
    </section>
  );
}

export function DevotionCard({
  id,
  author,
  time,
  scriptureReference,
  scriptureText,
  observation,
  application,
  prayer,
  amenCount,
  commentCount,
}: DevotionCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card">
      <header className="flex items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
        <Link
          href={`/profile/${author.username}`}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground"
          aria-label={`View ${author.name}'s profile`}
        >
          {initials(author.name) || "ND"}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/profile/${author.username}`}
            className="truncate text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            {author.name}
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">
            @{author.username} ·{" "}
            <Link
              href={`/devotions/${id}`}
              className="transition-colors hover:text-foreground"
            >
              {time}
            </Link>
          </p>
        </div>

        <Link
          href={`/devotions/${id}`}
          aria-label="View devotion"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <MoreHorizontal className="size-4" />
        </Link>
      </header>

      <div className="px-4 pb-5 pt-5 sm:px-5">
        <div className="border-l-2 border-primary/70 pl-4">
          <Link
            href={`/devotions/${id}`}
            className="text-xs font-medium tracking-[0.16em] text-primary uppercase transition-colors hover:text-primary/80"
          >
            {scriptureReference}
          </Link>
          {scriptureText ? (
            <blockquote className="scripture mt-3 text-xl leading-8 text-foreground sm:text-[22px]">
              “{scriptureText}”
            </blockquote>
          ) : null}
        </div>

        <div className="mt-7 space-y-7">
          <DevotionSection label="Observation">{observation}</DevotionSection>
          <DevotionSection label="Application">{application}</DevotionSection>
          <DevotionSection label="Prayer">{prayer}</DevotionSection>
        </div>
      </div>

      <footer className="grid grid-cols-3 border-t border-border">
        <div className="flex h-11 items-center justify-center gap-2 text-xs text-muted-foreground">
          <Heart className="size-4 text-devotion-sage" />
          <span>Amen</span>
          <span>{amenCount}</span>
        </div>
        <div className="flex h-11 items-center justify-center gap-2 border-l border-border text-xs text-muted-foreground">
          <MessageCircle className="size-4" />
          <span className="hidden sm:inline">Comments</span>
          <span>{commentCount}</span>
        </div>
        <div className="flex h-11 items-center justify-center gap-2 border-l border-border text-xs text-muted-foreground">
          <Bookmark className="size-4" />
          <span>Save</span>
        </div>
      </footer>
    </article>
  );
}
