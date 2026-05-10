import * as React from "react";
import { Command as CmdkRoot } from "cmdk";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "../lib/cn";
import {
  FloatingFieldShell,
  type FieldSize,
} from "./FloatingFieldShell";
import { Popover, PopoverContent, PopoverTrigger } from "../overlay/Popover";
import { Chip } from "../ui/Chip";

export type MultiOption<V extends string = string> = {
  value: V;
  label: string;
  disabled?: boolean;
};

export type MultiAutocompleteProps<V extends string = string> = {
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
  value?: V[];
  defaultValue?: V[];
  onChange?: (values: V[]) => void;
  options: MultiOption<V>[];
  onSearch?: (query: string) => void;
  /** Maximum visible chips — extras collapse into "+N". Default `3`. */
  maxVisibleChips?: number;
  /** Cap selection. */
  maxItems?: number;
  disabled?: boolean;
  size?: FieldSize;
  className?: string;
  containerClassName?: string;
};

const minHeights: Record<FieldSize, string> = {
  sm: "min-h-9",
  md: "min-h-11",
  lg: "min-h-12",
};

function MultiAutocomplete<V extends string = string>({
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
  maxVisibleChips = 3,
  maxItems,
  disabled,
  size = "md",
  className,
  containerClassName,
}: MultiAutocompleteProps<V>) {
  const reactId = React.useId();
  const triggerId = id ?? reactId;
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState<V[]>(defaultValue ?? []);
  const [query, setQuery] = React.useState("");

  const isControlled = value !== undefined;
  const selected = isControlled ? (value ?? []) : internal;
  const hasError = Boolean(error);
  const hasValue = selected.length > 0;
  const floating =
    Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);

  const setSelected = (next: V[]) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const toggle = (v: V) => {
    if (selected.includes(v)) {
      setSelected(selected.filter((x) => x !== v));
    } else {
      if (maxItems != null && selected.length >= maxItems) return;
      setSelected([...selected, v]);
    }
  };

  const remove = (v: V) => setSelected(selected.filter((x) => x !== v));

  const selectedLabels = selected.map(
    (v) => options.find((o) => o.value === v)?.label ?? String(v),
  );
  const visible = selectedLabels.slice(0, maxVisibleChips);
  const overflow = selectedLabels.length - visible.length;

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
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (disabled) return;
          setOpen(next);
        }}
      >
        <PopoverTrigger asChild>
          <div
            id={triggerId}
            role="combobox"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled || undefined}
            aria-invalid={hasError || undefined}
            aria-expanded={open}
            onKeyDown={(e) => {
              if (disabled) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen((o) => !o);
              }
            }}
            className={cn(
              "flex w-full items-center gap-1.5 rounded-sm border bg-white px-3 py-1.5 pr-9 font-medium transition-colors cursor-pointer",
              "focus:outline-none focus:ring-1",
              "aria-disabled:cursor-not-allowed aria-disabled:bg-gray-50",
              minHeights[size],
              hasError
                ? "border-cherry-red-600 focus:border-cherry-red-600 focus:ring-cherry-red-600/40"
                : "border-border-strong focus:border-brand focus:ring-brand/30",
              className,
            )}
          >
            <span className="flex flex-1 flex-wrap items-center gap-1">
              {selected.length === 0 ? (
                <span className="text-sm text-text-tertiary">
                  {floating ? placeholder ?? "" : ""}
                </span>
              ) : (
                <>
                  {visible.map((lbl, i) => {
                    const v = selected[i]!;
                    return (
                      <Chip
                        key={v}
                        size="sm"
                        variant="primary"
                        removable
                        onRemove={(e) => {
                          e.stopPropagation();
                          remove(v);
                        }}
                      >
                        {lbl}
                      </Chip>
                    );
                  })}
                  {overflow > 0 && (
                    <Chip size="sm" variant="neutral">
                      +{overflow}
                    </Chip>
                  )}
                </>
              )}
            </span>
          </div>
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
              {options.map((opt) => {
                const checked = selected.includes(opt.value);
                const capped =
                  !checked &&
                  maxItems != null &&
                  selected.length >= maxItems;
                return (
                  <CmdkRoot.Item
                    key={opt.value}
                    value={opt.label}
                    disabled={opt.disabled || capped}
                    onSelect={() => toggle(opt.value)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm",
                      "data-[selected=true]:bg-brand-subtle",
                      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                    )}
                  >
                    <span>{opt.label}</span>
                    {checked && (
                      <Check className="size-4 text-text-primary" />
                    )}
                  </CmdkRoot.Item>
                );
              })}
            </CmdkRoot.List>
            {selected.length > 0 && (
              <div className="flex items-center justify-between border-t border-border-default px-2 py-1.5 text-xs">
                <span className="text-text-tertiary">
                  {selected.length} selected
                  {maxItems != null && ` / ${maxItems}`}
                </span>
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-cherry-red-600 hover:bg-cherry-red-50"
                >
                  <X className="size-3" />
                  Clear
                </button>
              </div>
            )}
          </CmdkRoot>
        </PopoverContent>
      </Popover>
    </FloatingFieldShell>
  );
}

export { MultiAutocomplete };
