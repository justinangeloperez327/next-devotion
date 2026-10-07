export type AuthField =
  | "name"
  | "username"
  | "email"
  | "password"
  | "confirmPassword";

export type AuthFormState = {
  status: "idle" | "error";
  message?: string;
  errors?: Partial<Record<AuthField, string>>;
};

export const initialAuthFormState: AuthFormState = {
  status: "idle",
};
