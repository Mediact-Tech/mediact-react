import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "../lib/cn";

export type AddSlotButtonProps = Omit<
  React.ComponentProps<"button">,
  "children"
> & {
  /** Localized label, e.g. "เพิ่มหมอ" / "เพิ่มแพทย์เวร". */
  label?: string;
  icon?: React.ReactNode;
};

/** Dashed "+ add" placeholder for an empty schedule slot. */
const AddSlotButton = React.forwardRef<HTMLButtonElement, AddSlotButtonProps>(
  function AddSlotButton({ className, label = "เพิ่ม", icon, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong px-2 py-1.5 text-sm text-text-tertiary transition-colors hover:border-success-green-600 hover:bg-success-green-600/20 hover:text-success-green-600 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
          className,
        )}
        {...props}
      >
        {icon ?? <Plus />}
        {label}
      </button>
    );
  },
);

AddSlotButton.displayName = "AddSlotButton";

export { AddSlotButton };
