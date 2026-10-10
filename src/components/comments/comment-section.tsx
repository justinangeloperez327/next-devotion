import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle, Trash2 } from "lucide-react";

import { deleteCommentAction } from "@/actions/comments";
import { CommentForm } from "@/components/comments/comment-form";
import { EmptyState } from "@/components/states/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { UserAvatar } from "@/components/user/user-avatar";
import { formatRelativeDate } from "@/lib/date";
import { cn } from "@/lib/utils";

type CommentItem = {
  id: string;
  userId: string;
  body: string;
  createdAt: Date;
  user: {
    name: string;
    username: string;
    avatarUrl?: string | null;
  };
};

type CommentSectionProps = {
  devotionId: string;
  currentUserId: string;
  comments: CommentItem[];
  totalCount: number;
  newerCursor?: string;
  olderCursor?: string;
};

export function CommentSection({
  devotionId,
  currentUserId,
  comments,
  totalCount,
  newerCursor,
  olderCursor,
}: CommentSectionProps) {
  const latestHref = `/devotions/${devotionId}#comments`;

  return (
    <section
      id="comments"
      className="mt-6 scroll-mt-24 rounded-lg border border-border bg-card"
      aria-labelledby="comments-heading"
    >
      <div className="border-b border-border px-4 py-5 sm:px-5">
        <div className="flex items-center gap-2">
          <MessageCircle className="size-4 text-primary" />
          <h2
            id="comments-heading"
            className="text-sm font-medium text-foreground"
          >
            Comments
          </h2>
          <span className="text-xs text-muted-foreground">{totalCount}</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Add context, encouragement, or a question that helps the reflection
          go deeper.
        </p>
      </div>

      <div className="border-b border-border p-4 sm:p-5">
        <CommentForm devotionId={devotionId} />
      </div>

      {comments.length > 0 ? (
        <>
          <div className="divide-y divide-border">
            {comments.map((comment) => {
              const canDelete = comment.userId === currentUserId;
              const deleteAction = deleteCommentAction.bind(
                null,
                comment.id,
                devotionId,
              );

              return (
                <article key={comment.id} className="flex gap-3 px-4 py-5 sm:px-5">
                  <Link
                    href={`/profile/${comment.user.username}`}
                    aria-label={`View ${comment.user.name}'s profile`}
                  >
                    <UserAvatar
                      name={comment.user.name}
                      avatarUrl={comment.user.avatarUrl}
                      size="sm"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <Link
                        href={`/profile/${comment.user.username}`}
                        className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {comment.user.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        @{comment.user.username}
                      </span>
                      <span className="text-border" aria-hidden="true">
                        ·
                      </span>
                      <time className="text-xs text-muted-foreground">
                        {formatRelativeDate(comment.createdAt)}
                      </time>
                    </div>

                    <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-foreground/90">
                      {comment.body}
                    </p>
                  </div>

                  {canDelete ? (
                    <details className="relative shrink-0">
                      <summary
                        className="flex size-10 cursor-pointer list-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-destructive sm:size-8 [&::-webkit-details-marker]:hidden"
                        aria-label="Delete comment"
                      >
                        <Trash2 className="size-3.5" />
                      </summary>

                      <div className="absolute right-0 z-20 mt-2 w-[min(16rem,calc(100vw-2rem))] rounded-lg border border-border bg-popover p-4 shadow-lg shadow-black/20">
                        <p className="text-sm font-medium text-foreground">
                          Delete this comment?
                        </p>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">
                          This cannot be undone.
                        </p>
                        <form action={deleteAction} className="mt-4">
                          <button
                            type="submit"
                            className={cn(
                              buttonVariants({
                                variant: "destructive",
                                size: "sm",
                              }),
                              "w-full",
                            )}
                          >
                            Delete comment
                          </button>
                        </form>
                      </div>
                    </details>
                  ) : null}
                </article>
              );
            })}
          </div>

          {newerCursor || olderCursor ? (
            <nav
              className="flex items-center justify-between gap-3 border-t border-border px-4 py-4 sm:px-5"
              aria-label="Comment pages"
            >
              {olderCursor ? (
                <Link
                  href={`/devotions/${devotionId}?commentsAfter=${encodeURIComponent(olderCursor)}#comments`}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "gap-2",
                  )}
                >
                  <ArrowLeft className="size-3.5" />
                  Earlier
                </Link>
              ) : (
                <span />
              )}

              {newerCursor ? (
                <Link
                  href={`/devotions/${devotionId}?commentsBefore=${encodeURIComponent(newerCursor)}#comments`}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "gap-2",
                  )}
                >
                  Later
                  <ArrowRight className="size-3.5" />
                </Link>
              ) : null}
            </nav>
          ) : null}
        </>
      ) : (
        <EmptyState
          compact
          title={
            totalCount === 0
              ? "No comments yet."
              : "No comments on this page."
          }
          description={
            totalCount === 0
              ? "Be the first to add to this reflection."
              : "The conversation may have changed since this page was opened."
          }
          actionHref={totalCount === 0 ? undefined : latestHref}
          actionLabel={totalCount === 0 ? undefined : "Return to latest"}
        />
      )}
    </section>
  );
}
