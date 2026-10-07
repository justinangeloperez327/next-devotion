export type ProfileFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: {
    name?: string;
    bio?: string;
    avatarUrl?: string;
  };
};

export const initialProfileFormState: ProfileFormState = {
  status: "idle",
};
