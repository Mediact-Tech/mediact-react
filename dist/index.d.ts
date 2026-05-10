import * as class_variance_authority_types from 'class-variance-authority/types';
import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import * as RadixSwitch from '@radix-ui/react-switch';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as RadixRadio from '@radix-ui/react-radio-group';
import * as RadixSelect from '@radix-ui/react-select';
import * as RadixAvatar from '@radix-ui/react-avatar';
import { ColumnDef, SortingState, OnChangeFn, RowSelectionState } from '@tanstack/react-table';
import * as RadixTabs from '@radix-ui/react-tabs';
import { Toaster as Toaster$1 } from 'sonner';
export { toast } from 'sonner';
import * as RadixPopover from '@radix-ui/react-popover';
import * as RadixDialog from '@radix-ui/react-dialog';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import * as RadixMenu from '@radix-ui/react-dropdown-menu';
import { ClassValue } from 'clsx';

declare const buttonVariants: (props?: ({
    variant?: "primary" | "secondary" | "ghost" | "destructive" | "success" | "warning" | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
    fullWidth?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
};
declare const Button: React.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

type FieldSize = "sm" | "md" | "lg";

type NativeInputProps = Omit<React.ComponentProps<"input">, "size">;
type InputProps = NativeInputProps & {
    /** Floating label — sits inside the field as placeholder, floats up on focus or when filled. */
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    hideLabel?: boolean;
    /** Force the label into the floated position (e.g. for fields with fixed prefixes/masks). */
    alwaysFloatLabel?: boolean;
    size?: FieldSize;
    leftAdornment?: React.ReactNode;
    rightAdornment?: React.ReactNode;
    /** Show a clear (×) button when value is non-empty. */
    clearable?: boolean;
    containerClassName?: string;
};
declare const Input: React.ForwardRefExoticComponent<Omit<InputProps, "ref"> & React.RefAttributes<HTMLInputElement>>;

type TextareaProps = React.ComponentProps<"textarea"> & {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    hideLabel?: boolean;
    alwaysFloatLabel?: boolean;
    size?: FieldSize;
    /** Show character count in the hint slot (requires `maxLength`). */
    showCount?: boolean;
    containerClassName?: string;
};
declare const Textarea: React.ForwardRefExoticComponent<Omit<TextareaProps, "ref"> & React.RefAttributes<HTMLTextAreaElement>>;

type CheckboxProps = Omit<React.ComponentProps<typeof RadixCheckbox.Root>, "asChild"> & {
    /** Label rendered to the right of the box. Click toggles the checkbox. */
    label?: React.ReactNode;
    /** Description rendered under the label. */
    description?: React.ReactNode;
    /** Error message — switches to error styling. */
    error?: React.ReactNode;
    /** Wrapper className (the outer label). */
    containerClassName?: string;
};
declare const Checkbox: React.ForwardRefExoticComponent<Omit<CheckboxProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

type SwitchProps = Omit<React.ComponentProps<typeof RadixSwitch.Root>, "asChild"> & {
    label?: React.ReactNode;
    description?: React.ReactNode;
    error?: React.ReactNode;
    /** Position of label relative to the switch. Default `right`. */
    labelPosition?: "left" | "right";
    containerClassName?: string;
};
declare const Switch: React.ForwardRefExoticComponent<Omit<SwitchProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

type RadioOption<V extends string = string> = {
    value: V;
    label: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
};
type RadioGroupProps<V extends string = string> = Omit<React.ComponentProps<typeof RadixRadio.Root>, "asChild" | "children"> & {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    /** Options to render. Pass children directly for custom layouts. */
    options?: RadioOption<V>[];
    /** Layout direction. Default `vertical`. */
    orientation?: "vertical" | "horizontal";
    containerClassName?: string;
    children?: React.ReactNode;
};
declare function RadioGroup<V extends string = string>({ id, className, containerClassName, label, hint, error, required, options, orientation, children, ...props }: RadioGroupProps<V>): react_jsx_runtime.JSX.Element;
type RadioGroupItemProps = Omit<React.ComponentProps<typeof RadixRadio.Item>, "asChild"> & {
    description?: React.ReactNode;
};
declare const RadioGroupItem: React.ForwardRefExoticComponent<Omit<RadioGroupItemProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

type SelectOption<V extends string = string> = {
    value: V;
    label: React.ReactNode;
    disabled?: boolean;
};
type SelectProps<V extends string = string> = {
    id?: string;
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    hideLabel?: boolean;
    /** Force the label into the floated position. */
    alwaysFloatLabel?: boolean;
    /** Placeholder shown when nothing selected and label has floated. */
    placeholder?: string;
    /** Controlled value. */
    value?: V;
    defaultValue?: V;
    onChange?: (value: V) => void;
    options?: SelectOption<V>[];
    disabled?: boolean;
    size?: FieldSize;
    className?: string;
    containerClassName?: string;
    /** When passing children directly (for grouping/custom items). */
    children?: React.ReactNode;
};
declare function Select<V extends string = string>({ id, label, hint, error, required, hideLabel, alwaysFloatLabel, placeholder, value, defaultValue, onChange, options, disabled, size, className, containerClassName, children, }: SelectProps<V>): react_jsx_runtime.JSX.Element;
declare const SelectItem: React.ForwardRefExoticComponent<Omit<RadixSelect.SelectItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;

declare const chipVariants: (props?: ({
    variant?: "primary" | "success" | "warning" | "neutral" | "danger" | "info" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
    interactive?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type ChipProps = React.ComponentProps<"span"> & VariantProps<typeof chipVariants> & {
    leftIcon?: React.ReactNode;
    /** Show an × button. Calls `onRemove` (preferred) or falls back to `onClick`. */
    removable?: boolean;
    onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
declare const Chip: React.ForwardRefExoticComponent<Omit<ChipProps, "ref"> & React.RefAttributes<HTMLSpanElement>>;

declare const avatarVariants: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type AvatarProps = Omit<React.ComponentProps<typeof RadixAvatar.Root>, "asChild"> & VariantProps<typeof avatarVariants> & {
    /** Image URL. */
    src?: string;
    /** Alt text + source for fallback initials when `fallback` is omitted. */
    name?: string;
    /** Custom fallback content (overrides initials). */
    fallback?: React.ReactNode;
};
declare const Avatar: React.ForwardRefExoticComponent<Omit<AvatarProps, "ref"> & React.RefAttributes<HTMLSpanElement>>;

type TopNavProps = React.ComponentProps<"header"> & {
    /** Render as fixed/sticky bar that floats with rounded corners. Default `false` (inline). */
    floating?: boolean;
};
declare const TopNav: React.ForwardRefExoticComponent<Omit<TopNavProps, "ref"> & React.RefAttributes<HTMLElement>>;
type TopNavBrandProps = React.ComponentProps<"div"> & {
    logo?: React.ReactNode;
};
declare const TopNavBrand: React.ForwardRefExoticComponent<Omit<TopNavBrandProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const TopNavSpacer: ({ className }: {
    className?: string;
}) => react_jsx_runtime.JSX.Element;
/** Canonical app keys across the Mediact ecosystem. */
type MediactAppKey = "mediwork" | "medimatch" | "medipay" | "medistock" | "medicare" | "medirefer";
type MediactAppConfig = {
    /** Where this app lives. Falsy → tile is rendered as not-clickable. */
    baseUrl?: string;
    /** Show "Coming Soon" subtitle and disable the tile. */
    comingSoon?: boolean;
    /** Disable the tile (greyed out, not clickable) — e.g. tenant has no purchase. */
    disabled?: boolean;
    /** Highlight current app. */
    active?: boolean;
    /** Override label. */
    label?: string;
    /** Override icon. */
    icon?: React.ReactNode;
};
type AppLauncherProps = {
    apps: Partial<Record<MediactAppKey, MediactAppConfig>>;
    /** Render order. Default: mediwork → medimatch → medipay → medistock → medicare → medirefer. */
    order?: MediactAppKey[];
    /** Override default `<a href>` navigation (e.g. for SPA routing). */
    onAppClick?: (key: MediactAppKey, app: MediactAppConfig) => void;
    /** Tooltip / aria-label for the trigger. Default "Apps". */
    label?: string;
    /** Subtitle shown beneath disabled / coming-soon tiles. */
    comingSoonText?: string;
    className?: string;
};
declare function AppLauncher({ apps, order, onAppClick, label, comingSoonText, className, }: AppLauncherProps): react_jsx_runtime.JSX.Element;
type NotificationBellProps = React.ComponentProps<"button"> & {
    hasUnread?: boolean;
    unreadCount?: number;
    label?: string;
};
declare const NotificationBell: React.ForwardRefExoticComponent<Omit<NotificationBellProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
type UserMenuItem = {
    label: React.ReactNode;
    onClick?: () => void;
    href?: string;
};
type UserMenuProps = {
    user: {
        name?: string;
        src?: string;
        role?: React.ReactNode;
    };
    /** Body items rendered between the role and the bottom row. */
    items?: UserMenuItem[];
    /** Click handler for the Log Out button. Pass `null` to hide the button. */
    onLogout?: (() => void) | null;
    logoutLabel?: React.ReactNode;
    /** Slot rendered to the left of the Log Out button — typically a language switcher. */
    bottomLeft?: React.ReactNode;
    /** Tooltip / aria-label for the trigger. Default "Account". */
    label?: string;
    className?: string;
};
/**
 * Profile dropdown — matches `mediact-portal-web/src/components/shared/Sidebar.tsx`'s
 * profile menu: centered avatar + name + role header, full-width menu items, and
 * a bottom row that pairs an optional language switcher with a red Log Out button.
 */
declare function UserMenu({ user, items, onLogout, logoutLabel, bottomLeft, label, className, }: UserMenuProps): react_jsx_runtime.JSX.Element;

type SidebarProps = React.ComponentProps<"aside"> & {
    /** Logo / brand block rendered at the top. */
    header?: React.ReactNode;
    /** Footer block rendered at the bottom (e.g. version label). */
    footer?: React.ReactNode;
    /** Currently active item id — children compare via context. */
    activeItemId?: string;
    /** Click handler invoked by `SidebarItem`. Receives `(id, href?)`. */
    onItemClick?: (id: string, href?: string) => void;
    /** Render the sidebar in collapsed (icon-only) mode. */
    collapsed?: boolean;
    /** Width when expanded. Default `260px`. */
    expandedWidth?: number | string;
    /** Width when collapsed. Default `72px`. */
    collapsedWidth?: number | string;
};
declare const Sidebar: React.ForwardRefExoticComponent<Omit<SidebarProps, "ref"> & React.RefAttributes<HTMLElement>>;
type IconType = React.ComponentType<{
    className?: string;
}>;
type SidebarItemProps = {
    id: string;
    label: React.ReactNode;
    icon?: IconType;
    href?: string;
    onClick?: () => void;
    /** Optional small text below the label (badge / sub-label). */
    badge?: React.ReactNode;
    className?: string;
};
declare function SidebarItem({ id, label, icon: Icon, href, onClick, badge, className, }: SidebarItemProps): react_jsx_runtime.JSX.Element;
type SidebarGroupProps = {
    /** Stable id used for the chevron-toggle aria. */
    id: string;
    label: React.ReactNode;
    icon?: IconType;
    /** Whether the group is expanded by default. */
    defaultExpanded?: boolean;
    /** Controlled expanded state. */
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    children?: React.ReactNode;
    className?: string;
};
declare function SidebarGroup({ id, label, icon: Icon, defaultExpanded, expanded, onExpandedChange, children, className, }: SidebarGroupProps): react_jsx_runtime.JSX.Element;

type FormFieldProps = {
    /** Field label rendered above the input. Omit for unlabeled fields. */
    label?: React.ReactNode;
    /** Helper text under the input. Hidden when `error` is set. */
    hint?: React.ReactNode;
    /** Error message — when truthy, switches the field to error styling. */
    error?: React.ReactNode;
    /** Marks the label with a red asterisk. Does NOT enforce HTML required (caller controls). */
    required?: boolean;
    /** id wired to the input via htmlFor — caller passes the same id to the input. */
    htmlFor?: string;
    /** Visually hide the label but keep it for screen readers. */
    hideLabel?: boolean;
    className?: string;
    children: React.ReactNode;
};
/**
 * Layout shell shared by every form primitive (Input, Textarea, Select, ...).
 * Renders: [Label] [children] [hint | error]
 */
declare function FormField({ label, hint, error, required, htmlFor, hideLabel, className, children, }: FormFieldProps): react_jsx_runtime.JSX.Element;

type DatePickerProps = {
    id?: string;
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    hideLabel?: boolean;
    alwaysFloatLabel?: boolean;
    /** Placeholder text shown inside the field when label has floated. */
    placeholder?: string;
    value?: Date | null;
    defaultValue?: Date;
    onChange?: (date: Date | undefined) => void;
    /** date-fns format string. Default `"PPP"` (e.g. "May 9, 2026"). */
    displayFormat?: string;
    disabledDate?: (date: Date) => boolean;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    size?: FieldSize;
    /** Caption layout for the calendar header. Default `"dropdown"` (month + year dropdowns). */
    captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years";
    /** Earliest year selectable in the year dropdown. Default: current year − 100. */
    fromYear?: number;
    /** Latest year selectable in the year dropdown. Default: current year + 10. */
    toYear?: number;
    className?: string;
    containerClassName?: string;
};
declare function DatePicker({ id, label, hint, error, required, hideLabel, alwaysFloatLabel, placeholder, value, defaultValue, onChange, displayFormat, disabledDate, minDate, maxDate, disabled, size, captionLayout, fromYear, toYear, className, containerClassName, }: DatePickerProps): react_jsx_runtime.JSX.Element;

/** "HH:mm" string in 24-hour format. */
type TimeValue = string;
type TimePickerProps = {
    id?: string;
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    hideLabel?: boolean;
    alwaysFloatLabel?: boolean;
    value?: TimeValue | null;
    defaultValue?: TimeValue;
    onChange?: (value: TimeValue) => void;
    /** Minute step in the popover (e.g. 5 → 0, 5, 10…). Default `1`. */
    minuteStep?: number;
    /** @deprecated use `minuteStep` */
    step?: number;
    disabled?: boolean;
    size?: FieldSize;
    className?: string;
    containerClassName?: string;
};
declare function TimePicker({ id, label, hint, error, required, hideLabel, alwaysFloatLabel, value, defaultValue, onChange, minuteStep, step, disabled, size, className, containerClassName, }: TimePickerProps): react_jsx_runtime.JSX.Element;

type ComboBoxOption<V extends string = string> = {
    value: V;
    label: string;
    description?: string;
    disabled?: boolean;
};
type ComboBoxProps<V extends string = string> = {
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
declare function ComboBox<V extends string = string>({ id, label, hint, error, required, hideLabel, alwaysFloatLabel, placeholder, searchPlaceholder, emptyText, value, defaultValue, onChange, options, onSearch, disabled, size, className, containerClassName, }: ComboBoxProps<V>): react_jsx_runtime.JSX.Element;

type MultiOption<V extends string = string> = {
    value: V;
    label: string;
    disabled?: boolean;
};
type MultiAutocompleteProps<V extends string = string> = {
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
declare function MultiAutocomplete<V extends string = string>({ id, label, hint, error, required, hideLabel, alwaysFloatLabel, placeholder, searchPlaceholder, emptyText, value, defaultValue, onChange, options, onSearch, maxVisibleChips, maxItems, disabled, size, className, containerClassName, }: MultiAutocompleteProps<V>): react_jsx_runtime.JSX.Element;

declare const Table: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>, "ref"> & React.RefAttributes<HTMLTableElement>>;
declare const TableHeader: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>, "ref"> & React.RefAttributes<HTMLTableSectionElement>>;
declare const TableBody: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>, "ref"> & React.RefAttributes<HTMLTableSectionElement>>;
declare const TableFooter: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>, "ref"> & React.RefAttributes<HTMLTableSectionElement>>;
declare const TableRow: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>, "ref"> & React.RefAttributes<HTMLTableRowElement>>;
declare const TableHead: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>, "ref"> & React.RefAttributes<HTMLTableCellElement>>;
declare const TableCell: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>, "ref"> & React.RefAttributes<HTMLTableCellElement>>;
declare const TableCaption: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & React.RefAttributes<HTMLTableCaptionElement>>;

type DataTablePagination = {
    /** 0-based page index. */
    pageIndex: number;
    /** Rows per page. */
    pageSize: number;
    /** Total rows across all pages (server-side). */
    rowCount: number;
    onPageChange: (pageIndex: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
};
type DataTableProps<TData> = {
    columns: ColumnDef<TData, any>[];
    data: TData[];
    isLoading?: boolean;
    /** Server-side pagination. Omit to render all rows in one view. */
    pagination?: DataTablePagination;
    /** Controlled sorting state. When omitted, table is uncontrolled. */
    sorting?: SortingState;
    onSortingChange?: OnChangeFn<SortingState>;
    /** Manual sorting (server-side). When `true`, the table will not sort rows itself. */
    manualSorting?: boolean;
    /** Enable a checkbox selection column. */
    enableSelection?: boolean;
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
    /** Stable id for selection — required when data resets. Default uses array index. */
    getRowId?: (row: TData, index: number) => string;
    /** Click handler for a row. Selection checkbox stops propagation. */
    onRowClick?: (row: TData, index: number) => void;
    /** Sticky header inside scrolling container. */
    stickyHeader?: boolean;
    /** Custom empty state. */
    empty?: React.ReactNode;
    className?: string;
};
declare function DataTable<TData>({ columns, data, isLoading, pagination, sorting: sortingProp, onSortingChange, manualSorting, enableSelection, rowSelection: rowSelectionProp, onRowSelectionChange, getRowId, onRowClick, stickyHeader, empty, className, }: DataTableProps<TData>): react_jsx_runtime.JSX.Element;

declare const cardVariants: (props?: ({
    variant?: "flat" | "elevated" | "outlined" | null | undefined;
    padding?: "sm" | "md" | "lg" | "none" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type CardProps = React.ComponentProps<"div"> & VariantProps<typeof cardVariants>;
declare const Card: React.ForwardRefExoticComponent<Omit<CardProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const CardHeader: ({ className, ...props }: React.ComponentProps<"div">) => react_jsx_runtime.JSX.Element;
declare const CardTitle: ({ className, ...props }: React.ComponentProps<"h3">) => react_jsx_runtime.JSX.Element;
declare const CardDescription: ({ className, ...props }: React.ComponentProps<"p">) => react_jsx_runtime.JSX.Element;
declare const CardContent: ({ className, ...props }: React.ComponentProps<"div">) => react_jsx_runtime.JSX.Element;
declare const CardFooter: ({ className, ...props }: React.ComponentProps<"div">) => react_jsx_runtime.JSX.Element;

declare const Tabs: React.ForwardRefExoticComponent<RadixTabs.TabsProps & React.RefAttributes<HTMLDivElement>>;
declare const tabsListVariants: (props?: ({
    variant?: "underline" | "pill" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare const tabsTriggerVariants: (props?: ({
    variant?: "underline" | "pill" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type TabsListProps = React.ComponentProps<typeof RadixTabs.List> & VariantProps<typeof tabsListVariants>;
declare const TabsList: React.ForwardRefExoticComponent<Omit<TabsListProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
type TabsTriggerProps = React.ComponentProps<typeof RadixTabs.Trigger> & VariantProps<typeof tabsTriggerVariants>;
declare const TabsTrigger: React.ForwardRefExoticComponent<Omit<TabsTriggerProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
declare const TabsContent: React.ForwardRefExoticComponent<Omit<RadixTabs.TabsContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;

type BreadcrumbItem = {
    label: React.ReactNode;
    /** Optional leading icon — typically used on the first/Home item. */
    icon?: React.ReactNode;
    href?: string;
    /** When provided, renders as <button> instead of <a>. */
    onClick?: () => void;
};
type BreadcrumbProps = React.ComponentProps<"nav"> & {
    items: BreadcrumbItem[];
    /** Custom separator. Default `"/"` (forward slash). */
    separator?: React.ReactNode;
    /** Collapse middle items when more than this number. Default `0` (no collapse). */
    maxItems?: number;
};
declare function Breadcrumb({ items, separator, maxItems, className, ...props }: BreadcrumbProps): react_jsx_runtime.JSX.Element;
/** Low-level escape hatch — use `<BreadcrumbRoot>` + `<BreadcrumbLink>` for custom rendering. */
declare const BreadcrumbRoot: ({ className, ...props }: React.ComponentProps<"nav">) => react_jsx_runtime.JSX.Element;
declare const BreadcrumbLink: React.ForwardRefExoticComponent<Omit<React.ClassAttributes<HTMLAnchorElement> & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    asChild?: boolean;
}, "ref"> & React.RefAttributes<HTMLAnchorElement>>;

type StepperStep = {
    label: React.ReactNode;
    description?: React.ReactNode;
};
type StepperProps = {
    steps: StepperStep[];
    /** Zero-based index of the current (active) step. Steps before are "done". */
    current: number;
    orientation?: "horizontal" | "vertical";
    className?: string;
    /** Allow click on completed/active steps to navigate. */
    onStepClick?: (index: number) => void;
};
declare function Stepper({ steps, current, orientation, className, onStepClick, }: StepperProps): react_jsx_runtime.JSX.Element;

type SkeletonProps = React.ComponentProps<"div"> & {
    /** Shape preset. `text` defaults to a 1em-height bar. `circle` is square + rounded-full. */
    shape?: "rect" | "text" | "circle";
};
declare const Skeleton: React.ForwardRefExoticComponent<Omit<SkeletonProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

type SpinnerProps = React.ComponentProps<"span"> & {
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    /** Optional accessible label. Default `"Loading"`. */
    label?: string;
};
declare const Spinner: React.ForwardRefExoticComponent<Omit<SpinnerProps, "ref"> & React.RefAttributes<HTMLSpanElement>>;
/** Full-screen / panel-fill loading state. Centers a spinner with optional label. */
declare function LoadingScreen({ label, className, }: {
    label?: React.ReactNode;
    className?: string;
}): react_jsx_runtime.JSX.Element;

type EmptyStateProps = React.ComponentProps<"div"> & {
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
declare function EmptyState({ icon, title, description, action, iconTone, className, ...props }: EmptyStateProps): react_jsx_runtime.JSX.Element;

type ToasterProps = React.ComponentProps<typeof Toaster$1>;
/**
 * Mount once near the app root. All `toast.*` calls render through this.
 *
 * Note for monorepo consumers using a workspace dev import (e.g. Storybook
 * importing `@mediact/react` via the package's `dist`): make sure your dev
 * resolver aliases `@mediact/react` to `packages/react/src/index.ts` so the
 * Toaster and `toast()` call share the same `sonner` module instance. Without
 * this, sonner's singleton state silently desyncs and toasts won't render.
 *
 * @example
 * <Toaster position="top-right" />
 */
declare function Toaster(props: ToasterProps): react_jsx_runtime.JSX.Element;

declare const Popover: React.FC<RadixPopover.PopoverProps>;
declare const PopoverTrigger: React.ForwardRefExoticComponent<RadixPopover.PopoverTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const PopoverAnchor: React.ForwardRefExoticComponent<RadixPopover.PopoverAnchorProps & React.RefAttributes<HTMLDivElement>>;
declare const PopoverClose: React.ForwardRefExoticComponent<RadixPopover.PopoverCloseProps & React.RefAttributes<HTMLButtonElement>>;
declare const PopoverContent: React.ForwardRefExoticComponent<Omit<RadixPopover.PopoverContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;

declare const Dialog: React.FC<RadixDialog.DialogProps>;
declare const DialogTrigger: React.ForwardRefExoticComponent<RadixDialog.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const DialogPortal: React.FC<RadixDialog.DialogPortalProps>;
declare const DialogClose: React.ForwardRefExoticComponent<RadixDialog.DialogCloseProps & React.RefAttributes<HTMLButtonElement>>;
declare const DialogOverlay: React.ForwardRefExoticComponent<Omit<RadixDialog.DialogOverlayProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
type DialogContentProps = React.ComponentProps<typeof RadixDialog.Content> & {
    size?: "sm" | "md" | "lg" | "xl";
    /** Show the built-in close (×) button. Default `true`. */
    showClose?: boolean;
};
declare const DialogContent: React.ForwardRefExoticComponent<Omit<DialogContentProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const DialogHeader: ({ className, ...props }: React.ComponentProps<"div">) => react_jsx_runtime.JSX.Element;
declare const DialogFooter: ({ className, ...props }: React.ComponentProps<"div">) => react_jsx_runtime.JSX.Element;
declare const DialogTitle: React.ForwardRefExoticComponent<Omit<RadixDialog.DialogTitleProps & React.RefAttributes<HTMLHeadingElement>, "ref"> & React.RefAttributes<HTMLHeadingElement>>;
declare const DialogDescription: React.ForwardRefExoticComponent<Omit<RadixDialog.DialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>, "ref"> & React.RefAttributes<HTMLParagraphElement>>;

type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: React.ReactNode;
    description?: React.ReactNode;
    /** Visual tone — affects icon and confirm button variant. */
    tone?: "info" | "warning" | "danger" | "success";
    confirmLabel?: React.ReactNode;
    cancelLabel?: React.ReactNode;
    /** Called on Confirm. Return a Promise to keep dialog open with loading state until it resolves. */
    onConfirm?: () => void | Promise<void>;
    /** Called on Cancel/× (defaults to closing the dialog). */
    onCancel?: () => void;
    size?: React.ComponentProps<typeof DialogContent>["size"];
};
declare function ConfirmDialog({ open, onOpenChange, title, description, tone, confirmLabel, cancelLabel, onConfirm, onCancel, size, }: ConfirmDialogProps): react_jsx_runtime.JSX.Element;

type PopoverContentProps = React.ComponentProps<typeof RadixPopover.Content>;
type FilterProps = {
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
declare function Filter({ children, triggerLabel, trigger, triggerProps, open, defaultOpen, onOpenChange, align, side, sideOffset, contentClassName, }: FilterProps): react_jsx_runtime.JSX.Element;

declare const TooltipProvider: React.FC<RadixTooltip.TooltipProviderProps>;
declare const TooltipRoot: React.FC<RadixTooltip.TooltipProps>;
declare const TooltipTrigger: React.ForwardRefExoticComponent<RadixTooltip.TooltipTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const TooltipPortal: React.FC<RadixTooltip.TooltipPortalProps>;
type TooltipContentProps = React.ComponentProps<typeof RadixTooltip.Content> & {
    /** Show a pointing arrow toward the trigger. Default `true`. */
    arrow?: boolean;
};
declare const TooltipContent: React.ForwardRefExoticComponent<Omit<TooltipContentProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
type TooltipProps = {
    content: React.ReactNode;
    children: React.ReactNode;
    side?: RadixTooltip.TooltipContentProps["side"];
    align?: RadixTooltip.TooltipContentProps["align"];
    delayDuration?: number;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    asChild?: boolean;
    /** Show a pointing arrow toward the trigger. Default `true`. */
    arrow?: boolean;
};
/**
 * Convenience wrapper. For grouped tooltips wrap your tree in <TooltipProvider>.
 * This component creates its own provider if none is in scope (safe to nest).
 */
declare function Tooltip({ content, children, side, align, delayDuration, open, defaultOpen, onOpenChange, asChild, arrow, }: TooltipProps): react_jsx_runtime.JSX.Element;

declare const DropdownMenu: React.FC<RadixMenu.DropdownMenuProps>;
declare const DropdownMenuTrigger: React.ForwardRefExoticComponent<RadixMenu.DropdownMenuTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const DropdownMenuGroup: React.ForwardRefExoticComponent<RadixMenu.DropdownMenuGroupProps & React.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuRadioGroup: React.ForwardRefExoticComponent<RadixMenu.DropdownMenuRadioGroupProps & React.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuPortal: React.FC<RadixMenu.DropdownMenuPortalProps>;
declare const DropdownMenuSub: React.FC<RadixMenu.DropdownMenuSubProps>;
declare const DropdownMenuContent: React.ForwardRefExoticComponent<Omit<RadixMenu.DropdownMenuContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
type ItemProps = React.ComponentProps<typeof RadixMenu.Item> & {
    destructive?: boolean;
    inset?: boolean;
};
declare const DropdownMenuItem: React.ForwardRefExoticComponent<Omit<ItemProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuCheckboxItem: React.ForwardRefExoticComponent<Omit<RadixMenu.DropdownMenuCheckboxItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuRadioItem: React.ForwardRefExoticComponent<Omit<RadixMenu.DropdownMenuRadioItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuLabel: React.ForwardRefExoticComponent<Omit<RadixMenu.DropdownMenuLabelProps & React.RefAttributes<HTMLDivElement> & {
    inset?: boolean;
}, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSeparator: React.ForwardRefExoticComponent<Omit<RadixMenu.DropdownMenuSeparatorProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubTrigger: React.ForwardRefExoticComponent<Omit<RadixMenu.DropdownMenuSubTriggerProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubContent: React.ForwardRefExoticComponent<Omit<RadixMenu.DropdownMenuSubContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;

declare function cn(...inputs: ClassValue[]): string;

export { AppLauncher, type AppLauncherProps, Avatar, type AvatarProps, Breadcrumb, type BreadcrumbItem, BreadcrumbLink, type BreadcrumbProps, BreadcrumbRoot, Button, type ButtonProps, Card, CardContent, CardDescription, CardFooter, CardHeader, type CardProps, CardTitle, Checkbox, type CheckboxProps, Chip, type ChipProps, ComboBox, type ComboBoxOption, type ComboBoxProps, ConfirmDialog, type ConfirmDialogProps, DataTable, type DataTablePagination, type DataTableProps, DatePicker, type DatePickerProps, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, EmptyState, type EmptyStateProps, Filter, type FilterProps, FormField, type FormFieldProps, Input, type InputProps, LoadingScreen, type MediactAppConfig, type MediactAppKey, MultiAutocomplete, type MultiAutocompleteProps, type MultiOption, NotificationBell, type NotificationBellProps, Popover, PopoverAnchor, PopoverClose, PopoverContent, PopoverTrigger, RadioGroup, RadioGroupItem, type RadioGroupProps, type RadioOption, Select, SelectItem, type SelectOption, type SelectProps, Sidebar, SidebarGroup, type SidebarGroupProps, SidebarItem, type SidebarItemProps, type SidebarProps, Skeleton, type SkeletonProps, Spinner, type SpinnerProps, Stepper, type StepperProps, type StepperStep, Switch, type SwitchProps, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, type TextareaProps, TimePicker, type TimePickerProps, type TimeValue, Toaster, type ToasterProps, Tooltip, TooltipContent, TooltipPortal, type TooltipProps, TooltipProvider, TooltipRoot, TooltipTrigger, TopNav, TopNavBrand, type TopNavBrandProps, type TopNavProps, TopNavSpacer, UserMenu, type UserMenuItem, type UserMenuProps, avatarVariants, buttonVariants, chipVariants, cn };
