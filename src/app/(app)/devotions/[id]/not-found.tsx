import { AppErrorState } from "@/components/states/app-error-state";

export default function DevotionNotFound() {
  return (
    <AppErrorState
      title="Devotion unavailable."
      description="This devotion does not exist or you do not have permission to view it."
      homeHref="/feed"
      homeLabel="Back to feed"
    />
  );
}
