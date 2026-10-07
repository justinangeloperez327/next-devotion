import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/app/feature-placeholder";

export const metadata: Metadata = {
  title: "Saved Devotions",
};

export default function SavedPage() {
  return (
    <FeaturePlaceholder
      eyebrow="Saved"
      title="Keep the devotions you want to return to."
      description="Saved community devotions will live here once bookmarking is implemented."
    />
  );
}
