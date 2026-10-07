import { FeaturePlaceholder } from "@/components/app/feature-placeholder";

export default function FeedPage() {
  return (
    <FeaturePlaceholder
      eyebrow="Home feed"
      title="Your devotion community starts here."
      description="The authenticated shell is ready. Group 8 will replace this checkpoint with the Facebook-style devotion feed, composer entry point, Scripture highlights, and community activity."
      actionHref="/devotions/new"
      actionLabel="Write a devotion"
    />
  );
}
