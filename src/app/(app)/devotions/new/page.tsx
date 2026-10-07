import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/app/feature-placeholder";

export const metadata: Metadata = {
  title: "New Devotion",
};

export default function NewDevotionPage() {
  return (
    <FeaturePlaceholder
      eyebrow="New Devotion"
      title="Scripture. Observation. Application. Prayer."
      description="The full SOAP editor arrives in the devotion composer group. The authenticated shell and navigation route are ready for it."
    />
  );
}
