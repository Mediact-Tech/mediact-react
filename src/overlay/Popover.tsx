import * as React from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import { cn } from "../lib/cn";

const Popover = RadixPopover.Root;
const PopoverTrigger = RadixPopover.Trigger;
const PopoverAnchor = RadixPopover.Anchor;
const PopoverClose = RadixPopover.Close;

type PopoverContentProps = React.ComponentProps<typeof RadixPopover.Content>;

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(
    { className, align = "start", sideOffset = 4, ...props },
    ref,
  ) {
    return (
      <RadixPopover.Portal>
        <RadixPopover.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 rounded-sm border border-border-default bg-white p-3 shadow-lg outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            className,
          )}
          {...props}
        />
      </RadixPopover.Portal>
    );
  },
);

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose };
