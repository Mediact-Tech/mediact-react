import * as React from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full bg-gray-100 text-text-tertiary",
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-12 text-base",
        xl: "size-16 text-lg",
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
  };

/** Compute up to 2 uppercase initials from a name string. */
function initials(name?: string) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { className, size, src, name, fallback, ...props },
  ref,
) {
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
        delayMs={src ? 200 : 0}
        className="flex size-full items-center justify-center font-semibold"
      >
        {fallback ?? initials(name)}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
});

export { Avatar, avatarVariants };
