"use client";

import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import { createCommentAction } from "@/actions/comments";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CommentFormState } from "@/lib/comment/types";
import { initialCommentFormState } from "@/lib/comment/types";

type CommentFormProps = {
  devotionId: string;
};

export function CommentForm({ devotionId }: CommentFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const action = createCommentAction.bind(null, devotionId);
  const [state, formAction, pending] = useActionState(
    async (previousState: CommentFormState, data: FormData) => {
      const result = await action(previousState, data);
      if (result.status === "success") setBody("");
      return result;
    },
    initialCommentFormState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      router.replace(`/devotions/${devotionId}#comments`);
    }
  }, [devotionId, router, state.status, state.submissionId]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-3" aria-busy={pending}>
      <Label htmlFor="comment-body">Your comment</Label>
      <Textarea
        id="comment-body"
        name="body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        readOnly={pending}
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
          {pending ? "Posting..." : "Post comment"}
        </Button>
      </div>
    </form>
  );
}
