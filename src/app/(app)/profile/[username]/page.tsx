import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/app/feature-placeholder";

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `@${username}`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  return (
    <FeaturePlaceholder
      eyebrow={`@${username}`}
      title="Devotion profile."
      description="The profile will bring together the user's public devotions, bio, activity, and community connections in a focused reading layout."
    />
  );
}
