import * as React from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { SkeletonBox } from "../feedback/Skeleton";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full bg-gray-100 text-text-tertiary",
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-caption",
        md: "size-10 text-body-sm",
        lg: "size-12 text-body-md",
        xl: "size-16 text-body-lg",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type AvatarProps = Omit<
  React.ComponentProps<typeof RadixAvatar.Root>,
  "asChild"
> &
  VariantProps<typeof avatarVariants> & {
    /** Image URL. */
    src?: string;
    /** Alt text + source for fallback initials when `fallback` is omitted. */
    name?: string;
    /** Custom fallback content (overrides initials). */
    fallback?: React.ReactNode;
    /** ข้อมูลยังมาไม่ถึง — แทนด้วยวงกลมเทาขนาดเท่ากัน */
    isLoading?: boolean;
  };

/** Honorific/title prefixes stripped before computing initials (dots ignored). */
const TITLE_PREFIXES = new Set([
  // Thai medical / academic / honorific
  "นพ", "พญ", "ทพ", "ทพญ", "ภก", "ภกญ", "สพ", "สพญ",
  "ดร", "ผศ", "รศ", "ศ", "นาย", "นาง", "นางสาว", "นส",
  // English
  "mr", "mrs", "ms", "miss", "dr", "prof",
]);

/**
 * Compute up to 2 uppercase initials from a name string.
 * Leading titles (e.g. "นพ.", "พญ.", "Dr.") are skipped, so
 * "นพ. วรวิทย์ ตันสกุล" → "วต" and "Dr. John Smith" → "JS".
 */
function initials(name?: string) {
  if (!name) return "";
  let parts = name.trim().split(/\s+/).filter(Boolean);
  while (
    parts.length > 1 &&
    TITLE_PREFIXES.has(parts[0]!.replace(/\./g, "").toLowerCase())
  ) {
    parts = parts.slice(1);
  }
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { className, size, src, name, fallback, isLoading, ...props },
  ref,
) {
  if (isLoading) {
    return (
      <SkeletonBox
        className={cn(avatarVariants({ size }), "rounded-full", className)}
      />
    );
  }
  return (
    <RadixAvatar.Root
      ref={ref}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {src && (
        <RadixAvatar.Image
          src={src}
          alt={name ?? ""}
          className="size-full object-cover"
        />
      )}
      <RadixAvatar.Fallback
        // undefined (not 0) when no image — renders immediately incl. SSR;
        // 0 would defer to a client timer and skip server-rendered initials
        delayMs={src ? 200 : undefined}
        className="flex size-full items-center justify-center font-semibold"
      >
        {fallback ?? initials(name)}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
});

export { Avatar, avatarVariants };
