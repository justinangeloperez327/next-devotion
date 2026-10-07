import { AppErrorState } from "@/components/states/app-error-state";

export default function ProfileNotFound() {
  return (
    <AppErrorState
      title="Profile not found."
      description="This profile does not exist or is no longer available."
      homeHref="/feed"
      homeLabel="Back to feed"
    />
  );
}
