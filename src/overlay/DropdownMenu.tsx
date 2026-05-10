import * as React from "react";
import * as RadixMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../lib/cn";

const DropdownMenu = RadixMenu.Root;
const DropdownMenuTrigger = RadixMenu.Trigger;
const DropdownMenuGroup = RadixMenu.Group;
const DropdownMenuRadioGroup = RadixMenu.RadioGroup;
const DropdownMenuPortal = RadixMenu.Portal;
const DropdownMenuSub = RadixMenu.Sub;

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RadixMenu.Content>
>(function DropdownMenuContent({ className, sideOffset = 4, ...props }, ref) {
  return (
    <RadixMenu.Portal>
      <RadixMenu.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-sm border border-border-default bg-white p-1 shadow-lg",
          className,
        )}
        {...props}
      />
    </RadixMenu.Portal>
  );
});

type ItemProps = React.ComponentProps<typeof RadixMenu.Item> & {
  destructive?: boolean;
  inset?: boolean;
};

const DropdownMenuItem = React.forwardRef<HTMLDivElement, ItemProps>(
  function DropdownMenuItem({ className, destructive, inset, ...props }, ref) {
    return (
      <RadixMenu.Item
        ref={ref}
        className={cn(
          "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
          "focus:bg-brand-subtle data-[highlighted]:bg-brand-subtle",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          destructive && "text-cherry-red-600 focus:bg-cherry-red-50 data-[highlighted]:bg-cherry-red-50",
          inset && "pl-8",
          className,
        )}
        {...props}
      />
    );
  },
);

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RadixMenu.CheckboxItem>
>(function DropdownMenuCheckboxItem({ className, children, ...props }, ref) {
  return (
    <RadixMenu.CheckboxItem
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "focus:bg-brand-subtle data-[highlighted]:bg-brand-subtle",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <RadixMenu.ItemIndicator>
          <Check className="size-4" />
        </RadixMenu.ItemIndicator>
      </span>
      {children}
    </RadixMenu.CheckboxItem>
  );
});

const DropdownMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RadixMenu.RadioItem>
>(function DropdownMenuRadioItem({ className, children, ...props }, ref) {
  return (
    <RadixMenu.RadioItem
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "focus:bg-brand-subtle data-[highlighted]:bg-brand-subtle",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <RadixMenu.ItemIndicator>
          <Circle className="size-2 fill-current" />
        </RadixMenu.ItemIndicator>
      </span>
      {children}
    </RadixMenu.RadioItem>
  );
});

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RadixMenu.Label> & { inset?: boolean }
>(function DropdownMenuLabel({ className, inset, ...props }, ref) {
  return (
    <RadixMenu.Label
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-text-tertiary",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
});

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RadixMenu.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return (
    <RadixMenu.Separator
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-border-subtle", className)}
      {...props}
    />
  );
});

const DropdownMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RadixMenu.SubTrigger>
>(function DropdownMenuSubTrigger({ className, children, ...props }, ref) {
  return (
    <RadixMenu.SubTrigger
      ref={ref}
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
        "focus:bg-brand-subtle data-[state=open]:bg-brand-subtle",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto size-4" />
    </RadixMenu.SubTrigger>
  );
});

const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RadixMenu.SubContent>
>(function DropdownMenuSubContent({ className, ...props }, ref) {
  return (
    <RadixMenu.SubContent
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-sm border border-border-default bg-white p-1 shadow-lg",
        className,
      )}
      {...props}
    />
  );
});

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
