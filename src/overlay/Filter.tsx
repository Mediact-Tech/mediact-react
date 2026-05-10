import * as React from "react";
import { ListFilter } from "lucide-react";
import * as RadixPopover from "@radix-ui/react-popover";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";
import { Button, type ButtonProps } from "../ui/Button";
import { cn } from "../lib/cn";

type PopoverContentProps = React.ComponentProps<typeof RadixPopover.Content>;

export type FilterProps = {
  /** Popover content — typically the filter form fields plus an Apply button. */
  children: React.ReactNode;
  /** Trigger button label. Default `"Filter"`. */
  triggerLabel?: React.ReactNode;
  /** Replace the trigger entirely (overrides `triggerLabel`/`triggerProps`). */
  trigger?: React.ReactNode;
  /** Props forwarded to the default trigger Button. */
  triggerProps?: Omit<ButtonProps, "children">;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: PopoverContentProps["align"];
  side?: PopoverContentProps["side"];
  sideOffset?: PopoverContentProps["sideOffset"];
  /** Class for the popover content panel. */
  contentClassName?: string;
};

function Filter({
  children,
  triggerLabel = "Filter",
  trigger,
  triggerProps,
  open,
  defaultOpen,
  onOpenChange,
  align = "end",
  side = "bottom",
  sideOffset = 8,
  contentClassName,
}: FilterProps) {
  return (
    <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button
            variant="secondary"
            leftIcon={<ListFilter />}
            {...triggerProps}
          >
            {triggerLabel}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn("w-[360px] p-6", contentClassName)}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}

export { Filter };
