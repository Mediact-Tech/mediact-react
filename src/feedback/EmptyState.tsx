import * as React from "react";
import { cn } from "../lib/cn";

export type EmptyStateProps = React.ComponentProps<"div"> & {
  /** Icon / illustration shown in the colored circle. Caller controls size + color
   * (e.g. `<Calendar className="size-15 text-info-blue-primary" />`). */
  icon?: React.ReactNode;
  title?: React.ReactNode;
  /** Body message — accepts strings or rich content. */
  description?: React.ReactNode;
  /** Action(s) — typically a `<Button>` or pair of buttons. */
  action?: React.ReactNode;
  /** Background tone of the icon circle. Default `info`. Set to `none` to
   * skip the wrapper entirely (caller renders their own illustration). */
  iconTone?: "info" | "success" | "warning" | "danger" | "neutral" | "none";
};

const toneBg: Record<NonNullable<EmptyStateProps["iconTone"]>, string> = {
  info: "bg-info-blue-50",
  success: "bg-success-green-50",
  warning: "bg-warning-yellow-50",
  danger: "bg-cherry-red-50",
  neutral: "bg-gray-100",
  none: "",
};

function EmptyState({
  icon,
  title,
  description,
  action,
  iconTone = "info",
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex w-full justify-center p-3",
        className,
      )}
      {...props}
    >
      <div className="w-full max-w-[600px] rounded-xl bg-white p-8 text-center">
        {icon && (
          <div className="mb-6 flex justify-center">
            {iconTone === "none" ? (
              icon
            ) : (
              <div
                className={cn(
                  "inline-flex items-center justify-center rounded-full p-6",
                  toneBg[iconTone],
                )}
              >
                {icon}
              </div>
            )}
          </div>
        )}
        {title && (
          <h2 className="mb-4 text-xl font-semibold leading-tight text-text-primary sm:text-2xl">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-base leading-[1.7] text-text-tertiary">
            {description}
          </p>
        )}
        {action && <div className="mt-8 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

export { EmptyState };
