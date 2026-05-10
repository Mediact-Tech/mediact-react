import * as React from "react";
import { cn } from "../lib/cn";

export type SkeletonProps = React.ComponentProps<"div"> & {
  /** Shape preset. `text` defaults to a 1em-height bar. `circle` is square + rounded-full. */
  shape?: "rect" | "text" | "circle";
};

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ className, shape = "rect", style, ...props }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "animate-pulse bg-gray-200/80",
          shape === "rect" && "rounded-sm",
          shape === "text" && "h-4 rounded-sm",
          shape === "circle" && "rounded-full",
          className,
        )}
        style={style}
        {...props}
      />
    );
  },
);

export { Skeleton };
