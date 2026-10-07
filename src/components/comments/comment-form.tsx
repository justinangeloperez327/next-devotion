"use client";

import { Send } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

import { createCommentAction } from "@/actions/comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { initialCommentFormState } from "@/lib/comment/types";

type CommentFormProps = {
  devotionId: string;
};

export function CommentForm({ devotionId }: CommentFormProps) {
  const action = createCommentAction.bind(null, devotionId);
  const [state, formAction, pending] = useActionState(
    action,
    initialCommentFormState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-3">
      <Textarea
        id="comment-body"
        name="body"
        aria-label="Comment"
        maxLength={2000}
        placeholder="Add to the reflection..."
        className="min-h-24 resize-y bg-background"
        aria-invalid={Boolean(state.error)}
        aria-describedby={
          state.error || state.message ? "comment-form-status" : undefined
        }
        required
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          id="comment-form-status"
          className={
            state.status === "error"
              ? "text-xs text-destructive"
              : "text-xs text-muted-foreground"
          }
          role={state.status === "error" ? "alert" : "status"}
          aria-live="polite"
          aria-atomic="true"
        >
          {state.error ??
            state.message ??
            "Keep the conversation thoughtful, relevant, and encouraging."}
        </p>

        <Button type="submit" size="sm" disabled={pending} className="w-full gap-2 sm:w-auto">
          <Send className="size-3.5" />
          {pending ? "Posting..." : "Comment"}
        </Button>
      </div>
    </form>
  );
}
