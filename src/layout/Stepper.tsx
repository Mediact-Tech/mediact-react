import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

export type StepperStep = {
  label: React.ReactNode;
  description?: React.ReactNode;
};

export type StepperProps = {
  steps: StepperStep[];
  /** Zero-based index of the current (active) step. Steps before are "done". */
  current: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
  /** Allow click on completed/active steps to navigate. */
  onStepClick?: (index: number) => void;
};

function Stepper({
  steps,
  current,
  orientation = "horizontal",
  className,
  onStepClick,
}: StepperProps) {
  const isVertical = orientation === "vertical";
  return (
    <ol
      className={cn(
        "flex",
        isVertical ? "flex-col gap-4" : "items-center gap-3",
        className,
      )}
    >
      {steps.map((step, i) => {
        const status: "done" | "active" | "todo" =
          i < current ? "done" : i === current ? "active" : "todo";
        const isLast = i === steps.length - 1;
        const clickable = onStepClick && status !== "todo";
        const showCheck = status === "done" || status === "active";

        const circle = (
          <div
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
              status === "todo"
                ? "bg-gray-200 text-text-tertiary"
                : "bg-brand-active text-white",
            )}
          >
            {showCheck ? <Check className="size-4" strokeWidth={3} /> : i + 1}
          </div>
        );

        return (
          <li
            key={i}
            className={cn(
              "flex",
              isVertical ? "items-start gap-3" : "items-center gap-2",
              !isVertical && !isLast && "flex-1",
            )}
          >
            <div
              className={cn(
                "flex",
                isVertical ? "flex-col items-center" : "items-center gap-2",
              )}
            >
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick?.(i)}
                  className="rounded-full focus:outline-none focus:ring-2 focus:ring-brand-active/40"
                >
                  {circle}
                </button>
              ) : (
                circle
              )}
              {isVertical && !isLast && (
                <div
                  className={cn(
                    "mt-1 w-px flex-1 min-h-6",
                    status === "done" ? "bg-brand-active" : "bg-border-default",
                  )}
                />
              )}
              {!isVertical && (
                <div
                  className={cn(
                    "text-sm",
                    status === "todo"
                      ? "text-text-tertiary font-normal"
                      : "text-text-primary font-semibold",
                  )}
                >
                  {step.label}
                  {step.description && (
                    <div className="text-xs font-normal text-text-tertiary">
                      {step.description}
                    </div>
                  )}
                </div>
              )}
            </div>

            {isVertical && (
              <div className="min-w-0 pb-4">
                <div
                  className={cn(
                    "text-sm",
                    status === "todo"
                      ? "text-text-tertiary font-normal"
                      : "text-text-primary font-semibold",
                  )}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-xs text-text-tertiary">
                    {step.description}
                  </div>
                )}
              </div>
            )}

            {!isVertical && !isLast && (
              <div className="h-px flex-1 bg-border-default" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export { Stepper };
