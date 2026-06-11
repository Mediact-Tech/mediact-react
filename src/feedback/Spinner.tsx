import * as React from "react";
import { cn } from "../lib/cn";

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
      <svg
        className={cn("animate-spin text-current", sizeClasses[size])}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.25"
        />
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
        />
      </svg>
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
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

Spinner.displayName = "Spinner";

export { Spinner, LoadingScreen };
