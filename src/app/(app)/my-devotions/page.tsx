import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/app/feature-placeholder";

export const metadata: Metadata = {
  title: "My Devotions",
};

export default function MyDevotionsPage() {
  return (
    <FeaturePlaceholder
      eyebrow="My Devotions"
      title="Your personal devotion journal."
      description="This page will become the searchable history of everything you have written, including private and shared devotions."
      actionHref="/devotions/new"
      actionLabel="Write a devotion"
    />
  );
}
