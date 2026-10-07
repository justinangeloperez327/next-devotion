import type { Metadata } from "next";

import { DevotionCard } from "@/components/feed/devotion-card";
import { FeedComposer } from "@/components/feed/feed-composer";
import { FeedSidebar } from "@/components/feed/feed-sidebar";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Home Feed",
};

const sampleDevotions = [
  {
    author: {
      name: "Mara Santos",
      username: "maras",
    },
    time: "18 min ago",
    scriptureReference: "John 15:5",
    scriptureText:
      "I am the vine; you are the branches. Whoever abides in me and I in him, he it is that bears much fruit.",
    observation:
      "I keep wanting visible progress before I trust that God is working. This passage brings me back to dependence. Fruit comes from remaining connected, not from forcing results.",
    application:
      "Before I open work messages tomorrow, I will spend ten quiet minutes in Scripture and prayer instead of immediately reacting to everything waiting for me.",
    prayer:
      "Lord, teach me to remain in You when I feel rushed. Help me value closeness with You more than visible productivity.",
    amenCount: 18,
    commentCount: 4,
  },
  {
    author: {
      name: "Elias Cruz",
      username: "eliasc",
    },
    time: "1 hr ago",
    scriptureReference: "Lamentations 3:22-23",
    scriptureText:
      "The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning.",
    observation:
      "A new day does not mean yesterday disappeared, but it does mean yesterday does not get the final word. Mercy meets me again before I have achieved anything.",
    application:
      "I will stop carrying one mistake from yesterday into every conversation today. I can own it, learn from it, and still receive fresh mercy.",
    prayer:
      "God, thank You that Your mercy is not exhausted by my weakness. Give me grace to extend that same patience to other people today.",
    amenCount: 31,
    commentCount: 7,
  },
  {
    author: {
      name: "Naomi Reyes",
      username: "naomir",
    },
    time: "3 hr ago",
    scriptureReference: "Proverbs 27:17",
    scriptureText:
      "Iron sharpens iron, and one man sharpens another.",
    observation:
      "Growth is personal, but it is not meant to be isolated. The right people can challenge my blind spots without competing with me.",
    application:
      "I will ask one trusted friend a direct question about an area where I know I need accountability instead of keeping the struggle private.",
    prayer:
      "Lord, give me humility to receive correction and wisdom to be the kind of friend who strengthens others with grace.",
    amenCount: 24,
    commentCount: 6,
  },
];

export default async function FeedPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,720px)_300px] xl:justify-center">
        <div className="min-w-0 space-y-5">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
              Home Feed
            </p>
            <h1 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl">
              Good to see you, {user.name.split(" ")[0]}.
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Read slowly. Share honestly. Encourage what is worth carrying forward.
            </p>
          </div>

          <FeedComposer name={user.name} />

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Recent devotions
            </p>
            <p className="text-xs text-muted-foreground">
              Sample feed · data connection comes later
            </p>
          </div>

          <div className="space-y-5">
            {sampleDevotions.map((devotion) => (
              <DevotionCard
                key={`${devotion.author.username}-${devotion.scriptureReference}`}
                {...devotion}
              />
            ))}
          </div>
        </div>

        <div className="hidden xl:block">
          <div className="sticky top-20">
            <FeedSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
