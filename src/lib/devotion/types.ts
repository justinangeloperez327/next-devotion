import type { DevotionVisibilityValue } from "@/lib/privacy/access";

export type DevotionField =
  | "scriptureReference"
  | "scriptureText"
  | "observation"
  | "application"
  | "prayer"
  | "visibility";

export type DevotionFormState = {
  status: "idle" | "error";
  message?: string;
  errors?: Partial<Record<DevotionField, string>>;
};

export const initialDevotionFormState: DevotionFormState = {
  status: "idle",
};

export type DevotionFormValues = {
  scriptureReference: string;
  scriptureText: string;
  observation: string;
  application: string;
  prayer: string;
  visibility: DevotionVisibilityValue;
};
