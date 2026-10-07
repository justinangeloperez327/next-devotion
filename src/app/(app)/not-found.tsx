import { AppErrorState } from "@/components/states/app-error-state";

export default function AppNotFound() {
  return (
    <AppErrorState
      title="Page not found."
      description="This page does not exist, may have moved, or is no longer available."
      homeHref="/feed"
      homeLabel="Back to feed"
    />
  );
}
