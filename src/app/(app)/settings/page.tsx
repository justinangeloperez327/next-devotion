import type { Metadata } from "next";

import { ThemeControl } from "@/components/theme/theme-control";
import { ProfileSettingsForm } from "@/components/profile/profile-settings-form";
import { PrivacySettingsForm } from "@/components/settings/privacy-settings-form";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="border-b border-border pb-7">
        <p className="text-xs font-medium text-primary">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-medium tracking-[-0.025em] text-foreground">
          Settings
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Manage your public profile and default devotion privacy.
        </p>
      </div>

      <section className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-6" aria-labelledby="appearance-heading">
        <div><h2 id="appearance-heading" className="text-base font-medium">Appearance</h2><p className="mt-1 text-sm text-muted-foreground">Choose a theme for this browser, or follow your device.</p></div>
        <ThemeControl compact={false} />
      </section>

      <section className="py-7" aria-labelledby="profile-settings-heading">
        <div className="mb-6">
          <h2 id="profile-settings-heading" className="text-base font-medium text-foreground">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Manage the identity shown beside your devotions and comments.
          </p>
        </div>
        <ProfileSettingsForm
          user={{
            name: user.name,
            username: user.username,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
          }}
        />
      </section>

      <section
        className="border-t border-border py-7"
        aria-labelledby="privacy-settings-heading"
      >
        <div className="mb-6">
          <h2
            id="privacy-settings-heading"
            className="text-base font-medium text-foreground"
          >
            Privacy
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Choose the default visibility for new devotions.
          </p>
        </div>
        <PrivacySettingsForm
          defaultVisibility={user.defaultDevotionVisibility}
        />
      </section>
    </main>
  );
}
