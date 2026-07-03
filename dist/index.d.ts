import * as class_variance_authority_types from 'class-variance-authority/types';
import * as React$1 from 'react';
import { VariantProps } from 'class-variance-authority';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import * as RadixSwitch from '@radix-ui/react-switch';
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
type ButtonProps = React$1.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    leftIcon?: React$1.ReactNode;
    rightIcon?: React$1.ReactNode;
};
declare const Button: React$1.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

declare const solidButtonVariants: (props?: ({
    variant?: "primary" | "success" | "warning" | "info" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type SolidButtonProps = React$1.ComponentProps<"button"> & VariantProps<typeof solidButtonVariants> & {
    asChild?: boolean;
    /** Localized button text — ignored when `children` is provided. */
    label?: React$1.ReactNode;
};
/** Filled action button — for actions like Save, Upload, Confirm. */
declare const SolidButton: React$1.ForwardRefExoticComponent<Omit<SolidButtonProps, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

type AddButtonProps = React$1.ComponentProps<"button"> & VariantProps<typeof solidButtonVariants> & {
    asChild?: boolean;
    /** Localized button text — ignored when `children` is provided. */
    label?: React$1.ReactNode;
};
/**
 * "Add" button — same "[+ icon] [add_text]" pattern everywhere in the system.
 * With `asChild`, children render as-is (no Plus injected) so the caller's
 * single element (e.g. a router Link) can carry its own icon + text.
 */
declare const AddButton: React$1.ForwardRefExoticComponent<Omit<AddButtonProps, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

declare const outlineButtonVariants: (props?: ({
    variant?: "brand" | "neutral" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type OutlineButtonProps = React$1.ComponentProps<"button"> & VariantProps<typeof outlineButtonVariants> & {
    asChild?: boolean;
    /** Localized button text — ignored when `children` is provided. */
    label?: React$1.ReactNode;
};
/** Outlined action button — for secondary actions like Cancel, Edit. */
declare const OutlineButton: React$1.ForwardRefExoticComponent<Omit<OutlineButtonProps, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

type FieldSize = "sm" | "md" | "lg";

type NativeInputProps = Omit<React$1.ComponentProps<"input">, "size">;
type InputProps = NativeInputProps & {
    /** Floating label — sits inside the field as placeholder, floats up on focus or when filled. */
    label?: React$1.ReactNode;
    hint?: React$1.ReactNode;
    error?: React$1.ReactNode;
    required?: boolean;
    hideLabel?: boolean;
    /** Force the label into the floated position (e.g. for fields with fixed prefixes/masks). */
    alwaysFloatLabel?: boolean;
    size?: FieldSize;
    leftAdornment?: React$1.ReactNode;
    rightAdornment?: React$1.ReactNode;
    /** Show a clear (×) button when value is non-empty. */
    clearable?: boolean;
    containerClassName?: string;
};
declare const Input: React$1.ForwardRefExoticComponent<Omit<InputProps, "ref"> & React$1.RefAttributes<HTMLInputElement>>;

type TextareaProps = React$1.ComponentProps<"textarea"> & {
    label?: React$1.ReactNode;
    hint?: React$1.ReactNode;
    error?: React$1.ReactNode;
    required?: boolean;
    hideLabel?: boolean;
    alwaysFloatLabel?: boolean;
    size?: FieldSize;
    /** Show character count in the hint slot (requires `maxLength`). */
    showCount?: boolean;
    containerClassName?: string;
};
declare const Textarea: React$1.ForwardRefExoticComponent<Omit<TextareaProps, "ref"> & React$1.RefAttributes<HTMLTextAreaElement>>;

type CheckboxProps = Omit<React$1.ComponentProps<typeof RadixCheckbox.Root>, "asChild"> & {
    /** Label rendered to the right of the box. Click toggles the checkbox. */
    label?: React$1.ReactNode;
    /** Description rendered under the label. */
    description?: React$1.ReactNode;
    /** Error message — switches to error styling. */
    error?: React$1.ReactNode;
    /** Wrapper className (the outer label). */
    containerClassName?: string;
};
declare const Checkbox: React$1.ForwardRefExoticComponent<Omit<CheckboxProps, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

type SwitchProps = Omit<React$1.ComponentProps<typeof RadixSwitch.Root>, "asChild"> & {
    label?: React$1.ReactNode;
    description?: React$1.ReactNode;
    error?: React$1.ReactNode;
    /** Position of label relative to the switch. Default `right`. */
    labelPosition?: "left" | "right";
    containerClassName?: string;
};
declare const Switch: React$1.ForwardRefExoticComponent<Omit<SwitchProps, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

type RadioOption<V extends string = string> = {
    value: V;
    label: React$1.ReactNode;
    description?: React$1.ReactNode;
    disabled?: boolean;
};
type RadioGroupProps<V extends string = string> = Omit<React$1.ComponentProps<typeof RadixRadio.Root>, "asChild" | "children"> & {
    label?: React$1.ReactNode;
    hint?: React$1.ReactNode;
    error?: React$1.ReactNode;
    required?: boolean;
    /** Options to render. Pass children directly for custom layouts. */
    options?: RadioOption<V>[];
    /** Layout direction. Default `vertical`. */
    orientation?: "vertical" | "horizontal";
    containerClassName?: string;
    children?: React$1.ReactNode;
};
declare function RadioGroup<V extends string = string>({ id, className, containerClassName, label, hint, error, required, options, orientation, children, ...props }: RadioGroupProps<V>): React$1.JSX.Element;
type RadioGroupItemProps = Omit<React$1.ComponentProps<typeof RadixRadio.Item>, "asChild"> & {
    description?: React$1.ReactNode;
};
declare const RadioGroupItem: React$1.ForwardRefExoticComponent<Omit<RadioGroupItemProps, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

type SelectOption<V extends string = string> = {
    value: V;
    label: React$1.ReactNode;
    disabled?: boolean;
};
type SelectProps<V extends string = string> = {
    id?: string;
    label?: React$1.ReactNode;
    hint?: React$1.ReactNode;
    error?: React$1.ReactNode;
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
    children?: React$1.ReactNode;
};
declare function Select<V extends string = string>({ id, label, hint, error, required, hideLabel, alwaysFloatLabel, placeholder, value, defaultValue, onChange, options, disabled, size, className, containerClassName, children, }: SelectProps<V>): React$1.JSX.Element;
declare const SelectItem: React$1.ForwardRefExoticComponent<Omit<RadixSelect.SelectItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const chipVariants: (props?: ({
    variant?: "primary" | "success" | "warning" | "info" | "neutral" | "danger" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
    interactive?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type ChipProps = React$1.ComponentProps<"span"> & VariantProps<typeof chipVariants> & {
    leftIcon?: React$1.ReactNode;
    /** Show an × button. Calls `onRemove` (preferred) or falls back to `onClick`. */
    removable?: boolean;
    onRemove?: (e: React$1.MouseEvent<HTMLButtonElement>) => void;
};
declare const Chip: React$1.ForwardRefExoticComponent<Omit<ChipProps, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;

declare const avatarVariants: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type AvatarProps = Omit<React$1.ComponentProps<typeof RadixAvatar.Root>, "asChild"> & VariantProps<typeof avatarVariants> & {
    /** Image URL. */
    src?: string;
    /** Alt text + source for fallback initials when `fallback` is omitted. */
    name?: string;
    /** Custom fallback content (overrides initials). */
    fallback?: React$1.ReactNode;
};
declare const Avatar: React$1.ForwardRefExoticComponent<Omit<AvatarProps, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;

type TopNavProps = React$1.ComponentProps<"header"> & {
    /** Render as fixed/sticky bar that floats with rounded corners. Default `false` (inline). */
    floating?: boolean;
};
declare const TopNav: React$1.ForwardRefExoticComponent<Omit<TopNavProps, "ref"> & React$1.RefAttributes<HTMLElement>>;
type TopNavBrandProps = React$1.ComponentProps<"div"> & {
    logo?: React$1.ReactNode;
};
declare const TopNavBrand: React$1.ForwardRefExoticComponent<Omit<TopNavBrandProps, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const TopNavSpacer: ({ className }: {
    className?: string;
}) => React$1.JSX.Element;
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
    icon?: React$1.ReactNode;
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
declare function AppLauncher({ apps, order, onAppClick, label, comingSoonText, className, }: AppLauncherProps): React$1.JSX.Element;
type NotificationBellProps = React$1.ComponentProps<"button"> & {
    hasUnread?: boolean;
    unreadCount?: number;
    label?: string;
};
declare const NotificationBell: React$1.ForwardRefExoticComponent<Omit<NotificationBellProps, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
type UserMenuItem = {
    label: React$1.ReactNode;
    onClick?: () => void;
    href?: string;
};
type UserMenuProps = {
    user: {
        name?: string;
        src?: string;
        role?: React$1.ReactNode;
    };
    /** Body items rendered between the role and the bottom row. */
    items?: UserMenuItem[];
    /** Click handler for the Log Out button. Pass `null` to hide the button. */
    onLogout?: (() => void) | null;
    logoutLabel?: React$1.ReactNode;
    /** Slot rendered to the left of the Log Out button — typically a language switcher. */
    bottomLeft?: React$1.ReactNode;
    /** Tooltip / aria-label for the trigger. Default "Account". */
    label?: string;
    className?: string;
};
/**
 * Profile dropdown — matches `mediact-portal-web/src/components/shared/Sidebar.tsx`'s
 * profile menu: centered avatar + name + role header, full-width menu items, and
 * a bottom row that pairs an optional language switcher with a red Log Out button.
 */
declare function UserMenu({ user, items, onLogout, logoutLabel, bottomLeft, label, className, }: UserMenuProps): React$1.JSX.Element;

type SidebarProps = React$1.ComponentProps<"aside"> & {
    /** Logo / brand block rendered at the top. */
    header?: React$1.ReactNode;
    /** Footer block rendered at the bottom (e.g. version label). */
    footer?: React$1.ReactNode;
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
declare const Sidebar: React$1.ForwardRefExoticComponent<Omit<SidebarProps, "ref"> & React$1.RefAttributes<HTMLElement>>;
type IconType = React$1.ComponentType<{
    className?: string;
}>;
type SidebarItemProps = {
    id: string;
    label: React$1.ReactNode;
    icon?: IconType;
    href?: string;
    onClick?: () => void;
    /** Optional small text below the label (badge / sub-label). */
    badge?: React$1.ReactNode;
    className?: string;
};
declare function SidebarItem({ id, label, icon: Icon, href, onClick, badge, className, }: SidebarItemProps): React$1.JSX.Element;
type SidebarGroupProps = {
    /** Stable id used for the chevron-toggle aria. */
    id: string;
    label: React$1.ReactNode;
    icon?: IconType;
    /** Whether the group is expanded by default. */
    defaultExpanded?: boolean;
    /** Controlled expanded state. */
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    children?: React$1.ReactNode;
    className?: string;
};
declare function SidebarGroup({ id, label, icon: Icon, defaultExpanded, expanded, onExpandedChange, children, className, }: SidebarGroupProps): React$1.JSX.Element;

type FormFieldProps = {
    /** Field label rendered above the input. Omit for unlabeled fields. */
    label?: React$1.ReactNode;
    /** Helper text under the input. Hidden when `error` is set. */
    hint?: React$1.ReactNode;
    /** Error message — when truthy, switches the field to error styling. */
    error?: React$1.ReactNode;
    /** Marks the label with a red asterisk. Does NOT enforce HTML required (caller controls). */
    required?: boolean;
    /** id wired to the input via htmlFor — caller passes the same id to the input. */
    htmlFor?: string;
    /** Visually hide the label but keep it for screen readers. */
    hideLabel?: boolean;
    className?: string;
    children: React$1.ReactNode;
};
/**
 * Layout shell shared by every form primitive (Input, Textarea, Select, ...).
 * Renders: [Label] [children] [hint | error]
 */
declare function FormField({ label, hint, error, required, htmlFor, hideLabel, className, children, }: FormFieldProps): React$1.JSX.Element;

type DatePickerProps = {
    id?: string;
    label?: React$1.ReactNode;
    hint?: React$1.ReactNode;
    error?: React$1.ReactNode;
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
declare function DatePicker({ id, label, hint, error, required, hideLabel, alwaysFloatLabel, placeholder, value, defaultValue, onChange, displayFormat, disabledDate, minDate, maxDate, disabled, size, captionLayout, fromYear, toYear, className, containerClassName, }: DatePickerProps): React$1.JSX.Element;

/** "HH:mm" string in 24-hour format. */
type TimeValue = string;
type TimePickerProps = {
    id?: string;
    label?: React$1.ReactNode;
    hint?: React$1.ReactNode;
    error?: React$1.ReactNode;
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
declare function TimePicker({ id, label, hint, error, required, hideLabel, alwaysFloatLabel, value, defaultValue, onChange, minuteStep, step, disabled, size, className, containerClassName, }: TimePickerProps): React$1.JSX.Element;

type ComboBoxOption<V extends string = string> = {
    value: V;
    label: string;
    description?: string;
    disabled?: boolean;
};
type ComboBoxProps<V extends string = string> = {
    id?: string;
    label?: React$1.ReactNode;
    hint?: React$1.ReactNode;
    error?: React$1.ReactNode;
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
declare function ComboBox<V extends string = string>({ id, label, hint, error, required, hideLabel, alwaysFloatLabel, placeholder, searchPlaceholder, emptyText, value, defaultValue, onChange, options, onSearch, disabled, size, className, containerClassName, }: ComboBoxProps<V>): React$1.JSX.Element;

type MultiOption<V extends string = string> = {
    value: V;
    label: string;
    disabled?: boolean;
};
type MultiAutocompleteProps<V extends string = string> = {
    id?: string;
    label?: React$1.ReactNode;
    hint?: React$1.ReactNode;
    error?: React$1.ReactNode;
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
declare function MultiAutocomplete<V extends string = string>({ id, label, hint, error, required, hideLabel, alwaysFloatLabel, placeholder, searchPlaceholder, emptyText, value, defaultValue, onChange, options, onSearch, maxVisibleChips, maxItems, disabled, size, className, containerClassName, }: MultiAutocompleteProps<V>): React$1.JSX.Element;

declare const Table: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>, "ref"> & React$1.RefAttributes<HTMLTableElement>>;
declare const TableHeader: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>, "ref"> & React$1.RefAttributes<HTMLTableSectionElement>>;
declare const TableBody: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>, "ref"> & React$1.RefAttributes<HTMLTableSectionElement>>;
declare const TableFooter: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>, "ref"> & React$1.RefAttributes<HTMLTableSectionElement>>;
declare const TableRow: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>, "ref"> & React$1.RefAttributes<HTMLTableRowElement>>;
declare const TableHead: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>, "ref"> & React$1.RefAttributes<HTMLTableCellElement>>;
declare const TableCell: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>, "ref"> & React$1.RefAttributes<HTMLTableCellElement>>;
declare const TableCaption: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & React$1.RefAttributes<HTMLTableCaptionElement>>;

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
    empty?: React$1.ReactNode;
    className?: string;
};
declare function DataTable<TData>({ columns, data, isLoading, pagination, sorting: sortingProp, onSortingChange, manualSorting, enableSelection, rowSelection: rowSelectionProp, onRowSelectionChange, getRowId, onRowClick, stickyHeader, empty, className, }: DataTableProps<TData>): React$1.JSX.Element;

declare const cardVariants: (props?: ({
    variant?: "flat" | "elevated" | "outlined" | null | undefined;
    padding?: "sm" | "md" | "lg" | "none" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type CardProps = React$1.ComponentProps<"div"> & VariantProps<typeof cardVariants>;
declare const Card: React$1.ForwardRefExoticComponent<Omit<CardProps, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CardHeader: ({ className, ...props }: React$1.ComponentProps<"div">) => React$1.JSX.Element;
declare const CardTitle: ({ className, ...props }: React$1.ComponentProps<"h3">) => React$1.JSX.Element;
declare const CardDescription: ({ className, ...props }: React$1.ComponentProps<"p">) => React$1.JSX.Element;
declare const CardContent: ({ className, ...props }: React$1.ComponentProps<"div">) => React$1.JSX.Element;
declare const CardFooter: ({ className, ...props }: React$1.ComponentProps<"div">) => React$1.JSX.Element;

declare const Tabs: React$1.ForwardRefExoticComponent<RadixTabs.TabsProps & React$1.RefAttributes<HTMLDivElement>>;
declare const tabsListVariants: (props?: ({
    variant?: "underline" | "pill" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare const tabsTriggerVariants: (props?: ({
    variant?: "underline" | "pill" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type TabsListProps = React$1.ComponentProps<typeof RadixTabs.List> & VariantProps<typeof tabsListVariants>;
declare const TabsList: React$1.ForwardRefExoticComponent<Omit<TabsListProps, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
type TabsTriggerProps = React$1.ComponentProps<typeof RadixTabs.Trigger> & VariantProps<typeof tabsTriggerVariants>;
declare const TabsTrigger: React$1.ForwardRefExoticComponent<Omit<TabsTriggerProps, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const TabsContent: React$1.ForwardRefExoticComponent<Omit<RadixTabs.TabsContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

type BreadcrumbItem = {
    label: React$1.ReactNode;
    /** Optional leading icon — typically used on the first/Home item. */
    icon?: React$1.ReactNode;
    href?: string;
    /** When provided, renders as <button> instead of <a>. */
    onClick?: () => void;
};
type BreadcrumbProps = React$1.ComponentProps<"nav"> & {
    items: BreadcrumbItem[];
    /** Custom separator. Default `"/"` (forward slash). */
    separator?: React$1.ReactNode;
    /** Collapse middle items when more than this number. Default `0` (no collapse). */
    maxItems?: number;
};
declare function Breadcrumb({ items, separator, maxItems, className, ...props }: BreadcrumbProps): React$1.JSX.Element;
/** Low-level escape hatch — use `<BreadcrumbRoot>` + `<BreadcrumbLink>` for custom rendering. */
declare const BreadcrumbRoot: ({ className, ...props }: React$1.ComponentProps<"nav">) => React$1.JSX.Element;
declare const BreadcrumbLink: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLAnchorElement> & React$1.AnchorHTMLAttributes<HTMLAnchorElement> & {
    asChild?: boolean;
}, "ref"> & React$1.RefAttributes<HTMLAnchorElement>>;

type StepperStep = {
    label: React$1.ReactNode;
    description?: React$1.ReactNode;
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
declare function Stepper({ steps, current, orientation, className, onStepClick, }: StepperProps): React$1.JSX.Element;

type SkeletonProps = React$1.ComponentProps<"div"> & {
    /** Shape preset. `text` defaults to a 1em-height bar. `circle` is square + rounded-full. */
    shape?: "rect" | "text" | "circle";
};
declare const Skeleton: React$1.ForwardRefExoticComponent<Omit<SkeletonProps, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

type SpinnerProps = React$1.ComponentProps<"span"> & {
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    /** Optional accessible label. Default `"Loading"`. */
    label?: string;
};
declare const Spinner: React$1.ForwardRefExoticComponent<Omit<SpinnerProps, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;
/** Full-screen / panel-fill loading state. Centers a spinner with optional label. */
declare function LoadingScreen({ label, className, }: {
    label?: React$1.ReactNode;
    className?: string;
}): React$1.JSX.Element;

type EmptyStateProps = React$1.ComponentProps<"div"> & {
    /** Icon / illustration shown in the colored circle. Caller controls size + color
     * (e.g. `<Calendar className="size-15 text-info-blue-primary" />`). */
    icon?: React$1.ReactNode;
    title?: React$1.ReactNode;
    /** Body message — accepts strings or rich content. */
    description?: React$1.ReactNode;
    /** Action(s) — typically a `<Button>` or pair of buttons. */
    action?: React$1.ReactNode;
    /** Background tone of the icon circle. Default `info`. Set to `none` to
     * skip the wrapper entirely (caller renders their own illustration). */
    iconTone?: "info" | "success" | "warning" | "danger" | "neutral" | "none";
};
declare function EmptyState({ icon, title, description, action, iconTone, className, ...props }: EmptyStateProps): React$1.JSX.Element;

type ToasterProps = React$1.ComponentProps<typeof Toaster$1>;
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
declare function Toaster(props: ToasterProps): React$1.JSX.Element;

declare const Popover: React$1.FC<RadixPopover.PopoverProps>;
declare const PopoverTrigger: React$1.ForwardRefExoticComponent<RadixPopover.PopoverTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const PopoverAnchor: React$1.ForwardRefExoticComponent<RadixPopover.PopoverAnchorProps & React$1.RefAttributes<HTMLDivElement>>;
declare const PopoverClose: React$1.ForwardRefExoticComponent<RadixPopover.PopoverCloseProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const PopoverContent: React$1.ForwardRefExoticComponent<Omit<RadixPopover.PopoverContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const Dialog: React$1.FC<RadixDialog.DialogProps>;
declare const DialogTrigger: React$1.ForwardRefExoticComponent<RadixDialog.DialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DialogPortal: React$1.FC<RadixDialog.DialogPortalProps>;
declare const DialogClose: React$1.ForwardRefExoticComponent<RadixDialog.DialogCloseProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DialogOverlay: React$1.ForwardRefExoticComponent<Omit<RadixDialog.DialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
type DialogContentProps = React$1.ComponentProps<typeof RadixDialog.Content> & {
    size?: "sm" | "md" | "lg" | "xl";
    /** Show the built-in close (×) button. Default `true`. */
    showClose?: boolean;
};
declare const DialogContent: React$1.ForwardRefExoticComponent<Omit<DialogContentProps, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DialogHeader: ({ className, ...props }: React$1.ComponentProps<"div">) => React$1.JSX.Element;
declare const DialogFooter: ({ className, ...props }: React$1.ComponentProps<"div">) => React$1.JSX.Element;
declare const DialogTitle: React$1.ForwardRefExoticComponent<Omit<RadixDialog.DialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
declare const DialogDescription: React$1.ForwardRefExoticComponent<Omit<RadixDialog.DialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;

type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: React$1.ReactNode;
    description?: React$1.ReactNode;
    /** Visual tone — affects icon and confirm button variant. */
    tone?: "info" | "warning" | "danger" | "success";
    confirmLabel?: React$1.ReactNode;
    cancelLabel?: React$1.ReactNode;
    /** Called on Confirm. Return a Promise to keep dialog open with loading state until it resolves. */
    onConfirm?: () => void | Promise<void>;
    /** Called on Cancel/× (defaults to closing the dialog). */
    onCancel?: () => void;
    size?: React$1.ComponentProps<typeof DialogContent>["size"];
};
declare function ConfirmDialog({ open, onOpenChange, title, description, tone, confirmLabel, cancelLabel, onConfirm, onCancel, size, }: ConfirmDialogProps): React$1.JSX.Element;

type PopoverContentProps = React$1.ComponentProps<typeof RadixPopover.Content>;
type FilterProps = {
    /** Popover content — typically the filter form fields plus an Apply button. */
    children: React$1.ReactNode;
    /** Trigger button label. Default `"Filter"`. */
    triggerLabel?: React$1.ReactNode;
    /** Replace the trigger entirely (overrides `triggerLabel`/`triggerProps`). */
    trigger?: React$1.ReactNode;
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
declare function Filter({ children, triggerLabel, trigger, triggerProps, open, defaultOpen, onOpenChange, align, side, sideOffset, contentClassName, }: FilterProps): React$1.JSX.Element;

declare const TooltipProvider: React$1.FC<RadixTooltip.TooltipProviderProps>;
declare const TooltipRoot: React$1.FC<RadixTooltip.TooltipProps>;
declare const TooltipTrigger: React$1.ForwardRefExoticComponent<RadixTooltip.TooltipTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const TooltipPortal: React$1.FC<RadixTooltip.TooltipPortalProps>;
type TooltipContentProps = React$1.ComponentProps<typeof RadixTooltip.Content> & {
    /** Show a pointing arrow toward the trigger. Default `true`. */
    arrow?: boolean;
};
declare const TooltipContent: React$1.ForwardRefExoticComponent<Omit<TooltipContentProps, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
type TooltipProps = {
    content: React$1.ReactNode;
    children: React$1.ReactNode;
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
declare function Tooltip({ content, children, side, align, delayDuration, open, defaultOpen, onOpenChange, asChild, arrow, }: TooltipProps): React$1.JSX.Element;

declare const DropdownMenu: React$1.FC<RadixMenu.DropdownMenuProps>;
declare const DropdownMenuTrigger: React$1.ForwardRefExoticComponent<RadixMenu.DropdownMenuTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DropdownMenuGroup: React$1.ForwardRefExoticComponent<RadixMenu.DropdownMenuGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuRadioGroup: React$1.ForwardRefExoticComponent<RadixMenu.DropdownMenuRadioGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuPortal: React$1.FC<RadixMenu.DropdownMenuPortalProps>;
declare const DropdownMenuSub: React$1.FC<RadixMenu.DropdownMenuSubProps>;
declare const DropdownMenuContent: React$1.ForwardRefExoticComponent<Omit<RadixMenu.DropdownMenuContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
type ItemProps = React$1.ComponentProps<typeof RadixMenu.Item> & {
    destructive?: boolean;
    inset?: boolean;
};
declare const DropdownMenuItem: React$1.ForwardRefExoticComponent<Omit<ItemProps, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuCheckboxItem: React$1.ForwardRefExoticComponent<Omit<RadixMenu.DropdownMenuCheckboxItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuRadioItem: React$1.ForwardRefExoticComponent<Omit<RadixMenu.DropdownMenuRadioItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuLabel: React$1.ForwardRefExoticComponent<Omit<RadixMenu.DropdownMenuLabelProps & React$1.RefAttributes<HTMLDivElement> & {
    inset?: boolean;
}, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSeparator: React$1.ForwardRefExoticComponent<Omit<RadixMenu.DropdownMenuSeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubTrigger: React$1.ForwardRefExoticComponent<Omit<RadixMenu.DropdownMenuSubTriggerProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubContent: React$1.ForwardRefExoticComponent<Omit<RadixMenu.DropdownMenuSubContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

/**
 * Shared types for schedule components (ShiftTable / TimeGrid).
 * All display strings (dates, Buddhist years, weekday labels, time ranges)
 * are pre-formatted by the caller — these components never do date math.
 */
/** Constrained avatar color palette — maps to design tokens, never hex. */
type AssignmentColor = "blue" | "green" | "orange" | "yellow" | "red" | "teal" | "gray";
/** Token class lookup for {@link AssignmentColor}. */
declare const ASSIGNMENT_COLOR_CLASSES: Record<AssignmentColor, string>;
/** One person assigned to a slot (doctor/nurse). */
type AssignmentSlot = {
    id: string;
    /** 1-based order number shown in the badge. */
    order: number;
    /** Display name, e.g. "นพ. วรวิทย์ ตันสกุล". */
    name: string;
    color: AssignmentColor;
    /**
     * Explicit avatar initials (e.g. "วก"). Falls back to auto-initials
     * derived from `name` when omitted.
     */
    avatarLabel?: string;
    /** Avatar image URL. */
    src?: string;
};
/** A shift-period column in {@link ShiftTable} (Pattern A). */
type ShiftTableColumn = {
    id: string;
    /** Shift name, e.g. "เช้า". */
    name: string;
    /** Pre-formatted time range, e.g. "08:00 – 16:00". */
    timeRange: string;
    /** Number of ordered slots per cell. */
    slotCount: number;
};
/** A day row in {@link ShiftTable} (Pattern A). */
type ShiftTableDay = {
    /**
     * Stable identifier — **ต้องเป็น Gregorian ISO date** เช่น `"2026-06-02"` (ค.ศ.)
     * ห้ามใช้ปีพุทธศักราช (2569) เพราะ component ใช้ id นี้คำนวณ `isToday` อัตโนมัติ
     */
    id: string;
    /** Day-of-month label, e.g. 2. */
    dayNumber: number;
    /** Pre-formatted weekday label, e.g. "อังคาร". */
    weekdayLabel: string;
    isToday?: boolean;
    isWeekend?: boolean;
    /** Filled slots per column id. Missing keys = empty cell. */
    slots: Record<string, AssignmentSlot[]>;
};
/** A room/resource column in {@link TimeGrid} (Pattern B). */
type TimeGridRoom = {
    id: string;
    /** Room name, e.g. "ห้องตรวจ 1". */
    name: string;
    icon?: React.ReactNode;
};
/** An event block in {@link TimeGrid} (Pattern B). */
type TimeGridEventData = {
    id: string;
    roomId: string;
    /** Display name, e.g. "นพ. วรวิทย์ ตันสกุล". */
    name: string;
    color: AssignmentColor;
    avatarLabel?: string;
    src?: string;
    /** 24h "HH:mm", e.g. "08:00". */
    start: string;
    /** 24h "HH:mm", e.g. "12:00". */
    end: string;
    /** Pre-formatted time label. Defaults to `${start} – ${end}`. */
    timeLabel?: string;
    /** Optional note line, e.g. "เฉพาะผู้ป่วยนัด". */
    note?: string;
};

type ScheduleAvatarProps = Omit<AvatarProps, "fallback"> & {
    /** Constrained palette color (token-backed, never hex). */
    color: AssignmentColor;
    /**
     * Explicit initials (e.g. "วก"). Falls back to auto-initials derived
     * from `name` when omitted.
     */
    label?: string;
};
/** Avatar with a constrained per-person color from the schedule palette. */
declare const ScheduleAvatar: React$1.ForwardRefExoticComponent<Omit<ScheduleAvatarProps, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;

declare const statusBadgeVariants: (props?: ({
    tone?: "success" | "warning" | "info" | "neutral" | "danger" | null | undefined;
    size?: "sm" | "md" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type StatusBadgeProps = React$1.ComponentProps<"span"> & VariantProps<typeof statusBadgeVariants> & {
    /** Hide the leading dot. */
    hideDot?: boolean;
};
/**
 * Dot + label status pill, e.g. "● Published", "● Draft",
 * "● มีการแก้ไขที่ยังไม่บันทึก". Dot inherits the tone's text color.
 */
declare const StatusBadge: React$1.ForwardRefExoticComponent<Omit<StatusBadgeProps, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;

declare const dateNavigatorVariants: (props?: ({
    size?: "sm" | "md" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type DateNavigatorUnit = "month" | "day";
type DateNavigatorProps = Omit<React$1.ComponentProps<"div">, "children" | "onChange"> & VariantProps<typeof dateNavigatorVariants> & {
    /**
     * Controlled mode — เมื่อส่ง `value` มา component จะ format label
     * และคำนวณ ‹ › ให้เองตาม `unit` (สไตล์เดียวกับ MUI controlled component)
     */
    value?: Date;
    /** เรียกพร้อม Date ใหม่เมื่อกด ‹ › (เฉพาะ controlled mode) */
    onChange?: (date: Date) => void;
    /** Granularity ของ label และ step. @default "month" */
    unit?: DateNavigatorUnit;
    /**
     * BCP-47 locale สำหรับ format label.
     * @default "th-TH" — แสดงปีพุทธศักราชอัตโนมัติ (เช่น "มิถุนายน 2569")
     */
    locale?: string;
    /** ปุ่ม ‹ disable อัตโนมัติเมื่อ step ถัดไปต่ำกว่านี้ (controlled mode) */
    minDate?: Date;
    /** ปุ่ม › disable อัตโนมัติเมื่อ step ถัดไปเกินกว่านี้ (controlled mode) */
    maxDate?: Date;
    /**
     * Custom label — override การ format จาก `value`
     * (ใช้เมื่อ format มาตรฐานไม่ครอบ เช่น "สัปดาห์ที่ 24 / 2569")
     */
    label?: React$1.ReactNode;
    /** Hook เพิ่มเติมเมื่อกด ‹ (ทำงานร่วมกับ onChange ได้) */
    onPrev?: () => void;
    /** Hook เพิ่มเติมเมื่อกด › (ทำงานร่วมกับ onChange ได้) */
    onNext?: () => void;
    /** Override การ disable อัตโนมัติจาก minDate */
    prevDisabled?: boolean;
    /** Override การ disable อัตโนมัติจาก maxDate */
    nextDisabled?: boolean;
    /** aria-label ปุ่ม ‹ */
    prevLabel?: string;
    /** aria-label ปุ่ม › */
    nextLabel?: string;
};
/**
 * `‹ label ›` stepper สำหรับเลื่อนเดือน/วัน
 *
 * 2 โหมด:
 * - **Controlled (แนะนำ):** ส่ง `value` + `onChange` — format ไทย/พ.ศ. ให้เอง
 *   ผ่าน Intl ตาม `locale` และ step ตาม `unit`
 * - **Manual:** ส่ง `label` + `onPrev`/`onNext` — ควบคุมเองทั้งหมด
 */
declare const DateNavigator: React$1.ForwardRefExoticComponent<Omit<DateNavigatorProps, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

type AssignmentChipProps = Omit<React$1.ComponentProps<"button">, "onClick" | "children" | "slot"> & {
    slot: AssignmentSlot;
    /** Hide the order-number badge. */
    hideOrder?: boolean;
    /** Renders as a non-interactive `<div>` when omitted. */
    onClick?: (slot: AssignmentSlot) => void;
};
/**
 * Filled assignment slot in a schedule cell:
 * `[order badge] [colored avatar] [name]`.
 */
declare const AssignmentChip: React$1.ForwardRefExoticComponent<Omit<AssignmentChipProps, "ref"> & React$1.RefAttributes<HTMLElement>>;

type AddSlotButtonProps = Omit<React$1.ComponentProps<"button">, "children"> & {
    /** Localized label, e.g. "เพิ่มหมอ" / "เพิ่มแพทย์เวร". */
    label?: string;
    icon?: React$1.ReactNode;
};
/** Dashed "+ add" placeholder for an empty schedule slot. */
declare const AddSlotButton: React$1.ForwardRefExoticComponent<Omit<AddSlotButtonProps, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

type ShiftTableProps = Omit<React$1.ComponentProps<"div">, "children"> & {
    /** Shift-period columns, e.g. เช้า / บ่าย / ดึก. */
    columns: ShiftTableColumn[];
    /** Day rows (typically one month). */
    days: ShiftTableDay[];
    /** Click on a filled slot chip. */
    onSlotClick?: (dayId: string, columnId: string, slot: AssignmentSlot) => void;
    /** Click on an empty add-slot placeholder. `order` is 1-based. */
    onAddSlot?: (dayId: string, columnId: string, order: number) => void;
    /** Click on a column header's edit (pencil) button. */
    onEditColumn?: (columnId: string) => void;
    /** Label for empty slots, e.g. "เพิ่มหมอ". */
    addLabel?: string;
    /** Header label for the day column. */
    dayColumnLabel?: string;
    /** Keep the header visible while scrolling vertically. */
    stickyHeader?: boolean;
    /** Max body height (enables vertical scroll), e.g. "70vh" or 640. */
    maxHeight?: React$1.CSSProperties["maxHeight"];
    /**
     * Min width (px) ของแต่ละคอลัมน์กะ — ลดเมื่อพื้นที่แคบเพื่อเลี่ยง
     * horizontal scroll
     * @default 220
     */
    minColumnWidth?: number;
};
/**
 * Pattern A — monthly shift table (ตารางกะ).
 * Rows = days, columns = shift periods, cells = ordered assignment slots.
 * Purely presentational: all data via props, interactions via callbacks.
 */
declare const ShiftTable: React$1.ForwardRefExoticComponent<Omit<ShiftTableProps, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

type TimeGridProps = Omit<React$1.ComponentProps<"div">, "children"> & {
    /** Room/resource columns. */
    rooms: TimeGridRoom[];
    /** Events for the displayed day (all rooms, flat). */
    events: TimeGridEventData[];
    /** Window start, 24h "HH:mm", e.g. "08:00". */
    windowStart: string;
    /** Window end, 24h "HH:mm", e.g. "12:00". */
    windowEnd: string;
    /** Time-axis tick interval in minutes. @default 30 */
    tickMinutes?: number;
    /** Vertical scale. @default 2 (30 min = 60px) */
    pixelsPerMinute?: number;
    /** Click on an event card. */
    onEventClick?: (event: TimeGridEventData) => void;
    /** Click on a room header's edit (pencil) button. */
    onEditRoom?: (roomId: string) => void;
    /**
     * Click on an empty-gap placeholder. When provided, dashed add
     * placeholders render in event-free intervals of each room column.
     */
    onAddEvent?: (roomId: string, startMinutes: number) => void;
    /** Label for add placeholders, e.g. "เพิ่มแพทย์เวร". */
    addLabel?: string;
    /** Keep the room header visible while scrolling vertically. */
    stickyHeader?: boolean;
    /** Max height (enables vertical scroll), e.g. "70vh" or 640. */
    maxHeight?: React$1.CSSProperties["maxHeight"];
    /**
     * Min width (px) ของแต่ละคอลัมน์ห้อง — ลดเมื่อพื้นที่แคบเพื่อเลี่ยง
     * horizontal scroll (ซึ่งพ่วง vertical scrollbar ~17px ตามมา)
     * @default 240
     */
    minColumnWidth?: number;
};
/**
 * Pattern B — daily resource time grid (ตารางห้องตรวจ).
 * Columns = rooms, vertical axis = time; events are absolutely positioned
 * by start/end time, with side-by-side layout for overlaps.
 * Purely presentational. Click-only (no drag/resize).
 *
 * Note: event cards intentionally use a uniform tint (per design) —
 * `event.color` differentiates people via the avatar only.
 */
declare const TimeGrid: React$1.ForwardRefExoticComponent<Omit<TimeGridProps, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

/**
 * Pure layout math for TimeGrid (Pattern B).
 * No React imports — fully unit-testable.
 */
/** Parse 24h "HH:mm" into minutes since midnight. Returns NaN if malformed. */
declare function parseTimeToMinutes(time: string): number;
type EventLayoutInput = {
    id: string;
    /** 24h "HH:mm". */
    start: string;
    /** 24h "HH:mm". */
    end: string;
};
type EventLayout = {
    id: string;
    /** Pixels from the top of the time window. */
    top: number;
    /** Pixel height. */
    height: number;
    /** CSS percentage, e.g. "0%" / "50%". */
    left: string;
    /** CSS percentage, e.g. "100%" / "50%". */
    width: string;
    /** 0-based overlap column index. */
    column: number;
    /** Total overlap columns in this event's cluster. */
    totalColumns: number;
};
/**
 * Compute absolute positions for events within a time window.
 *
 * Overlapping events in the same cluster are laid out side-by-side:
 * each takes the leftmost free column, width = 100% / cluster columns.
 * Events fully outside the window are dropped; partial ones are clamped.
 */
declare function computeEventLayouts(events: EventLayoutInput[], windowStart: string, windowEnd: string, pixelsPerMinute: number): EventLayout[];
type FreeGap = {
    /** Pixels from the top of the time window. */
    top: number;
    /** Pixel height. */
    height: number;
    /** Gap start in minutes since midnight. */
    startMinutes: number;
};
/**
 * Free (event-less) intervals within the window, in pixels.
 * Used to position "add" placeholders. Gaps shorter than `minMinutes`
 * are skipped.
 */
declare function computeFreeGaps(events: EventLayoutInput[], windowStart: string, windowEnd: string, pixelsPerMinute: number, minMinutes?: number): FreeGap[];

declare function cn(...inputs: ClassValue[]): string;

export { ASSIGNMENT_COLOR_CLASSES, AddButton, type AddButtonProps, AddSlotButton, type AddSlotButtonProps, AppLauncher, type AppLauncherProps, AssignmentChip, type AssignmentChipProps, type AssignmentColor, type AssignmentSlot, Avatar, type AvatarProps, Breadcrumb, type BreadcrumbItem, BreadcrumbLink, type BreadcrumbProps, BreadcrumbRoot, Button, type ButtonProps, Card, CardContent, CardDescription, CardFooter, CardHeader, type CardProps, CardTitle, Checkbox, type CheckboxProps, Chip, type ChipProps, ComboBox, type ComboBoxOption, type ComboBoxProps, ConfirmDialog, type ConfirmDialogProps, DataTable, type DataTablePagination, type DataTableProps, DateNavigator, type DateNavigatorProps, type DateNavigatorUnit, DatePicker, type DatePickerProps, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, EmptyState, type EmptyStateProps, type EventLayout, type EventLayoutInput, Filter, type FilterProps, FormField, type FormFieldProps, type FreeGap, Input, type InputProps, LoadingScreen, type MediactAppConfig, type MediactAppKey, MultiAutocomplete, type MultiAutocompleteProps, type MultiOption, NotificationBell, type NotificationBellProps, OutlineButton, type OutlineButtonProps, Popover, PopoverAnchor, PopoverClose, PopoverContent, PopoverTrigger, RadioGroup, RadioGroupItem, type RadioGroupProps, type RadioOption, ScheduleAvatar, type ScheduleAvatarProps, Select, SelectItem, type SelectOption, type SelectProps, ShiftTable, type ShiftTableColumn, type ShiftTableDay, type ShiftTableProps, Sidebar, SidebarGroup, type SidebarGroupProps, SidebarItem, type SidebarItemProps, type SidebarProps, Skeleton, type SkeletonProps, SolidButton, type SolidButtonProps, Spinner, type SpinnerProps, StatusBadge, type StatusBadgeProps, Stepper, type StepperProps, type StepperStep, Switch, type SwitchProps, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, type TextareaProps, TimeGrid, type TimeGridEventData, type TimeGridProps, type TimeGridRoom, TimePicker, type TimePickerProps, type TimeValue, Toaster, type ToasterProps, Tooltip, TooltipContent, TooltipPortal, type TooltipProps, TooltipProvider, TooltipRoot, TooltipTrigger, TopNav, TopNavBrand, type TopNavBrandProps, type TopNavProps, TopNavSpacer, UserMenu, type UserMenuItem, type UserMenuProps, avatarVariants, buttonVariants, chipVariants, cn, computeEventLayouts, computeFreeGaps, outlineButtonVariants, parseTimeToMinutes, solidButtonVariants, statusBadgeVariants };
