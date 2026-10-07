import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/app/feature-placeholder";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <FeaturePlaceholder
      eyebrow="Settings"
      title="Account and devotion preferences."
      description="Profile editing, account controls, privacy defaults, and future notification preferences will be managed here."
    />
  );
}
