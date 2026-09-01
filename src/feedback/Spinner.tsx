import * as React from "react";
import { cn } from "../lib/cn";
import { SpinnerGlyph } from "./spinner-parts";

export type SpinnerProps = React.ComponentProps<"span"> & {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Optional accessible label. Default `"Loading"`. */
  label?: string;
};

const sizeClasses = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
} as const;

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { className, size = "md", label = "Loading", ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cn("inline-flex", className)}
      {...props}
    >
      <SpinnerGlyph className={sizeClasses[size]} />
    </span>
  );
});

/** Full-screen / panel-fill loading state. Centers a spinner with optional label. */
function LoadingScreen({
  label = "Loading...",
  className,
}: {
  label?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 py-16 text-text-tertiary",
        className,
      )}
    >
      <Spinner size="xl" />
      {label && <span className="text-body-sm">{label}</span>}
    </div>
  );
}

Spinner.displayName = "Spinner";

export { Spinner, LoadingScreen };
