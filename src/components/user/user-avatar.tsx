import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeClasses = {
  xs: "size-6 text-[9px]",
  sm: "size-8 text-[10px]",
  md: "size-9 text-xs",
  lg: "size-16 text-lg",
  xl: "size-24 text-2xl",
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserAvatar({
  name,
  avatarUrl,
  size = "md",
  className,
}: UserAvatarProps) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary font-semibold text-secondary-foreground",
        sizeClasses[size],
        className,
      )}
      aria-hidden="true"
    >
      {avatarUrl ? (
        <span
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${avatarUrl.replace(/"/g, "%22")}")`,
          }}
        />
      ) : (
        initials(name) || "ND"
      )}
    </span>
  );
}
