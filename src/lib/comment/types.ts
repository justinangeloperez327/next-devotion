export type CommentFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  error?: string;
};

export const initialCommentFormState: CommentFormState = {
  status: "idle",
};
