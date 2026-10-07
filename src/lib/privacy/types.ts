export type PrivacyFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const initialPrivacyFormState: PrivacyFormState = {
  status: "idle",
};
