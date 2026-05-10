import * as React from "react";
import { Command as CmdkRoot } from "cmdk";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/cn";
import {
  FloatingFieldShell,
  fieldShapeClasses,
  type FieldSize,
} from "./FloatingFieldShell";
import { Popover, PopoverContent, PopoverTrigger } from "../overlay/Popover";

export type ComboBoxOption<V extends string = string> = {
  value: V;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type ComboBoxProps<V extends string = string> = {
  id?: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  hideLabel?: boolean;
  alwaysFloatLabel?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  value?: V | null;
  defaultValue?: V;
  onChange?: (value: V | undefined) => void;
  options: ComboBoxOption<V>[];
  /** Hook for async search — caller fetches and updates `options`. */
  onSearch?: (query: string) => void;
  disabled?: boolean;
  size?: FieldSize;
  className?: string;
  containerClassName?: string;
};

function ComboBox<V extends string = string>({
  id,
  label,
  hint,
  error,
  required,
  hideLabel,
  alwaysFloatLabel,
  placeholder,
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  value,
  defaultValue,
  onChange,
  options,
  onSearch,
  disabled,
  size = "md",
  className,
  containerClassName,
}: ComboBoxProps<V>) {
  const reactId = React.useId();
  const triggerId = id ?? reactId;
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState<V | undefined>(defaultValue);
  const [query, setQuery] = React.useState("");

  const isControlled = value !== undefined;
  const selected = isControlled ? (value ?? undefined) : internal;
  const selectedOption = options.find((o) => o.value === selected);
  const hasError = Boolean(error);
  const hasValue = selected != null;
  const floating =
    Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);

  const handleSelect = (next: V) => {
    const finalValue = next === selected ? undefined : next;
    if (!isControlled) setInternal(finalValue);
    onChange?.(finalValue);
    setOpen(false);
  };

  return (
    <FloatingFieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      htmlFor={triggerId}
      size={size}
      floating={floating}
      focused={open}
      hasError={hasError}
      containerClassName={containerClassName}
      rightAdornment={<ChevronsUpDown />}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={triggerId}
            type="button"
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-expanded={open}
            className={cn(
              fieldShapeClasses({ hasError, size }),
              "flex items-center text-left pr-9",
              !selectedOption && "text-text-tertiary",
              className,
            )}
          >
            <span className="truncate">
              {selectedOption
                ? selectedOption.label
                : floating
                  ? placeholder ?? ""
                  : ""}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <CmdkRoot shouldFilter={!onSearch} className="flex w-full flex-col">
            <CmdkRoot.Input
              value={query}
              onValueChange={(v) => {
                setQuery(v);
                onSearch?.(v);
              }}
              placeholder={searchPlaceholder}
              className="border-b border-border-default px-3 py-2 text-sm outline-none placeholder:text-text-tertiary"
            />
            <CmdkRoot.List className="max-h-64 overflow-auto p-1">
              <CmdkRoot.Empty className="px-3 py-6 text-center text-sm text-text-tertiary">
                {emptyText}
              </CmdkRoot.Empty>
              {options.map((opt) => (
                <CmdkRoot.Item
                  key={opt.value}
                  value={opt.label}
                  disabled={opt.disabled}
                  onSelect={() => handleSelect(opt.value)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm",
                    "data-[selected=true]:bg-brand-subtle",
                    "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                  )}
                >
                  <span className="flex flex-col">
                    <span>{opt.label}</span>
                    {opt.description && (
                      <span className="text-xs text-text-tertiary">
                        {opt.description}
                      </span>
                    )}
                  </span>
                  {opt.value === selected && (
                    <Check className="size-4 text-text-primary" />
                  )}
                </CmdkRoot.Item>
              ))}
            </CmdkRoot.List>
          </CmdkRoot>
        </PopoverContent>
      </Popover>
    </FloatingFieldShell>
  );
}

export { ComboBox };
