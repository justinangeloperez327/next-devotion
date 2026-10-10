export type CommentFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  error?: string;
  submissionId?: number;
};

export const initialCommentFormState: CommentFormState = {
  status: "idle",
};
