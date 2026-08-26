// Primitives
export { Button, buttonVariants, type ButtonProps } from "./ui/Button";
export { AddButton, type AddButtonProps } from "./ui/AddButton";
export {
  SolidButton,
  solidButtonVariants,
  type SolidButtonProps,
} from "./ui/SolidButton";
export {
  OutlineButton,
  outlineButtonVariants,
  type OutlineButtonProps,
} from "./ui/OutlineButton";
export {
  FormatInput,
  FORMAT_PRESETS,
  type FormatInputProps,
  type FormatPreset,
  type CustomFormat,
} from "./ui/FormatInput";
export { Input, type InputProps } from "./ui/Input";
export { Textarea, type TextareaProps } from "./ui/Textarea";
export { Checkbox, type CheckboxProps } from "./ui/Checkbox";
export {
  checkboxShapeClasses,
  radioShapeClasses,
  type ToggleSize,
} from "./ui/toggle-parts";
export {
  Switch,
  type SwitchProps,
  type SwitchTrackLabels,
} from "./ui/Switch";
export { switchToneClasses, type SwitchTone } from "./ui/toggle-parts";
export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
  type RadioOption,
} from "./ui/RadioGroup";
export {
  Select,
  SelectItem,
  type SelectProps,
  type SelectOption,
} from "./ui/Select";
export {
  CheckboxGroup,
  CheckboxGroupItem,
  type CheckboxGroupProps,
  type CheckboxOption,
} from "./ui/CheckboxGroup";
export {
  PillSwitch,
  type PillSwitchProps,
  type PillSwitchOption,
} from "./ui/PillSwitch";
export { Chip, chipVariants, type ChipProps } from "./ui/Chip";
export { Avatar, avatarVariants, type AvatarProps } from "./ui/Avatar";
export {
  IconButton,
  iconButtonVariants,
  type IconButtonProps,
} from "./ui/IconButton";
export {
  ButtonGroup,
  buttonGroupVariants,
  ConfirmCancelActions,
  type ButtonGroupProps,
  type ConfirmCancelActionsProps,
} from "./ui/ButtonGroup";

// Typography
export { Text, textVariants, type TextProps } from "./ui/Text";
export { Heading, headingVariants, type HeadingProps } from "./ui/Heading";

// Brand — เครื่องหมายประจำผลิตภัณฑ์ (ชุดเดียวของทั้งแพลตฟอร์ม)
export {
  AppMark,
  GRID_INK_HEIGHT,
  type AppMarkProps,
  type AppMarkFit,
} from "./brand/AppMark";
/* เปิดค่าดิบออกมาด้วย ไม่ใช่แค่ component — บางที่ต้องการ **ที่อยู่ของรูป** ไม่ใช่ `<img>`
 * (เช่น `<link rel="icon">` · `og:image` · `background-image` ใน CSS · หรือส่งให้ prop ที่รับ
 * `src: string` อย่าง `ShowcaseAssets`) ⇒ ถ้าเปิดแค่ component พวกนั้นจะกลับไปคัดลอกไฟล์เอง
 * ซึ่งเป็นปัญหาที่ไฟล์นี้ตั้งใจแก้ */
export {
  appMarks,
  appMarkLabels,
  /* ชื่อ + สีของ wordmark — เปิดออกมาเพราะแอปที่ประกอบหัวรางเองต้องใช้ชุดเดียวกับ DS
   * ไม่งั้นจะได้ "MEDI ON CLOUD" ที่ตกบรรทัด หรือสีที่ไหลตามธีมของแอปที่กำลังรัน */
  appWordmarks,
  appBrandInk,
  type AppMarkTone,
  type MediactAppKey,
} from "./brand/app-marks";

// Navigation
export {
  TopNav,
  TopNavToggle,
  TopNavBrand,
  TopNavSpacer,
  AppLauncher,
  NotificationBell,
  UserMenu,
  type TopNavProps,
  type TopNavToggleProps,
  type TopNavBrandProps,
  type AppLauncherProps,
  /* `MediactAppKey` ไม่ได้ออกทางนี้แล้ว — ออกจาก `brand/app-marks` ข้างบน (นิยามอยู่ที่นั่น)
   * ชื่อที่ผู้ใช้ import ยังเหมือนเดิมทุกประการ */
  type MediactAppConfig,
  type NotificationBellProps,
  type UserMenuProps,
  type UserMenuItem,
} from "./navigation/TopNav";
export {
  LanguageSwitcher,
  type LanguageSwitcherProps,
  type LanguageOption,
} from "./navigation/LanguageSwitcher";
export {
  Sidebar,
  SidebarItem,
  SidebarGroup,
  /* ให้ `header`/`footer` รู้ว่ารางกางอยู่หรือยุบ — คำนวณจากข้างนอกไม่ได้
   * เพราะ `expandOnHover` เก็บ state ไว้ใน DS */
  useSidebarState,
  type SidebarProps,
  type SidebarItemProps,
  type SidebarGroupProps,
} from "./navigation/Sidebar";

// Form layout + complex form fields
export { FormField, type FormFieldProps } from "./form/FormField";
/* เปลือกของช่องกรอก — เปิดออกมาให้แอปประกอบฟิลด์ของตัวเองที่หน้าตาตรงกับของ DS ได้
 * โดยไม่ต้องลอก class · เดิมเป็นของภายใน ผลคือผิวสัมผัสของ "ฟิลด์" มีสองมาตรฐาน:
 * ตัวที่ DS ให้มา กับตัวที่แอปวาดเอง (hr-web มี 3 ตัว · Portal มีอีก) */
export {
  FloatingFieldShell,
  FieldSkeleton,
  fieldShapeClasses,
  fieldLabelId,
  type FieldSize,
  type FloatingFieldShellProps,
} from "./form/FloatingFieldShell";
export { DatePicker, type DatePickerProps } from "./form/DatePicker";
/* ทรงของช่องไอคอนขวา (ไอคอนประจำช่อง ⇄ ปุ่มล้าง) — ใช้ร่วมกันโดย `DatePicker`
 * และ `DateRangePicker` · เปิดออกมาให้แอปประกอบช่องของตัวเองที่หน้าตาตรงกันได้ */
export {
  FieldIconSlot,
  type FieldIconSlotProps,
} from "./form/field-icon-slot";
export {
  DateRangePicker,
  type DateRangePickerProps,
  type DateRangeValue,
  type DateRangePickerLabels,
} from "./form/DateRangePicker";
export {
  TimePicker,
  type TimePickerProps,
  type TimeValue,
} from "./form/TimePicker";
/* ⚠️ คนละตัวกับ `Stepper` ใน `layout/` — ตัวนั้นคือแถบบอกขั้นตอนของฟอร์มหลายหน้า */
export {
  NumberStepper,
  numberStepperVariants,
  type NumberStepperProps,
} from "./form/NumberStepper";
export {
  ComboBox,
  type ComboBoxProps,
  type ComboBoxSingleProps,
  type ComboBoxMultiProps,
  type ComboBoxOption,
  type ComboBoxOptionGroup,
} from "./form/ComboBox";

/* ช่องค้นหา-แล้วเลือก **ที่ไม่ผูก Radix Popover เลย** — ทางเลือกสำหรับที่ที่แผงถูก portal แล้วพัง
   (โฟกัสในโมดัล · setState ใน cleanup ของ popper/floating-ui) · เหตุผลเต็มในไฟล์ */
export { SearchSelect, type SearchSelectProps } from "./form/SearchSelect";
export type { OptionRowState, ChipState } from "./form/option-row";
export type { GroupBy } from "./form/group-options";
export {
  EntityAutocomplete,
  type EntityAutocompleteProps,
  type EntityAutocompleteSingleProps,
  type EntityAutocompleteMultiProps,
} from "./form/EntityAutocomplete";

// Data
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./data/Table";
export {
  DataTable,
  type DataTableProps,
  type DataTablePagination,
  type DataTableLabels,
} from "./data/DataTable";
export {
  DataTableGroupRow,
  resolveGroups,
  type DataTableGroupingProps,
  type DataTableGroupLabelContext,
} from "./data/table-groups";

// Layout
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
} from "./layout/Card";
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./layout/Tabs";
export {
  Breadcrumb,
  BreadcrumbRoot,
  BreadcrumbLink,
  type BreadcrumbProps,
  type BreadcrumbItem,
} from "./layout/Breadcrumb";
export { Stepper, type StepperProps, type StepperStep } from "./layout/Stepper";
/* `StatTile` ลบทิ้ง 2026-08-09 — ไม่มีทั้งใน DS และในแอปไหน import เลยสักที่
 * (ต่างจาก `Card` ที่ยังอยู่เพราะมีคนใช้ 6 ไฟล์ใน 3 checkout) */

// Feedback
export {
  Skeleton,
  SkeletonBox,
  type SkeletonProps,
  type SkeletonBoxProps,
} from "./feedback/Skeleton";
export {
  Spinner,
  LoadingScreen,
  type SpinnerProps,
} from "./feedback/Spinner";
export {
  EmptyState,
  ErrorState,
  type EmptyStateProps,
  type ErrorStateProps,
  type StateTone,
  type StateMediaShape,
  type StateSize,
} from "./feedback/EmptyState";
export { Toaster, toast, type ToasterProps } from "./feedback/Toast";

// Overlays
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverClose,
} from "./overlay/Popover";
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./overlay/Dialog";
export {
  ConfirmDialog,
  toneIcon,
  type ConfirmDialogProps,
  type ConfirmTone,
} from "./overlay/ConfirmDialog";
export {
  ContactSupportDialog,
  MEDIACT_LINE_URL,
  MEDIACT_LINE_HANDLE,
  MEDIACT_SUPPORT_PHONE,
  type ContactSupportDialogProps,
  type ContactSupportLabels,
} from "./overlay/ContactSupportDialog";
export {
  AppShowcaseDialog,
  SHOWCASE_COPY,
  SHOWCASE_LAYOUT,
  type AppShowcaseDialogProps,
  type ShowcaseAppKey,
  type ShowcaseAssets,
  type ShowcaseLocale,
} from "./overlay/AppShowcaseDialog";
export { Filter, type FilterProps } from "./overlay/Filter";
export {
  Tooltip,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  type TooltipProps,
} from "./overlay/Tooltip";
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
} from "./overlay/DropdownMenu";

/* เดิมมีโฟลเดอร์ `schedule/` (ShiftTable · TimeGrid · AssignmentChip · AddSlotButton ·
 * ScheduleAvatar + utils) ลบทิ้ง 2026-08-09 เพราะไม่มีแอปไหน import เลยสักตัว
 * เหลือไว้สองตัวที่มีคนใช้จริง แล้วย้ายมาอยู่ `ui/` เพราะมันไม่ได้ผูกกับตารางเวร:
 *   `StatusBadge`   — Mediwork 3 จอ + worktree อีก 2 ตัว
 *   `DateNavigator` — worktree `feature/doctor-scheduling/per-cell-orders`
 * ชื่อที่ export ไม่เปลี่ยน ผู้เรียกจึงไม่ต้องแก้อะไร */
export {
  StatusBadge,
  statusBadgeVariants,
  type StatusBadgeProps,
} from "./ui/StatusBadge";
export {
  DateNavigator,
  type DateNavigatorProps,
  type DateNavigatorUnit,
} from "./ui/DateNavigator";
/* ตัวเลื่อน **งวด** — `DateNavigator` + ตาราง 12 เดือนที่กดได้เฉพาะเดือนที่มีงวดจริง
 * (Mediwork "บันทึกเวลางาน" 3 จอ · MediHR "ข้อมูลงวด") */
export {
  PeriodNavigator,
  type PeriodNavigatorProps,
  type PeriodNavigatorItem,
  type PeriodNavigatorLabels,
} from "./ui/PeriodNavigator";
/* ปฏิทินฐาน — `DatePicker` และ `DateNavigator` ใช้ตัวนี้ตัวเดียวกัน
 * เผยแพร่ออกไปด้วยเพราะจอที่ต้องฝังปฏิทินลงในหน้า (ไม่ใช่ใน popover) มีจริง */
export {
  Calendar,
  dayKey,
  type CalendarProps,
  type CalendarLabels,
  type CalendarView,
} from "./ui/Calendar";

// Utilities
export { cn } from "./lib/cn";

// Design tokens ที่อ่านเป็นค่า TS ได้ (นอกเหนือจาก CSS custom property)
// — ใช้เมื่อต้องคำนวณหรือส่งค่าให้ระบบที่ไม่ได้กิน Tailwind class
// MUI consumer ใช้ `@mediact/react/mui` แทน (มี createMuiTypography ให้ด้วย)
export {
  TYPE_SCALE,
  TYPE_SCALE_DEFAULT_WEIGHT,
  type TypeScaleToken,
  type TypeScaleEntry,
} from "./lib/type-scale";
