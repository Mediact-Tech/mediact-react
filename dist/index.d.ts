import * as class_variance_authority_types from 'class-variance-authority/types';
import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import * as RadixSwitch from '@radix-ui/react-switch';
import * as RadixRadio from '@radix-ui/react-radio-group';
import * as RadixSelect from '@radix-ui/react-select';
import * as RadixAvatar from '@radix-ui/react-avatar';
import { Row, RowData, ColumnDef, SortingState, RowSelectionState } from '@tanstack/react-table';
import * as RadixTabs from '@radix-ui/react-tabs';
import { Toaster as Toaster$1 } from 'sonner';
export { toast } from 'sonner';
import * as RadixPopover from '@radix-ui/react-popover';
import * as RadixDialog from '@radix-ui/react-dialog';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import * as RadixMenu from '@radix-ui/react-dropdown-menu';
import { ClassValue } from 'clsx';
export { T as TYPE_SCALE, a as TYPE_SCALE_DEFAULT_WEIGHT, b as TypeScaleEntry, c as TypeScaleToken } from './type-scale-Cv-4FG73.js';

declare const buttonVariants: (props?: ({
    variant?: "primary" | "secondary" | "ghost" | "info" | "destructive" | "success" | "warning" | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
    fullWidth?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** ผู้ใช้กดแล้วกำลังทำงาน — แสดงสปินเนอร์ในปุ่ม ปุ่มยังอยู่ที่เดิม */
    loading?: boolean;
    /**
     * ข้อมูลยังมาไม่ถึง — แทนทั้งปุ่มด้วยโครงร่าง
     *
     * คนละเรื่องกับ `loading` โดยตั้งใจ:
     * `loading` = สิ่งที่ผู้ใช้สั่งกำลังทำอยู่ (ต้องเห็นปุ่มและป้ายเดิม)
     * `isLoading` = ยังไม่รู้ว่าปุ่มนี้ควรเขียนว่าอะไร หรือควรมีไหม
     * ใช้พร้อมกันได้ แต่ `isLoading` ชนะเพราะยังไม่มีอะไรให้กด
     */
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
};
declare const Button: React.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

declare const solidButtonVariants: (props?: ({
    variant?: "primary" | "info" | "success" | "warning" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type SolidButtonProps = React.ComponentProps<"button"> & VariantProps<typeof solidButtonVariants> & {
    asChild?: boolean;
    /** Localized button text — ignored when `children` is provided. */
    label?: React.ReactNode;
};
/** Filled action button — for actions like Save, Upload, Confirm. */
declare const SolidButton: React.ForwardRefExoticComponent<Omit<SolidButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

type AddButtonProps = React.ComponentProps<"button"> & VariantProps<typeof solidButtonVariants> & {
    asChild?: boolean;
    /** Localized button text — ignored when `children` is provided. */
    label?: React.ReactNode;
};
/**
 * "Add" button — same "[+ icon] [add_text]" pattern everywhere in the system.
 * With `asChild`, children render as-is (no Plus injected) so the caller's
 * single element (e.g. a router Link) can carry its own icon + text.
 */
declare const AddButton: React.ForwardRefExoticComponent<Omit<AddButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

declare const outlineButtonVariants: (props?: ({
    variant?: "brand" | "neutral" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type OutlineButtonProps = React.ComponentProps<"button"> & VariantProps<typeof outlineButtonVariants> & {
    asChild?: boolean;
    /** Localized button text — ignored when `children` is provided. */
    label?: React.ReactNode;
};
/** Outlined action button — for secondary actions like Cancel, Edit. */
declare const OutlineButton: React.ForwardRefExoticComponent<Omit<OutlineButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

type FieldSize = "sm" | "md" | "lg";
/**
 * id ของป้าย — ใช้กับ trigger ที่**ไม่ใช่ element ที่ label ผูกได้**
 *
 * 🔴 `<label htmlFor>` ผูกได้เฉพาะ element ที่ labellable ตามสเปก HTML
 * (`input` `select` `textarea` `button` …) — **`<div role="combobox">` ผูกไม่ได้**
 * ช่องแบบเลือกหลายอันใช้ `div` เป็น trigger เพราะต้องใส่ chip หลายบรรทัด
 * ⇒ ต้องผูกด้วย `aria-labelledby` แทน ไม่งั้นโปรแกรมอ่านหน้าจอไม่รู้ว่าช่องนี้คืออะไร
 *
 * เจอตอนเขียน unit test ของ `EntityAutocomplete` (2026-08-08)
 */
declare function fieldLabelId(htmlFor?: string): string | undefined;
type FloatingFieldShellProps = {
    /** Floating label — sits inside the field as placeholder, floats up when filled/focused. */
    label?: React.ReactNode;
    /** Helper text under the field. Hidden when `error` is set. */
    hint?: React.ReactNode;
    /** Error message — switches the field shell to error styling. */
    error?: React.ReactNode;
    /** Marks the label with a red asterisk. Caller controls actual HTML required. */
    required?: boolean;
    /** Visually hide the label but keep it for screen readers. */
    hideLabel?: boolean;
    /** id of the inner field — wired to label via `htmlFor`. */
    htmlFor?: string;
    /** Size variant — affects height and label vertical positioning. */
    size?: FieldSize;
    /** Should the label be in the floated position right now? Caller computes from focused/hasValue/alwaysFloat. */
    floating: boolean;
    /** Is the field currently focused — used for label color while floating. */
    focused?: boolean;
    /** Whether the field has an error (controls border/label color). Derived from `error` if not supplied. */
    hasError?: boolean;
    /**
     * Always reserve one line of height for the hint/error slot below the field, even when
     * neither is set — prevents layout shift when an error appears/disappears.
     *
     * ⚠️ Default is `true`, which matches what every real consumer app already does today
     * (spacer div or `helperText={error ?? ' '}` workarounds) — but it changes the rendered
     * height of every existing field using this shell that doesn't explicitly pass this prop.
     * Confirm this default with the team before relying on it in layouts that assumed the old
     * zero-height "no message" behavior.
     * @default true
     */
    reserveMessageSpace?: boolean;
    /** Left-side icon/element rendered absolutely inside the field. */
    leftAdornment?: React.ReactNode;
    /** Right-side icon/element rendered absolutely inside the field. */
    rightAdornment?: React.ReactNode;
    /** Wrapper className (the outer flex column). */
    containerClassName?: string;
    /** When true, position the rest label near the top (for textareas) instead of vertically centered. */
    multiline?: boolean;
    /** The actual interactive element (input / textarea / button). */
    children: React.ReactNode;
};
/**
 * Shared shell for any text-like field with a floating label
 * (Input / Textarea / Select / DatePicker / TimePicker / ...).
 *
 * The shell renders:
 *   - the label (positioned absolutely, animates between rest and float positions)
 *   - any left/right adornments
 *   - hint or error text below
 *
 * The caller renders the interactive element as `children` and is responsible for:
 *   - matching `id` with `htmlFor`
 *   - computing `floating` / `focused`
 *   - applying its own padding (the shell does not enforce the field's internal padding,
 *     but does shift the rest-position label right when `leftAdornment` is provided)
 */
declare function FloatingFieldShell({ label, hint, error, required, hideLabel, htmlFor, size, floating, focused, hasError: hasErrorProp, leftAdornment, rightAdornment, containerClassName, multiline, reserveMessageSpace, children, }: FloatingFieldShellProps): React.JSX.Element;
type FieldSkeletonProps = Pick<FloatingFieldShellProps, "label" | "hint" | "required" | "hideLabel" | "size" | "containerClassName" | "multiline" | "reserveMessageSpace" | "leftAdornment" | "rightAdornment"> & {
    /** class รูปทรงของช่อง — ปกติคือ `fieldShapeClasses(...)` ตัวเดียวกับที่ component ใช้ */
    shape?: string;
};
declare function FieldSkeleton({ size, shape, containerClassName, ...shellProps }: FieldSkeletonProps): React.JSX.Element;
/**
 * Field shape classes shared by all interactive elements (input/textarea/button).
 * Apply to the inner element so border/focus ring/error states stay consistent.
 */
declare function fieldShapeClasses({ hasError, size, }: {
    hasError: boolean;
    size: FieldSize;
}): string;

type NativeInputProps = Omit<React.ComponentProps<"input">, "size">;
type InputProps = NativeInputProps & {
    /** Floating label — sits inside the field as placeholder, floats up on focus or when filled. */
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    /**
     * บอกว่า "ช่องนี้ผิด" โดยไม่ต้องมีข้อความ — แอปที่เก็บ `hasError:boolean` กับ
     * `errorMessage?:string` เป็นคนละตัวจะได้ไม่ต้องปลอมข้อความว่างเพื่อให้กรอบแดง
     * ไม่ส่งมา = คิดจาก `error` เหมือนเดิม
     */
    invalid?: boolean;
    /**
     * จองที่หนึ่งบรรทัดใต้ช่องไว้เสมอ กันเลย์เอาต์กระตุกตอนข้อความผิดโผล่/หาย
     * ค่าตั้งต้นของ shell คือ `true` — ส่ง `false` เมื่อฟอร์มเดิมคิดความสูงบนสมมติฐานว่า
     * "ไม่มีข้อความ = ไม่กินที่" (ฟอร์มของทั้ง 3 แอปวันนี้เป็นแบบนั้น)
     */
    reserveMessageSpace?: boolean;
    required?: boolean;
    hideLabel?: boolean;
    /** Force the label into the floated position (e.g. for fields with fixed prefixes/masks). */
    alwaysFloatLabel?: boolean;
    size?: FieldSize;
    /** ไอคอนหน้าช่องกรอก — ป้ายที่ยังไม่ลอยจะขยับไปทางขวาให้เอง */
    prefixIcon?: React.ReactNode;
    /** ไอคอนท้ายช่องกรอก — ถ้ามีปุ่มล้างค่าหรือปุ่มดูรหัสผ่าน สองตัวนั้นมาก่อน */
    suffixIcon?: React.ReactNode;
    /** @deprecated ใช้ `prefixIcon` — ชื่อเดิมไม่มีแอปไหนเรียกเลย ส่วน `prefixIcon` ถูกเรียก 27 จุด */
    leftAdornment?: React.ReactNode;
    /** @deprecated ใช้ `suffixIcon` — ชื่อเดิมไม่มีแอปไหนเรียกเลย ส่วน `suffixIcon` ถูกเรียก 29 จุด */
    rightAdornment?: React.ReactNode;
    /** Show a clear (×) button when value is non-empty. */
    clearable?: boolean;
    containerClassName?: string;
    /** ข้อมูลยังมาไม่ถึง — แทนช่องกรอกด้วยโครงร่างที่สูงเท่ากันทุกประการ */
    isLoading?: boolean;
};
declare const Input: React.ForwardRefExoticComponent<Omit<InputProps, "ref"> & React.RefAttributes<HTMLInputElement>>;

/** รูปแบบสำเร็จรูป — เพิ่มได้ แต่ต้องมีของจริงมารองรับก่อน */
declare const FORMAT_PRESETS: {
    /** เลขบัตรประชาชนไทย 13 หลัก — 1-2345-67890-12-3 */
    readonly thaiId: {
        readonly kind: "pattern";
        readonly pattern: "#-####-#####-##-#";
        readonly digits: 13;
    };
    /** เบอร์มือถือไทย 10 หลัก — 081-234-5678 */
    readonly phone: {
        readonly kind: "pattern";
        readonly pattern: "###-###-####";
        readonly digits: 10;
    };
    /** เลขบัญชีธนาคารไทย 10 หลัก — 123-4-56789-0 */
    readonly bankAccount: {
        readonly kind: "pattern";
        readonly pattern: "###-#-#####-#";
        readonly digits: 10;
    };
    /** จำนวนเงิน — ค่าเดียวกับที่ Medimatch ใช้อยู่กับช่องค่าจ้าง */
    readonly currency: {
        readonly kind: "numeric";
    };
};
type FormatPreset = keyof typeof FORMAT_PRESETS;
/** รูปแบบที่เขียนเอง — ให้ทั้งขาจัดและขาถอด ไม่งั้นค่าที่ส่งกลับจะเป็นค่าที่จัดแล้ว */
type CustomFormat = {
    /** ค่าดิบ → สิ่งที่แสดงบนจอ */
    format: (raw: string) => string;
    /** สิ่งที่อยู่บนจอ → ค่าดิบ · ไม่ส่ง = ตัดทุกอย่างที่ไม่ใช่ตัวเลข */
    removeFormatting?: (formatted: string) => string;
};
type FormatInputProps = Omit<InputProps, "value" | "defaultValue" | "onChange" | "type"> & {
    /** ชื่อรูปแบบสำเร็จรูป · สตริง mask (`"#-####-#####-##-#"`) · หรือฟังก์ชันเอง */
    format: FormatPreset | string | CustomFormat;
    value?: string;
    /** คืน **ค่าดิบ** เสมอ — ไม่มีตัวคั่น */
    onValueChange?: (raw: string) => void;
    /** แสดง `_` ในช่องที่ยังไม่ได้กรอก (เฉพาะรูปแบบที่เป็น mask) */
    showMask?: boolean;
    /** ตัวคั่นหลักพัน · เฉพาะรูปแบบตัวเลข */
    thousandSeparator?: string;
    /** จำนวนทศนิยม · เฉพาะรูปแบบตัวเลข */
    decimalScale?: number;
    allowNegative?: boolean;
};
declare function FormatInput({ format, value, onValueChange, showMask, thousandSeparator, decimalScale, allowNegative, ...rest }: FormatInputProps): React.JSX.Element;
declare namespace FormatInput {
    var displayName: string;
}

type TextareaProps = React.ComponentProps<"textarea"> & {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    /**
     * บอกว่า "ช่องนี้ผิด" โดยไม่ต้องมีข้อความ — แอปที่เก็บ `hasError:boolean` กับ
     * `errorMessage?:string` เป็นคนละตัวจะได้ไม่ต้องปลอมข้อความว่างเพื่อให้กรอบแดง
     * ไม่ส่งมา = คิดจาก `error` เหมือนเดิม
     */
    invalid?: boolean;
    /**
     * จองที่หนึ่งบรรทัดใต้ช่องไว้เสมอ กันเลย์เอาต์กระตุกตอนข้อความผิดโผล่/หาย
     * ค่าตั้งต้นของ shell คือ `true` — ส่ง `false` เมื่อฟอร์มเดิมคิดความสูงบนสมมติฐานว่า
     * "ไม่มีข้อความ = ไม่กินที่" (ฟอร์มของทั้ง 3 แอปวันนี้เป็นแบบนั้น)
     */
    reserveMessageSpace?: boolean;
    required?: boolean;
    hideLabel?: boolean;
    alwaysFloatLabel?: boolean;
    size?: FieldSize;
    /** Show character count in the hint slot (requires `maxLength`). */
    showCount?: boolean;
    containerClassName?: string;
    /** ข้อความยังมาไม่ถึง — แทนช่องด้วยโครงร่างที่สูงเท่ากันทุกประการ */
    isLoading?: boolean;
};
declare const Textarea: React.ForwardRefExoticComponent<Omit<TextareaProps, "ref"> & React.RefAttributes<HTMLTextAreaElement>>;

/** @doc ./toggle.md */

type ToggleSize = "sm" | "md";
/**
 * รูปทรงกล่องติ๊ก
 *
 * 📐 มุมโค้ง 2px (`rounded-xs`) — วัดจาก Portal ได้ `border-radius: 2px` เป๊ะ
 * ของเดิมใน DS เป็น `rounded-sm` ซึ่งใน Tailwind v4 = 4px คนละค่า
 */
declare function checkboxShapeClasses(size?: ToggleSize): string;
/**
 * รูปทรงปุ่มตัวเลือกเดียว
 *
 * 🔴 เลือกแล้ว = **ขอบบาง + จุดทึบตรงกลาง** ไม่ใช่ "วงแหวนหนาเจาะรูขาว"
 * ของจริง Portal/MediHR ใช้ `data-[state=checked]:border-[6px]` แล้ววาดจุด **ขาว**
 * ทับตรงกลาง ⇒ ภาพที่ได้คือวงกลมทึบที่ถูกเจาะรู ซึ่งกลับด้าน figure/ground:
 * สิ่งที่ "ถูกเลือก" กลายเป็นช่องว่าง ส่วนขอบกลายเป็นเนื้อ
 * และเทคนิคนี้พังทันทีเมื่อเปลี่ยนขนาด — 6px บนกล่อง 16px เหลือรูแค่ 4px
 * Medimatch ทำแบบขอบบาง+จุด ซึ่งตรงกับที่ทุกระบบใช้กัน จึงเอาแบบนั้น
 */
declare function radioShapeClasses(size?: ToggleSize): string;
/**
 * รูปทรงรางของสวิตช์ — 44×24 ขอบโปร่ง 2px ปุ่มเลื่อน 20px
 *
 * 📐 วัดจาก Portal (ไฟล์เดียวกับ MediHR ทุกไบต์): ราง 44×24 · `border-2` โปร่ง ·
 * ปุ่ม 20px ⇒ ระยะเลื่อน = 44 − 2×2 − 20 = 20px พอดี (`translate-x-5`)
 *
 * 🔴 **"เปิด" เป็นสีเขียว ไม่ใช่สีแบรนด์**
 * นับของจริงได้ 6 แบบใน 4 แอป และ 5 ใน 6 แบบใช้เขียว:
 * `#0CB679` (Portal/MediHR) · `#0BB767` (Medimatch VisibilityToggle) ·
 * `#10b981` (MediHR ตั้งเป็นโทเคนชื่อ `--color-switch-on` เลย) ·
 * success-green (Portal ProductAccessToggle) — มีแต่ Mediwork MUI ที่ใช้ primary
 * และไฟล์เดียวในนั้นยัง override เป็นน้ำเงิน `#1565C0`
 * เหตุผลเชิงความหมายก็ตรงกัน: เปิด/ปิดคือ **สถานะ** ไม่ใช่แบรนด์
 * — เหตุผลเดียวกับที่ตัวเลขในตารางไม่เปลี่ยนสีตามแอป
 *
 * ⚠️ รางตอนปิดใช้ `gray-200` = `#e5e7eb` ซึ่ง **ตรงกับที่วัดได้เป๊ะ**
 */
/**
 * โทนของรางตอนเปิด — แยกออกจากรูปทรงเพื่อให้รางธรรมดากับรางแบบมีคำใช้ชุดเดียวกัน
 *
 * ของจริงมีสองความหมายปนกันอยู่: สวิตช์ "เปิด/ปิดการใช้งาน" ที่สื่อผลลัพธ์ (เขียว) กับสวิตช์
 * ที่เป็นแค่ตัวเลือกในฟอร์ม (ควรเป็นสีกลางของแอป) — ก่อนหน้านี้แอปที่ต้องการอย่างหลังต้อง
 * ส่งสี hex เข้ามาทับเอง ซึ่งหลุดออกจากชั้น token ทันที
 */
declare const switchToneClasses: {
    readonly success: "data-[state=checked]:bg-success-green-primary";
    readonly info: "data-[state=checked]:bg-info-blue-primary";
    readonly brand: "data-[state=checked]:bg-brand";
};
type SwitchTone = keyof typeof switchToneClasses;

/** @doc ./toggle.md */

type CheckboxProps = Omit<React.ComponentProps<typeof RadixCheckbox.Root>, "asChild"> & {
    /** ข้อความข้างกล่อง กดที่ข้อความก็ติ๊กได้ */
    label?: React.ReactNode;
    /** คำอธิบายใต้ป้ายกำกับ */
    description?: React.ReactNode;
    /** ข้อความผิดพลาด — ใส่แล้วสลับไปสไตล์ error */
    error?: React.ReactNode;
    /** ขนาดตัวควบคุม `md` 20px (ค่าเริ่มต้น) · `sm` 16px สำหรับแถวตารางที่แน่น */
    size?: ToggleSize;
    /** ยังไม่มีข้อมูล — แสดงโครงร่างแทนทั้งแถว */
    isLoading?: boolean;
    /** className ของกล่องนอก */
    containerClassName?: string;
};
declare const Checkbox: React.ForwardRefExoticComponent<Omit<CheckboxProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

/** @doc ./toggle.md */

/** คำที่แสดง**ในราง** — ใช้กับการ์ดหน่วยงานที่ไม่มีที่ให้เขียนป้ายข้างนอก */
type SwitchTrackLabels = {
    on: React.ReactNode;
    off: React.ReactNode;
};
type SwitchProps = Omit<React.ComponentProps<typeof RadixSwitch.Root>, "asChild"> & {
    label?: React.ReactNode;
    description?: React.ReactNode;
    error?: React.ReactNode;
    /** ป้ายกำกับอยู่ซ้ายหรือขวาของสวิตช์ ค่าเริ่มต้น `right` */
    labelPosition?: "left" | "right";
    /**
     * ผู้ใช้กดแล้ว **กำลังบันทึกอยู่** — หมุนอยู่ในปุ่มเลื่อน กดซ้ำไม่ได้
     * แต่ยังคงสถานะเดิมไว้จนกว่าเซิร์ฟเวอร์จะตอบ
     *
     * คนละเรื่องกับ `isLoading` (ยังไม่มีข้อมูล ⇒ โครงร่าง) — ดู CLAUDE.md §4.5
     */
    loading?: boolean;
    /** ยังไม่มีข้อมูล — แสดงโครงร่างแทนทั้งแถว */
    isLoading?: boolean;
    /** ข้อความให้โปรแกรมอ่านหน้าจอตอน `loading` — แอปส่งคำแปลมาเอง */
    loadingLabel?: string;
    /**
     * ใส่คำว่า "เปิด/ปิด" **ไว้ในราง** แทนป้ายกำกับข้างนอก
     *
     * ใช้ในการ์ดที่มีที่ว่างจำกัด (การ์ดหน่วยงานของ MediHR) — รางจะกว้างขึ้นตาม
     * คำที่ยาวที่สุด และปุ่มเลื่อนสลับข้างแทนการเลื่อน
     *
     * ⚠️ ยังส่ง `aria-label` มาด้วยเสมอ ถ้าไม่มี `label` ข้างนอก —
     * คำในรางเป็นแค่ภาพ ไม่ได้ผูกกับ `role="switch"` ให้โดยอัตโนมัติ
     */
    /**
     * สีของรางตอนเปิด — `success` (ค่าเริ่มต้น) สื่อ "ใช้งานอยู่" · `info`/`brand` สำหรับสวิตช์
     * ที่เป็นแค่ตัวเลือกในฟอร์ม ซึ่งไม่ควรอ่านเป็นสถานะสำเร็จ
     */
    tone?: SwitchTone;
    trackLabels?: SwitchTrackLabels;
    containerClassName?: string;
};
declare const Switch: React.ForwardRefExoticComponent<Omit<SwitchProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

/** @doc ./toggle.md */

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
    /** ตัวเลือกที่จะแสดง — ส่ง children เองได้ถ้าต้องการเลย์เอาต์พิเศษ */
    options?: RadioOption<V>[];
    /** ทิศทางการเรียง ค่าเริ่มต้น `vertical` */
    orientation?: "vertical" | "horizontal";
    /** ขนาดตัวควบคุม `md` 20px (ค่าเริ่มต้น) · `sm` 16px */
    size?: ToggleSize;
    /** ยังไม่มีข้อมูล — แสดงโครงร่างแทนทั้งกลุ่ม */
    isLoading?: boolean;
    containerClassName?: string;
    children?: React.ReactNode;
};
declare function RadioGroup<V extends string = string>({ id, className, containerClassName, label, hint, error, required, options, orientation, size, isLoading, children, ...props }: RadioGroupProps<V>): React.JSX.Element;
type RadioGroupItemProps = Omit<React.ComponentProps<typeof RadixRadio.Item>, "asChild"> & {
    description?: React.ReactNode;
    /** ทับขนาดที่ได้จากกลุ่ม — ปกติไม่ต้องใส่ */
    size?: ToggleSize;
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
    /**
     * Shows a × button once a value is set, resetting the field to `""`
     * (same "no selection" sentinel already used by `hasValue`/floating-label logic).
     * `onChange`'s signature is unchanged — for typed unions narrower than `string`,
     * treat an `onChange("")` call as "cleared".
     */
    clearable?: boolean;
    /**
     * ตัวเลือกยังมาไม่ถึง — แทนช่องด้วยโครงร่างที่สูงเท่ากันทุกประการ
     *
     * ต่างจาก `disabled`: `disabled` แปลว่า "เลือกไม่ได้" (ผู้ใช้ต้องเข้าใจว่าทำไม)
     * ส่วน `isLoading` แปลว่า "ยังไม่รู้ว่ามีอะไรให้เลือกบ้าง"
     * ⇒ dropdown ที่รอ API อยู่ต้องใช้ตัวนี้ ไม่ใช่ `disabled`
     */
    isLoading?: boolean;
    /**
     * จองที่ว่างใต้ช่องไว้ 1 บรรทัดเสมอ กันเลย์เอาต์กระโดดตอนขึ้น error · ค่าเริ่มต้น `true`
     *
     * 🔴 **ปิดเมื่ออยู่ในแถบเครื่องมือ** (แถบแบ่งหน้า ตัวกรอง ฯลฯ) — ที่นั่นไม่มี error
     * มาแสดงอยู่แล้ว บรรทัดที่จองไว้จึงเป็นที่ว่างเปล่าที่ดันแถบสูงขึ้นเฉย ๆ
     * (วัดแล้ว: ช่องสูง 36 แต่กินที่ 56 ⇒ แถบแบ่งหน้าสูง 73px ทั้งที่ของจริงใช้ 32px)
     */
    /** บอกว่า "ช่องนี้ผิด" โดยไม่ต้องมีข้อความ — ดู `InputProps.invalid` */
    invalid?: boolean;
    reserveMessageSpace?: boolean;
    /**
     * ข้อความตอนไม่มีตัวเลือกให้เลือก · ค่าเริ่มต้น `"No options"`
     *
     * 🔴 เดิม `options=[]` ได้ **กล่องเปล่าไม่มีอะไรเลย** — ผู้ใช้กดแล้วไม่รู้ว่า
     * โหลดไม่มา ระบบพัง หรือไม่มีข้อมูลจริง ๆ
     * (ของจริงเรียกสิ่งนี้ว่า `noOptionsText` อยู่แล้ว 6 จุดบน Mediwork และ
     *  `no_options` บน Portal — DS เป็นตัวเดียวที่ไม่มี)
     */
    emptyText?: React.ReactNode;
    /**
     * ทางออกในสถานะว่าง — ปุ่มที่พาไปสร้างของที่ยังไม่มี
     *
     * 🔴 **dropdown ว่างที่ไม่มีทางออกคือทางตัน** — บันทึกไว้ตอน dev MediHR F3:
     * โรงพยาบาลที่ยังไม่เคยตั้งนโยบายเวลาทำงานเปิด dropdown แล้วเจอช่องว่าง
     * แล้วไปต่อไม่ได้ ทั้งที่ทางแก้คือไปสร้างที่หน้าตั้งค่า
     *
     * ```tsx
     * emptyAction={{ label: "เพิ่มหน่วยงาน", onClick: () => router.push("/sub-units") }}
     * ```
     */
    emptyAction?: {
        label: React.ReactNode;
        onClick: () => void;
        /** ไอคอนหน้าป้าย — ไม่ส่ง = เครื่องหมายบวก */
        icon?: React.ReactNode;
    };
    /** วาดสถานะว่างเอง — ชนะ `emptyText`/`emptyAction` */
    renderEmpty?: () => React.ReactNode;
};
declare function Select<V extends string = string>({ id, label, hint, error, required, hideLabel, alwaysFloatLabel, placeholder, value, defaultValue, onChange, options, disabled, size, className, containerClassName, children, clearable, isLoading, invalid, reserveMessageSpace, emptyText, emptyAction, renderEmpty, }: SelectProps<V>): React.JSX.Element;
declare const SelectItem: React.ForwardRefExoticComponent<Omit<RadixSelect.SelectItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;

/** @doc ./toggle.md */

type CheckboxOption<V extends string = string> = {
    value: V;
    label: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
};
type CheckboxGroupProps<V extends string = string> = {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    id?: string;
    /** Wired to each item's native `name` — useful for uncontrolled native form submission. */
    name?: string;
    /** Disables every item. A per-option `disabled` still wins for that item. */
    disabled?: boolean;
    /** Options to render. Pass children (`CheckboxGroupItem`) directly for custom layouts. */
    options?: CheckboxOption<V>[];
    /** Controlled selected values. */
    value?: V[];
    /** Initial selected values (uncontrolled). */
    defaultValue?: V[];
    /** Fires with the next array whenever an item toggles. */
    onValueChange?: (next: V[]) => void;
    /** Layout direction. Default `vertical`. */
    orientation?: "vertical" | "horizontal";
    /** ขนาดตัวควบคุม `md` 20px (ค่าเริ่มต้น) · `sm` 16px */
    size?: ToggleSize;
    /** ยังไม่มีข้อมูล — แสดงโครงร่างแทนทั้งกลุ่ม */
    isLoading?: boolean;
    className?: string;
    containerClassName?: string;
    children?: React.ReactNode;
};
declare function CheckboxGroup<V extends string = string>({ id, className, containerClassName, label, hint, error, required, name, disabled, options, value: valueProp, defaultValue, onValueChange, orientation, size, isLoading, children, }: CheckboxGroupProps<V>): React.JSX.Element;
declare namespace CheckboxGroup {
    var displayName: string;
}
type CheckboxGroupItemProps = Omit<React.ComponentProps<typeof RadixCheckbox.Root>, "asChild" | "checked" | "onCheckedChange" | "value"> & {
    value: string;
    description?: React.ReactNode;
};
declare const CheckboxGroupItem: React.ForwardRefExoticComponent<Omit<CheckboxGroupItemProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

type PillSwitchOption<V extends string = string> = {
    value: V;
    label: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
};
type PillSwitchProps<V extends string = string> = Omit<React.ComponentProps<typeof RadixRadio.Root>, "asChild" | "children" | "value" | "defaultValue" | "onValueChange" | "orientation"> & {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    /** Controlled selected value. */
    value?: V;
    /** Initial selected value (uncontrolled). */
    defaultValue?: V;
    onValueChange?: (value: V) => void;
    /**
     * Exactly 2 options today — PillSwitch is a binary segmented toggle (both
     * labels always visible, selected one highlighted). Typed as a fixed tuple
     * so a 3rd option is a compile error now.
     *
     * Designed to extend to N options later without a breaking change: it's
     * already `value`/`defaultValue`/`onValueChange` + an `options` list on top
     * of a real Radix `RadioGroup` (which gives roving-tabindex arrow-key nav
     * and `role="radiogroup"`/`role="radio"` for free, and already scales to
     * any option count). The only change needed to support N options is
     * widening this type to `PillSwitchOption<V>[]` — every existing 2-option
     * caller stays source-compatible since a 2-tuple is assignable to an array.
     */
    options: readonly [PillSwitchOption<V>, PillSwitchOption<V>];
    containerClassName?: string;
};
declare function PillSwitch<V extends string = string>({ id, className, containerClassName, label, hint, error, required, options, disabled, ...props }: PillSwitchProps<V>): React.JSX.Element;
declare namespace PillSwitch {
    var displayName: string;
}

declare const chipVariants: (props?: ({
    variant?: "primary" | "info" | "success" | "warning" | "neutral" | "danger" | null | undefined;
    fill?: "subtle" | "solid" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
    interactive?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type ChipProps = React.ComponentProps<"span"> & VariantProps<typeof chipVariants> & {
    leftIcon?: React.ReactNode;
    /** Show an × button. Calls `onRemove` (preferred) or falls back to `onClick`. */
    removable?: boolean;
    onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    /** ข้อมูลยังมาไม่ถึง — แทนด้วยแคปซูลเทาขนาดเท่าชิปจริง */
    isLoading?: boolean;
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
    /**
     * ให้วงกลมมีสีประจำตัว — วนจากชุด 6 โทน โดยคีย์เดิมได้สีเดิมเสมอ
     *
     * 🔴 ส่ง **id ที่ไม่มีวันเปลี่ยน** ไม่ใช่ชื่อ — ชื่อแก้ได้ (แต่งงาน · แก้ตัวสะกด ·
     * เติมคำนำหน้า) ถ้าผูกสีกับชื่อ วงกลมของคนเดิมจะเปลี่ยนสีวันที่ฝ่ายบุคคลแก้ตัวสะกด
     * ซึ่งในตารางที่คนจำกันด้วยสี อ่านได้ว่า "นี่คนละคน"
     *
     * ไม่ส่ง = เทาเหมือนเดิม (สีคือของเพิ่ม ไม่ใช่ค่าตั้งต้น — จอที่มีอยู่ไม่ขยับ)
     */
    colorKey?: string | number;
    /** ข้อมูลยังมาไม่ถึง — แทนด้วยวงกลมเทาขนาดเท่ากัน */
    isLoading?: boolean;
};
declare const Avatar: React.ForwardRefExoticComponent<Omit<AvatarProps, "ref"> & React.RefAttributes<HTMLSpanElement>>;

declare const iconButtonVariants: (props?: ({
    variant?: "ghost" | "solid" | "outline" | "ghost-destructive" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type IconButtonProps = Omit<React.ComponentProps<"button">, "aria-label"> & VariantProps<typeof iconButtonVariants> & {
    /**
     * Required — icon-only buttons have no visible text for assistive tech
     * to fall back on. Describe the action, e.g. "Edit", "Delete row".
     */
    "aria-label": string;
    /**
     * Icon to render. Ignored when `asChild` — pass your own child element instead.
     *
     * ส่งเป็น `children` ก็ได้ (`<IconButton><Pencil/></IconButton>`) — prop นี้ชนะเมื่อส่งมาทั้งคู่
     */
    icon?: React.ReactNode;
    asChild?: boolean;
    /** ผู้ใช้กดแล้วกำลังทำงาน — แสดงสปินเนอร์ ปุ่มยังอยู่ที่เดิม */
    loading?: boolean;
    /** ข้อมูลยังมาไม่ถึง — แทนทั้งปุ่มด้วยวงกลมเทา (คนละเรื่องกับ `loading`) */
    isLoading?: boolean;
};
/**
 * Icon-only action button — table-row actions, toolbars. Always pass
 * `aria-label`; use `asChild` to wrap a router `<Link>` while keeping real
 * button semantics (fixes the div+Link pattern found in the audit, which
 * wasn't keyboard-focusable at all).
 */
declare const IconButton: React.ForwardRefExoticComponent<Omit<IconButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

declare const buttonGroupVariants: (props?: ({
    align?: "end" | "fill" | "start" | "between" | null | undefined;
    gap?: "sm" | "md" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type ButtonGroupProps = React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>;
/** Alignment/spacing wrapper for a row of 1-3 buttons (dialog/drawer footers, toolbars). */
declare const ButtonGroup: React.ForwardRefExoticComponent<Omit<ButtonGroupProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
type ConfirmCancelActionsProps = {
    onConfirm: () => void;
    onCancel: () => void;
    /** Localized confirm-button text — required, no hardcoded English default. */
    confirmLabel: string;
    /** Localized cancel-button text — required, no hardcoded English default. */
    cancelLabel: string;
    confirmVariant?: ButtonProps["variant"];
    cancelVariant?: ButtonProps["variant"];
    size?: ButtonProps["size"];
    /** Independent from `isLoading` — lets confirm be disabled by form validity while nothing is submitting. */
    isConfirmDisabled?: boolean;
    isCancelDisabled?: boolean;
    /** Disables both buttons and shows a spinner on confirm. */
    isLoading?: boolean;
    align?: Extract<VariantProps<typeof buttonGroupVariants>["align"], "end" | "between" | "fill">;
    gap?: VariantProps<typeof buttonGroupVariants>["gap"];
    className?: string;
};
/**
 * Convenience Confirm+Cancel action row on top of `ButtonGroup` — the ~90%
 * common case (mirrors mediwork's `PlacementDrawerFooter`, the only place
 * this was already done properly). For anything else, compose `Button`
 * inside `ButtonGroup` directly.
 */
declare const ConfirmCancelActions: React.ForwardRefExoticComponent<ConfirmCancelActionsProps & React.RefAttributes<HTMLDivElement>>;

/** ขนาดตัวอักษรสำหรับเนื้อความ — ระดับ `title-*` อยู่ที่ `Heading` แทน
 *
 * แยกเป็นคนละ component เพราะข้อมูลจริงแยกตัวเองที่ 18/20px: ทุกอย่างต่ำกว่านั้น
 * ใช้ weight 400 เป็นค่าปกติ ส่วน `title-*` พบเฉพาะ 600/700 ในทั้ง 3 แอป
 * ถ้ารวมเป็น component เดียวจะต้องแบก union ของทุก prop โดยไม่มีอะไรกันการผสมมั่ว
 */
declare const textVariants: (props?: ({
    variant?: "caption" | "body-sm" | "body-md" | "body-lg" | null | undefined;
    weight?: "bold" | "normal" | "medium" | "semibold" | null | undefined;
    tone?: "link" | "body" | "inherit" | "success" | "warning" | "disabled" | "brand" | "danger" | "default" | "muted" | null | undefined;
    truncate?: boolean | null | undefined;
    numeric?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type TextProps = Omit<React.ComponentProps<"p">, "color"> & VariantProps<typeof textVariants> & {
    /** element ที่จะ render — default `p` · ใช้ `span` เมื่ออยู่ในบรรทัดเดียวกับข้อความอื่น */
    as?: React.ElementType;
    /** ข้อมูลยังมาไม่ถึง — แทนด้วยแถบสูงเท่าบรรทัดจริงของระดับตัวอักษรนั้น */
    isLoading?: boolean;
    /** ความกว้างของแถบตอนโหลด · ค่าเริ่มต้น `100%` — ใส่เป็น `8rem` หรือ `60%` ก็ได้ */
    skeletonWidth?: string;
};
declare const Text: React.ForwardRefExoticComponent<Omit<TextProps, "ref"> & React.RefAttributes<HTMLParagraphElement>>;

declare const headingVariants: (props?: ({
    size?: "body-lg" | "title-sm" | "title-md" | "title-lg" | null | undefined;
    weight?: "bold" | "medium" | "semibold" | null | undefined;
    tone?: "inherit" | "heading" | "brand" | "default" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type HeadingProps = Omit<React.ComponentProps<"h2">, "color"> & VariantProps<typeof headingVariants> & {
    /** ระดับหัวข้อทางความหมาย (h1-h6) — **แยกจาก `size` โดยตั้งใจ**
     *
     * ลำดับหัวข้อในหน้าเป็นเรื่องของ screen reader ส่วนขนาดเป็นเรื่องของสายตา
     * การผูกสองอย่างเข้าด้วยกันบังคับให้ต้องเลือกอย่างใดอย่างหนึ่ง —
     * เช่นหัวข้อ h2 ที่ต้องดูเล็กกว่า h3 ข้าง ๆ ในการ์ด
     */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    /** ข้อมูลยังมาไม่ถึง — แทนด้วยแถบสูงเท่าบรรทัดจริงของขนาดหัวข้อนั้น */
    isLoading?: boolean;
    /** ความกว้างของแถบตอนโหลด · หัวข้อมักไม่เต็มบรรทัด ค่าเริ่มต้นจึงเป็น `16rem` */
    skeletonWidth?: string;
};
declare const Heading: React.ForwardRefExoticComponent<Omit<HeadingProps, "ref"> & React.RefAttributes<HTMLHeadingElement>>;

/** @doc ./AppShowcaseDialog.md */

/**
 * 🔴 **กล่องนี้ถือคำแปลเอง — ต่างจาก `ContactSupportDialog` ที่รับ `labels` จากผู้เรียก**
 *
 * เหตุผลที่ต่าง ไม่ใช่ความไม่สม่ำเสมอ:
 * · `ContactSupportDialog` พูดในบริบทของ *งานในจอ* ("ติดต่อเราถ้าติดปัญหาเรื่องนี้") แต่ละแอป
 *   จึงมีสิทธิ์เรียบเรียงถ้อยคำของตัวเอง ⇒ DS ถือแค่ทรงกับเบอร์
 * · กล่องนี้เป็น **คำโปรยขายผลิตภัณฑ์ที่มาจาก Figma** — ประโยคเดียวกันเป๊ะทุกแอปโดยนิยาม
 *   ถ้าให้แต่ละแอปถือคำแปลเอง จะได้คำโปรยของ Medi Pay ที่ไม่ตรงกันระหว่าง Portal กับ MediHR
 *   ซึ่งเป็นสิ่งเดียวกับที่ทำให้เบอร์โทรเคยเพี้ยน 4 ที่ (เหตุผลที่ `ContactSupportDialog` ย้ายมา DS)
 *
 * ⚠️ ผลที่ตามมา: **แอปไม่ต้องมีคีย์ i18n ของกล่องนี้เลย** · ถ้าจะเปลี่ยนถ้อยคำ ต้องเปลี่ยนที่นี่ที่เดียว
 *    และถือเป็นการเปลี่ยนของ design ไม่ใช่ของแอป
 */
type ShowcaseLocale = "th" | "en";
/** แอปที่ยังไม่เปิดใช้งานจริง — กดแล้วเปิดกล่องนี้แทนการพาออกไป */
type ShowcaseAppKey = "medihr" | "medioncloud" | "medirefer" | "medipay";
type ShowcaseCopy = {
    /** ชื่อผลิตภัณฑ์ — ใช้เป็น `aria-label` และ `alt` ของโลโก้ */
    name: string;
    /** พาดหัว · `\n` = ขึ้นบรรทัดตามแบบ (ไทยไม่มีเว้นวรรค เบราว์เซอร์ตัดคนละที่กับ Figma) */
    headline: string;
    description: string;
};
declare const SHOWCASE_COPY: Record<ShowcaseAppKey, Record<ShowcaseLocale, ShowcaseCopy>>;
type ShowcaseImageBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};
type ShowcaseLayout = {
    /** ความสูงจริงของกรอบโลโก้ใน Figma (ความกว้างปล่อยตามสัดส่วน) */
    logoHeight: number;
    /** ระยะจากขอบซ้ายของกรอบเนื้อหาถึงคอลัมน์ขวา — **ไม่เท่ากันทั้ง 4 แบบ** */
    columnX: number;
    columnWidth: number;
    preview: {
        width: number;
        height: number;
        /** ภาพจอกว้าง (ชั้นหลัง) */
        wide: ShowcaseImageBox;
        /** ภาพที่ซ้อนทับมุมล่างซ้าย */
        card: ShowcaseImageBox;
    };
};
/**
 * 📐 **ทรงเป็น px คงที่ ไม่ยืดตามจอ** — ดีไซน์ทั้ง 4 แบบวางภาพคนละตำแหน่ง/ขนาด และคอลัมน์ขวา
 * ก็ไม่ได้เริ่มที่ x เดียวกัน (571 / 577.7 / 594 / 610.4) ⇒ ค่าพวกนี้เป็นของ **แต่ละผลิตภัณฑ์**
 * ไม่ใช่สูตรกลาง · จอที่แคบกว่านั้นให้เลื่อนดู (`overflow-auto` ที่ฉากหลัง) ดีกว่าย่อจนไม่ตรงแบบ
 *
 * ที่มา: Figma node 2986:37737 (HR) · 3012:43436 (On cloud) · 2967:35789 (Refer) · 3012:45681 (Pay)
 * — ชุดเดียวกับที่ Portal ใช้บน staging (`src/config/apps.ts`) ยกมาทั้งชุดเพื่อไม่ให้สองที่ไหลออกจากกัน
 *
 * 🔴 **ทุกตัวเลขต้องเทียบทีละช่องกับ `APP_CATALOG` ของ Portal ก่อนแก้** — ค่ารอบแรกของ
 * Refer/Pay ถูกยกมาจากของ HR แล้วเปลี่ยนแค่ `x` ซึ่งอ่านผ่าน ๆ ดูสมเหตุผล (เลขชุด
 * `381.436×280.779` โผล่ซ้ำทั้ง 4 แบบ) แต่ภาพออกมาผิดขนาดทั้งใบ · แก้แล้ว 2026-08-16
 */
declare const SHOWCASE_LAYOUT: Record<ShowcaseAppKey, ShowcaseLayout>;
type ShowcaseAssets = {
    /** โลโก้เต็มของผลิตภัณฑ์ */
    logo: string;
    /** ภาพจอกว้าง (ชั้นหลัง) */
    wide: string;
    /** ภาพที่ซ้อนทับมุมล่างซ้าย */
    card: string;
};
type AppShowcaseDialogProps = {
    /** แอปที่ถูกกด · `null` = ปิด */
    app: ShowcaseAppKey | null;
    onClose: () => void;
    /** ภาษาของคำโปรย — ค่าเริ่มต้น `"th"` (ตรงกับ `Calendar` ของ DS ที่ default เป็น `th-TH`) */
    locale?: ShowcaseLocale;
    /** โฟลเดอร์ของภาพ ถ้าแอปไม่ได้วางไว้ที่ `/images/app-showcase` */
    assetBaseUrl?: string;
    /** ทับที่อยู่ภาพรายผลิตภัณฑ์ (เช่นแอปที่เสิร์ฟจาก CDN) */
    assets?: Partial<Record<ShowcaseAppKey, ShowcaseAssets>>;
    className?: string;
};
/**
 * หน้าต่าง "ตัวอย่างผลิตภัณฑ์ + ช่องทางติดต่อ" ของแอปที่ยังไม่เปิดใช้งานบนแอปที่ผู้ใช้ยืนอยู่
 *
 * ใช้คู่กับ `TopNav.AppLauncher`: การ์ดของแอปที่ยังไม่เปิดจะเรียกกล่องนี้แทนการพาออกไป
 * ⇒ ผู้ใช้ได้เห็นว่าแอปทำอะไรและติดต่อใครต่อได้ทันที แทนที่จะเจอปุ่มตายที่เขียนว่า "เร็ว ๆ นี้"
 *
 * ทำไมไม่ใช้ `Dialog` ของ DS: ฉากหลังของแบบนี้เป็น **ขาว 20% + เบลอ 5px** (Figma `Rectangle 23`)
 * ไม่ใช่ฉากมืดแบบ `DialogOverlay` และตัวกล่องเป็น px คงที่ 944×467 ไม่ใช่ `size` ของ Dialog
 */
declare function AppShowcaseDialog({ app, onClose, locale, assetBaseUrl, assets, className, }: AppShowcaseDialogProps): React.ReactPortal | null;

type TopNavProps = React.ComponentProps<"header"> & {
    /** Render as fixed/sticky bar that floats with rounded corners. Default `false` (inline). */
    floating?: boolean;
};
declare const TopNav: React.ForwardRefExoticComponent<Omit<TopNavProps, "ref"> & React.RefAttributes<HTMLElement>>;
type TopNavToggleProps = Omit<React.ComponentProps<"button">, "children" | "onToggle"> & {
    /** แถบเมนูซ้ายยุบอยู่หรือไม่ — คุมว่าจะโชว์ไอคอน "กาง" หรือ "พับ" */
    collapsed?: boolean;
    onToggle?: (next: boolean) => void;
    /**
     * ข้อความสำหรับ `title`/`aria-label` — แอปส่งคำแปลมาเอง (DS ไม่มี i18n)
     *
     * ⚠️ ปุ่มนี้มีแต่ไอคอน ถ้าไม่ส่งมา โปรแกรมอ่านหน้าจอจะเจอปุ่มไม่มีชื่อ
     * (บทเรียนเดียวกับปุ่มเมนูตอน `Sidebar` ยุบ) จึงมีค่าตั้งต้นภาษาอังกฤษให้
     */
    labels?: {
        expand: string;
        collapse: string;
    };
};
/**
 * ปุ่มพับ/กางแถบเมนูซ้าย — ไอคอนเป็นไฟล์เดียวกับที่ Portal ใช้จริง
 *
 * 📐 วัดจาก Portal: **32×32** · มุม 8 · ไอคอน **20×20** · hover พื้นเทาอ่อน
 */
declare const TopNavToggle: React.ForwardRefExoticComponent<Omit<TopNavToggleProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
type TopNavBrandProps = React.ComponentProps<"div"> & {
    logo?: React.ReactNode;
};
declare const TopNavBrand: React.ForwardRefExoticComponent<Omit<TopNavBrandProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const TopNavSpacer: ({ className }: {
    className?: string;
}) => React.JSX.Element;
/** Canonical app keys across the Mediact ecosystem. */
/** แอปในระบบนิเวศ Mediact
 *
 * 🔄 **กลับมาครบ 6 ตัว 2026-08-16** — รอบก่อนตัด `medipay`/`medirefer` ฯลฯ ออก (2026-08-09)
 * เพราะช่องที่เขียนว่า "เร็ว ๆ นี้" เป็นสัญญาที่ไม่มีใครถือ · ตอนนี้กลับมาได้เพราะ **ไม่ใช่ป้ายตาย
 * อีกแล้ว** — Portal ทำหน้าต่างตัวอย่างผลิตภัณฑ์ + ช่องทางติดต่อไว้บน staging แล้ว
 * (`feat/app-launcher-coming-soon`) ⇒ กดแล้วผู้ใช้ได้เห็นว่าแอปทำอะไรและติดต่อใครต่อได้ทันที
 *
 * ⚠️ `medistock`/`medicare` **ยังไม่กลับมา** — ยังไม่มีทั้งแบบและคำโปรยจาก Figma
 * ⇒ ถ้าเติมโดยไม่มีเนื้อหา จะกลายเป็นป้ายตายแบบเดิมอีกรอบ */
type MediactAppKey = "mediwork" | "medimatch" | "medihr" | "medioncloud" | "medirefer" | "medipay";
type MediactAppConfig = {
    /** Where this app lives. Falsy → tile is rendered as not-clickable. */
    baseUrl?: string;
    /** Show "Coming Soon" subtitle and disable the tile. */
    comingSoon?: boolean;
    /**
     * แอปนี้ยังไม่เปิดใช้งานบนโรงพยาบาลนี้ ⇒ **กดได้** แต่เปิดหน้าต่างตัวอย่างผลิตภัณฑ์
     * (`AppShowcaseDialog`) แทนการพาออกไป — ต่างจาก `comingSoon` ที่เป็นป้ายตายกดไม่ได้
     *
     * ⚠️ มีเนื้อหาเฉพาะ 4 ตัวที่ Figma ทำแบบไว้ (`ShowcaseAppKey`) ⇒ ตั้งกับ `mediwork`/`medimatch`
     *    จะไม่มีผล เพราะไม่มีคำโปรย/ภาพให้แสดง
     */
    showcase?: boolean;
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
    /** ลำดับการแสดง ค่าเริ่มต้น: mediwork → medimatch → medihr */
    order?: MediactAppKey[];
    /** Override default `<a href>` navigation (e.g. for SPA routing). */
    onAppClick?: (key: MediactAppKey, app: MediactAppConfig) => void;
    /** Tooltip / aria-label for the trigger. Default "Apps". */
    label?: string;
    /** Subtitle shown beneath disabled / coming-soon tiles. */
    comingSoonText?: string;
    /**
     * ภาษาของ **หน้าต่างตัวอย่างผลิตภัณฑ์** — คำโปรยอยู่ใน DS ทั้ง th/en (ดู `AppShowcaseDialog`)
     * ⇒ แอปไม่ต้องมีคีย์ i18n ของกล่องนี้ ส่งแค่ภาษาที่ผู้ใช้เลือกอยู่
     */
    showcaseLocale?: ShowcaseLocale;
    /** โฟลเดอร์ภาพของหน้าต่างตัวอย่าง ถ้าไม่ได้วางที่ `/images/app-showcase` */
    showcaseAssetBaseUrl?: string;
    /** ทับที่อยู่ภาพรายผลิตภัณฑ์ */
    showcaseAssets?: Partial<Record<ShowcaseAppKey, ShowcaseAssets>>;
    /**
     * ปุ่มก้นลิ้นชักที่พาไปหน้าตั้งค่าของ Portal — ของจริงมีทุกแอป
     *
     * ข้อความส่งมาจากแอปเสมอ (DS ไม่มี i18n)
     */
    settingsAction?: {
        label: React.ReactNode;
        href?: string;
        onClick?: (e: React.MouseEvent) => void;
    };
    className?: string;
};
declare function AppLauncher({ apps, order, onAppClick, label, comingSoonText, showcaseLocale, showcaseAssetBaseUrl, showcaseAssets, settingsAction, className, }: AppLauncherProps): React.JSX.Element;
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
        /**
         * สิ่งที่แสดงแทนรูปเมื่อไม่มีรูป — ไม่ส่งก็ได้อักษรย่อจากชื่อ (ค่าเริ่มต้นของ `Avatar`)
         *
         * มีไว้เพราะบางแอปใช้ **ไอคอนคน** ไม่ใช่อักษรย่อ · ถ้าไม่มีช่องนี้ การย้ายมาใช้
         * `UserMenu` จะเปลี่ยนสิ่งที่ผู้ใช้เห็นโดยไม่ได้ตั้งใจ
         */
        fallback?: React.ReactNode;
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
declare function UserMenu({ user, items, onLogout, logoutLabel, bottomLeft, label, className, }: UserMenuProps): React.JSX.Element;

type LanguageOption = {
    /** ค่าที่คืนกลับตอนเลือก — โดยมากคือรหัสภาษาของ i18n (`th-TH` · `en-EN`) */
    value: string;
    /**
     * ชื่อภาษา **ในภาษานั้นเอง** — "ไทย" ไม่ใช่ "Thai"
     *
     * คนที่ต้องใช้เมนูนี้คือคนที่อ่านภาษาปัจจุบันไม่ออก การแปลชื่อภาษาตามภาษาที่
     * เปิดอยู่จึงทำให้เขาหาบรรทัดของตัวเองไม่เจอ
     */
    label: string;
};
type LanguageSwitcherProps = {
    languages: LanguageOption[];
    /** รหัสภาษาที่ใช้อยู่ — ต้องตรงกับ `value` สักตัวในรายการ */
    value?: string;
    onChange?: (value: string) => void;
    /** `aria-label` ของปุ่ม — DS ไม่มี i18n แอปส่งคำแปลมาเอง */
    label?: string;
    align?: "start" | "center" | "end";
    className?: string;
};
/**
 * ปุ่มเปลี่ยนภาษา — เมนูหล่นลงที่เลือกได้ในคลิกเดียว
 *
 * ใช้ `DropdownMenu` แบบ **radio** ไม่ใช่ `Select` โดยตั้งใจ: นี่ไม่ใช่ช่องกรอกในฟอร์ม
 * (ไม่มีป้ายกำกับ ไม่ถูกส่งไปกับฟอร์ม ไม่มีสถานะผิด) แต่เป็นคำสั่งที่มีผลทันทีที่กด
 * · `role="menuitemradio"` + `aria-checked` บอกโปรแกรมอ่านหน้าจอว่าตอนนี้อยู่ภาษาไหน
 *
 * 🔴 ถ้า `value` ไม่ตรงกับตัวไหนในรายการ ปุ่มจะโชว์แต่ลูกโลกเปล่า ๆ — **ตั้งใจ**
 * เดาเป็นตัวแรกในรายการคือการบอกผู้ใช้ว่ากำลังอยู่ภาษาที่ไม่ได้อยู่จริง
 * (แอปที่ i18n มี fallback ของตัวเองอยู่แล้ว ให้ normalize ก่อนส่งมา)
 */
declare function LanguageSwitcher({ languages, value, onChange, label, align, className, }: LanguageSwitcherProps): React.JSX.Element;
declare namespace LanguageSwitcher {
    var displayName: string;
}

/**
 * อ่านสถานะราง **จากข้างใน** `<Sidebar>` — สำหรับ `header`/`footer` ที่ต้องเปลี่ยนตอนยุบ
 * (เช่น สลับโลโก้เต็มเป็นตัวมาร์ค)
 *
 * 🔴 ผู้เรียกคำนวณเองไม่ได้ เพราะ `expandOnHover` ทำให้ "กางอยู่หรือไม่" ไม่เท่ากับ
 * `collapsed` ที่ส่งเข้ามา — DS ถือ state ตัวนั้นไว้เอง
 *
 * ⚠️ `header` เป็น prop ก็จริง แต่ถูก **render อยู่ข้างใน** provider — context จึงถึง
 * (React ผูก context ตามตำแหน่งที่ render ไม่ใช่ตำแหน่งที่สร้าง element)
 */
declare function useSidebarState(): {
    isCollapsed: boolean;
};
type SidebarProps = React.ComponentProps<"aside"> & {
    /**
     * โลโก้แอปแบบ **แยกชิ้น** — DS ตัดสินเองว่าตอนยุบเหลืออะไร
     *
     * มีไว้แทน `header` ที่ให้แอปประกอบเอง ซึ่งบังคับให้ทุกแอปเขียน `isCollapsed ? mark : full`
     * ซ้ำกันทุกที่และต้องมี **ไฟล์โลโก้ 2 ไฟล์ต่อแอป** · ผลคือขนาดหลุดจากกันเงียบ ๆ — วัดจริง:
     * โลโก้เต็มของ MediHR สัดส่วน 3.84:1 ส่วนของ Portal 4.32:1 ⇒ ความสูงเท่ากันแต่กว้างต่างกัน 12%
     *
     * ⚠️ `name` รับได้ทั้ง **ตัวหนังสือและรูป** โดยตั้งใจ — wordmark ของทั้ง Portal และ MediHR
     * วันนี้เป็น **path ที่วาดไว้ ไม่ใช่ฟอนต์** (ไม่มี `<text>` ไม่มี `font-family` ในไฟล์เลย)
     * ⇒ ส่งเป็นสตริงจะได้ตัวอักษรของฟอนต์แอป ซึ่ง **ไม่ใช่ letterform ของแบรนด์**
     * แอปที่ยังต้องคงลายมือแบรนด์ให้ส่ง `<img>` เฉพาะส่วน wordmark เข้ามา
     */
    brand?: {
        /** เครื่องหมายของแอป — เห็นทั้งตอนกางและตอนยุบ */
        symbol: React.ReactNode;
        /** ชื่อแอป — เห็นเฉพาะตอนกาง (ตัวหนังสือ หรือ `<img>` ของ wordmark) */
        name?: React.ReactNode;
        /** ของที่ต้องอยู่ขวาสุดของหัวราง เช่นปุ่มปิดลิ้นชักบนมือถือ — เห็นเฉพาะตอนกาง */
        action?: React.ReactNode;
    };
    /**
     * Logo / brand block rendered at the top.
     *
     * @deprecated ใช้ `brand` แทน — ตัวนี้ให้แอปประกอบหัวรางเองทั้งก้อน ซึ่งเป็นที่มาของ
     * โค้ดสลับโลโก้ที่ซ้ำกันทุกแอป · ยังรองรับอยู่และ**ชนะ** `brand` เมื่อส่งมาทั้งคู่
     */
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
    /** Component used to render `SidebarItem`'s `href` links — e.g. next/link's
     *  `Link`. Must accept `href`, `className`, and `children`. Defaults to a
     *  plain `<a>`, which keeps this package framework-agnostic. Same shape as
     *  `Breadcrumb`'s `linkComponent`. */
    linkComponent?: React.ElementType;
    /**
     * Presentational-only mobile off-canvas mode. When set (`true`/`false`,
     * not `undefined`), the sidebar becomes a fixed drawer + backdrop below the
     * `lg` breakpoint, sliding in/out based on this value, and renders as a
     * normal static rail at `lg` and above. The app owns *when* to open it
     * (e.g. a hamburger button) and any persistence — this prop is not read
     * from / written to storage by the DS.
     */
    mobileOpen?: boolean;
    /** Called when the backdrop is clicked or Escape is pressed while `mobileOpen`. */
    onMobileOpenChange?: (open: boolean) => void;
    /**
     * ยุบอยู่แล้วเอาเมาส์ไปวาง = กางออกชั่วคราว (ของจริงใน Portal ทำแบบนี้)
     *
     * ⚠️ กางแล้ว **ราง sidebar กว้างขึ้นจริง** เนื้อหาข้าง ๆ จึงขยับตาม
     * ไม่ใช่การลอยทับ — ตรงกับพฤติกรรมของ Portal ถ้าไม่ต้องการให้ขยับ ส่ง `false`
     * @default true
     */
    expandOnHover?: boolean;
    /**
     * ปุ่มติดต่อฝ่ายสนับสนุนที่ก้นราง — ของจริงมีทุกจอ
     *
     * ข้อความส่งมาจากแอปเสมอ (DS ไม่มี i18n) · ไอคอนไม่ส่งก็ได้ ค่าเริ่มต้นเป็นหูฟัง
     * ตอนยุบจะเหลือแค่ไอคอน และใช้ `label` เป็น `title`/`aria-label`
     */
    supportAction?: {
        label: React.ReactNode;
        onClick: () => void;
        icon?: React.ReactNode;
    };
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
declare function SidebarItem({ id, label, icon: Icon, href, onClick, badge, className, }: SidebarItemProps): React.JSX.Element;
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
    /**
     * เมนูลูกตัวใดตัวหนึ่งของกลุ่มนี้คือหน้าที่เปิดอยู่
     *
     * ใช้เฉพาะตอนราง**ยุบ** — ตอนนั้นเมนูลูกถูกซ่อน ถ้าไม่บอก จะไม่มีอะไรบนจอ
     * บอกว่าผู้ใช้อยู่หน้าไหน · ผู้เรียกเป็นคนรู้รายการเมนู component เห็นแค่ children
     * ที่ render มาแล้ว จึงคำนวณเองไม่ได้
     */
    isChildActive?: boolean;
    children?: React.ReactNode;
    className?: string;
};
declare function SidebarGroup({ id, label, icon: Icon, defaultExpanded, expanded, onExpandedChange, isChildActive: hasActiveChild, children, className, }: SidebarGroupProps): React.JSX.Element;

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
    /**
     * Always reserve one line of height for the hint/error slot below the field, even when
     * neither is set — prevents layout shift when an error appears/disappears.
     *
     * ⚠️ Default is `true`, which matches what every real consumer app already does today
     * (spacer div or `helperText={error ?? ' '}` workarounds) — but it changes the rendered
     * height of every existing field using this shell that doesn't explicitly pass this prop.
     * Confirm this default with the team before relying on it in layouts that assumed the old
     * zero-height "no message" behavior.
     * @default true
     */
    reserveMessageSpace?: boolean;
    className?: string;
    children: React.ReactNode;
};
/**
 * Layout shell shared by every form primitive (Input, Textarea, Select, ...).
 * Renders: [Label] [children] [hint | error]
 */
declare function FormField({ label, hint, error, required, htmlFor, hideLabel, reserveMessageSpace, className, children, }: FormFieldProps): React.JSX.Element;

/** @doc ./Calendar.md */

/** 🔴 ห้ามใช้ `toISOString()` ทำ key — มันแปลงเป็น UTC ก่อน ⇒ ไทย (UTC+7)
 * ได้วันที่ย้อนไป 1 วันทุกครั้งที่เวลาต่ำกว่า 07:00 */
declare const dayKey: (d: Date) => string;
type CalendarView = "day" | "month" | "year";
type CalendarLabels = {
    prevMonth: string;
    nextMonth: string;
    prevYear: string;
    nextYear: string;
    chooseMonth: string;
    /** ปุ่มหัวปฏิทินตอนอยู่มุมมอง 12 เดือน — กดแล้วไปตารางปี */
    chooseYear: string;
    /** ลูกศรในมุมมองปี — เลื่อนทีละ 12 ปี ไม่ใช่ทีละปี */
    prevYears: string;
    nextYears: string;
};
type CalendarProps = {
    /** เดือนที่กำลังแสดง — ผู้เรียกถือ state เอง เพื่อให้อยู่รอดตอน popover re-render */
    month: Date;
    onMonthChange: (month: Date) => void;
    /** วันที่เลือก (หรือปลายต้นของช่วง) */
    selected?: Date | null;
    /** ปลายท้ายของช่วง — ส่งมาเมื่อเลือกเป็นช่วงวัน จะวาดแถบเชื่อม */
    rangeEnd?: Date | null;
    /** พรีวิวปลายท้ายระหว่างลากเลือก — ไม่มีผลถ้าไม่ได้เลือกเป็นช่วง */
    hoverEnd?: Date | null;
    minDate?: Date | null;
    maxDate?: Date | null;
    /** ปิดวันเป็นราย ๆ นอกเหนือจากช่วง min/max (เช่นวันหยุด) */
    disabledDate?: (day: Date) => boolean;
    onSelect?: (day: Date) => void;
    onDayHover?: (day: Date | null) => void;
    /** มุมมองเริ่มต้น · `month` = เปิดมาที่ตาราง 12 เดือนเลย */
    defaultView?: CalendarView;
    /**
     * เลือกเดือนแล้วจบเลย ไม่ต้องลงไปเลือกวัน
     *
     * ใช้กับตัวเลื่อนเดือน (`DateNavigator unit="month"`) ซึ่งหน่วยของมันคือเดือน
     * ไม่ใช่วัน — ถ้าไม่มีอันนี้ผู้ใช้ต้องกดเดือนแล้วกดวันอีกทีทั้งที่วันไม่มีความหมาย
     */
    selectMonth?: boolean;
    /**
     * วันที่ถือว่าเป็น "วันนี้" — วาดเป็น **วงแหวน ไม่ใช่วงกลมทึบ**
     *
     * 🔴 เป็นแค่ *ป้ายบอกตำแหน่ง* ไม่ใช่ค่าที่ถูกเลือก — ปฏิทินที่ไม่มีจุดอ้างอิงนี้
     * พอเลื่อนไปสองสามเดือนแล้วผู้ใช้ไม่รู้ว่าตัวเองอยู่ตรงไหนเทียบกับปัจจุบัน
     * ⇒ ทรงต้องต่างจากวันที่เลือกชัดเจน (ทึบ = ที่คุณเลือก · วงแหวน = วันนี้)
     * และถ้าวันนี้ถูกเลือกอยู่ด้วย **ทึบชนะ** ไม่ซ้อนสองสถานะบนช่องเดียว
     *
     * ⚠️ ส่ง `null` เพื่อปิด — จำเป็นกับ story/ภาพเทียบ visual ที่ต้องนิ่ง เพราะค่า
     * เริ่มต้นคือ `new Date()` ซึ่งขยับทุกวัน (กับดักเดียวกับที่ `DatePicker.stories`
     * เขียนเตือนไว้ว่า story ที่ผูกกับ `new Date()` จะให้ภาพต่างทุกเดือน)
     *
     * @default วันนี้ตามเครื่องผู้ใช้
     */
    today?: Date | null;
    /** BCP-47 · ค่าเริ่มต้น `th-TH` = ปี พ.ศ. อัตโนมัติ */
    locale?: string;
    /** วันแรกของสัปดาห์ · ค่าเริ่มต้น 0 = อาทิตย์ (ตรงกับของจริงในแอป) */
    weekStartsOn?: 0 | 1;
    labels?: Partial<CalendarLabels>;
    className?: string;
};
/**
 * ตารางเดือน — ฐานเดียวของ `DatePicker` และ `DateNavigator`
 *
 * 📐 ทรงยึดตาม `PickerCalendar` ของ Mediwork (หน้า productivity) ทั้งหมด:
 * กว้าง 340 · ช่องวัน 40 สูง วงกลม 34 · ตาราง 12 เดือนช่องละ 44 มุม 10
 *
 * เขียนเองไม่ได้ใช้ `react-day-picker` / `DateCalendar` ด้วยเหตุผลเดียวกับที่แอป
 * เขียนเอง: ไม่มีตัวแปลง พ.ศ. และแถบช่วงวันเป็นสิ่งที่ทั้งสองตัวไม่มี · พอเขียนเพื่อ
 * ช่วงแล้ว วันเดี่ยวก็ใช้ตัวเดียวกัน ไม่งั้นแอปจะมีปฏิทินสองแบบที่นับปีคนละอย่าง
 *
 * โครง DOM เป็น `<table role="grid">` + `<td role="gridcell" data-day="YYYY-MM-DD">`
 * ตามสัญญาเดิมของ `react-day-picker` — เทสของ `DatePicker` ที่มีอยู่จึงใช้ได้ต่อ
 */
declare const Calendar: React.ForwardRefExoticComponent<CalendarProps & React.RefAttributes<HTMLDivElement>>;

/** @doc ../ui/Calendar.md */

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
    /**
     * ให้ล้างค่าได้จากในช่อง — **X สลับที่กับไอคอนปฏิทิน ไม่ได้โผล่มาอยู่ข้างกัน**
     *
     * ไอคอนสองตัวซ้อนช่องเดียวกัน เห็นทีละตัว: ปกติเป็นปฏิทิน · เอาเมาส์วางบนช่อง
     * (หรือแท็บเข้ามา) แล้วมีค่าอยู่ ⇒ กลายเป็น X · ทรงอยู่ที่ `form/field-icon-slot.tsx`
     * ตัวเดียวกับที่ `DateRangePicker` ใช้ เพื่อไม่ให้สองตัวเพี้ยนออกจากกัน
     *
     * 🔴 **นี่คือทางเดียวที่จะล้างค่าของ `DatePicker`** — ต่างจาก `DateRangePicker`
     * ที่มีปุ่ม "ล้าง" ในฟุตเตอร์ของ popover อยู่แล้ว · ตัวนี้คลิกเดียวจบและปิดทันที
     * จึงไม่มีฟุตเตอร์ให้วางปุ่ม ⇒ ถ้าจอไหนต้อง "ไม่ระบุวัน" ได้ ต้องเปิด prop นี้
     *
     * ⚠️ **บนทัชไม่มี hover** ⇒ X กดไม่ได้ (จงใจ — ไม่งั้นแตะตรงไอคอนแล้วโดนล้างค่า
     * ทั้งที่ตั้งใจเปิดปฏิทิน) ⇒ จอที่ต้องล้างได้บนมือถือยังต้องมีทางอื่นให้ผู้ใช้
     *
     * ⚠️ เปิดแล้ว **กดตรงไอคอนเพื่อ _เปิด_ ปฏิทินไม่ได้อีก** เพราะต้องเอาเมาส์ไปวางก่อน
     * แล้วมันก็กลายเป็น X ไปแล้ว — เปิดปฏิทินใช้กดที่ตัวช่อง ซึ่งกดได้ทั้งแถบ (antd เหมือนกัน)
     * @default false
     */
    showClearInField?: boolean;
    /** ข้อความ a11y ของปุ่มล้าง — แอปส่งคำแปลมาเอง @default "Clear" */
    clearLabel?: string;
    /**
     * จองที่หนึ่งบรรทัดใต้ช่องไว้เสมอ กันเลย์เอาต์กระตุกตอนข้อความผิดโผล่/หาย
     *
     * ค่าตั้งต้นของ shell คือ `true` — ส่ง `false` เมื่อช่องนี้อยู่ในแถวที่ไม่มี validation
     * (แถบตัวกรอง) หรือต้องเรียงความสูงให้ตรงกับของอื่นที่ไม่มีที่ว่างนั้น
     *
     * 🔴 ก่อนหน้านี้ `DatePicker` ไม่รับ prop นี้ ทั้งที่ `Input`/`Select`/`Textarea`/
     * `ComboBox`/`TimePicker` รับกันหมด ⇒ แถวที่มีช่องวันที่ปนอยู่จะปิดที่ว่างพร้อมกัน
     * ทั้งแถวไม่ได้ ต้องยอมเปิดทิ้งไว้ทุกช่องเพื่อให้ความสูงเท่ากัน
     */
    reserveMessageSpace?: boolean;
    disabled?: boolean;
    size?: FieldSize;
    /** BCP-47 locale ของปฏิทิน · `th-TH` = ปี พ.ศ. อัตโนมัติ @default "th-TH" */
    calendarLocale?: string;
    /** วันแรกของสัปดาห์ในปฏิทิน @default 0 (อาทิตย์) */
    weekStartsOn?: 0 | 1;
    /** ข้อความ a11y ของปุ่มในปฏิทิน — แอปส่งคำแปลมาเอง */
    calendarLabels?: Partial<CalendarLabels>;
    className?: string;
    containerClassName?: string;
};
declare function DatePicker({ id, label, hint, error, required, hideLabel, alwaysFloatLabel, placeholder, value, defaultValue, onChange, displayFormat, disabledDate, minDate, maxDate, showClearInField, clearLabel, reserveMessageSpace, disabled, size, calendarLocale, weekStartsOn, calendarLabels, className, containerClassName, }: DatePickerProps): React.JSX.Element;

type FieldIconSlotProps = {
    /** ไอคอนประจำช่อง (ปฏิทิน · นาฬิกา · ฯลฯ) — โชว์เป็นค่าปกติ */
    icon: React.ReactNode;
    /**
     * โชว์ปุ่มล้างซ้อนทับไอคอน — ผู้เรียกคำนวณมาแล้วว่า "เปิดใช้ ∧ มีค่า ∧ ไม่ถูกปิด"
     * ส่ง `false` แล้วช่องนี้เหลือไอคอนตัวเดียว ไม่มี DOM ของปุ่มเลย
     */
    showClear?: boolean;
    /** ข้อความ a11y ของปุ่มล้าง — แอปส่งคำแปลมาเอง (กฎ copy injection ของ DS) */
    clearLabel: string;
    onClear: () => void;
};
declare function FieldIconSlot({ icon, showClear, clearLabel, onClear, }: FieldIconSlotProps): React.JSX.Element;

/** @doc ../ui/Calendar.md */

/** A closed range. `to` is only ever `null` while a selection is half-made. */
type DateRangeValue = {
    from: Date | null;
    to: Date | null;
};
type DateRangePickerLabels = {
    /** Confirm button in the popover footer — commits the draft range. */
    confirm: string;
    /** Clear button in the popover footer, and the field's clear-icon `aria-label`. */
    clear: string;
};
type DateRangePickerProps = {
    id?: string;
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    hideLabel?: boolean;
    alwaysFloatLabel?: boolean;
    /** Placeholder shown at both ends of the dash when nothing is picked. */
    placeholder?: string;
    value?: DateRangeValue;
    defaultValue?: DateRangeValue;
    /** Fired once, when the user confirms or clears — never mid-selection. */
    onChange?: (value: DateRangeValue) => void;
    /**
     * date-fns format string per endpoint — an **override**.
     *
     * 🔴 Left unset, the field formats through `Intl` with `calendarLocale`, so the
     * text and the calendar always name the same year. Passing a date-fns format
     * opts out of that: date-fns has no Buddhist era, so `"PP"` under
     * `calendarLocale="th-TH"` prints **2026 in the field beside 2569 in the
     * calendar** — the two-calendars bug `Calendar.md` exists to prevent. Only pass
     * this when the field is deliberately not in the calendar's locale (a fixed
     * `"yyyy-MM-dd"` for an export screen, say).
     */
    displayFormat?: string;
    disabledDate?: (date: Date) => boolean;
    minDate?: Date;
    maxDate?: Date;
    /**
     * ให้ล้างค่าได้จากในช่อง — **X สลับที่กับไอคอนปฏิทิน ไม่ได้โผล่มาอยู่ข้างกัน**
     *
     * ไอคอนสองตัวซ้อนอยู่ช่องเดียวกัน เห็นทีละตัว: ปกติเป็นปฏิทิน · เอาเมาส์วางบนช่อง
     * (หรือโฟกัสเข้ามา) แล้วมีค่าอยู่ ⇒ กลายเป็น X
     *
     * 📐 ทรงนี้ยึดตาม **antd** ซึ่งใช้อยู่ใน `mediact-web-admin`
     * (`antd/lib/date-picker/style/index.js:190-217` — `-clear` เป็น `absolute`
     * `insetInlineEnd:0` `opacity:0` แล้วตอน `:hover` สลับ `-clear→1` `-suffix→0`)
     * ⇒ ไม่มี layout shift · ระยะเว้นขวาคงที่ `pr-9` ไม่ต้องสลับตามสถานะ
     *
     * 🔴 **ต่างจาก antd ตรงที่เพิ่ม `focus-within`** — antd ใช้ `:hover` อย่างเดียว
     * ซึ่งคนใช้คีย์บอร์ดไม่มีวันเห็นปุ่มนั้นเลย · ที่นี่แท็บเข้ามาก็เห็น
     *
     * ⚠️ **บนทัชไม่มี hover** ⇒ ยังเห็นปฏิทินตามเดิมและ X กดไม่ได้ (`pointer-events-none`
     * จนกว่าจะถูกเผย — จงใจ ไม่งั้นแตะตรงไอคอนแล้วโดนล้างทั้งที่ตั้งใจเปิดปฏิทิน)
     * การล้างบนทัชจึงไปทางปุ่ม "ล้าง" ในฟุตเตอร์ ซึ่งมีอยู่เสมอทุกโหมด
     *
     * ค่าเริ่มต้น **ปิด** เพราะไม่มี field ตัวไหนใน DS ให้ล้างจากในช่อง —
     * `ComboBox` · `EntityAutocomplete` · `DatePicker` · `TimePicker` ย้ายการล้าง
     * ไปไว้ในสิ่งที่เปิดออกมาทั้งหมด · `DateRangeField` ของ Mediwork มี X ในช่อง
     * **ย้ายจอนั้นมาต้องส่ง prop นี้** ไม่งั้นผู้ใช้เดิมเสียปุ่มที่เคยมี
     * @default false
     */
    showClearInField?: boolean;
    /**
     * จองที่หนึ่งบรรทัดใต้ช่องไว้เสมอ กันเลย์เอาต์กระตุกตอนข้อความผิดโผล่/หาย
     *
     * ค่าตั้งต้นของ shell คือ `true` — ส่ง `false` เมื่อช่องนี้อยู่ในแถบตัวกรองที่ไม่มี
     * validation หรือต้องเรียงความสูงให้ตรงกับช่องอื่นที่ปิดที่ว่างนั้นไว้
     *
     * 🔴 เดิมช่องวันที่รับ prop นี้ไม่ได้ ทั้งที่ `Select`/`Input` รับได้ ⇒ แถบตัวกรองที่มี
     * แผนก + หน่วยงาน + ช่วงวันที่ เรียงกัน ปิดที่ว่างได้แค่สองช่องแรก แล้วความสูงจะ
     * ไม่เท่ากัน 20px ในแถวเดียวกัน — ต้องยอมเปิดทิ้งไว้ทั้งแถวเพื่อให้เรียงตรง
     */
    reserveMessageSpace?: boolean;
    disabled?: boolean;
    size?: FieldSize;
    /** BCP-47 locale of the calendar · `th-TH` = Buddhist-era years automatically · @default "th-TH" */
    calendarLocale?: string;
    /** First day of the week in the calendar @default 0 (Sunday) */
    weekStartsOn?: 0 | 1;
    calendarLabels?: Partial<CalendarLabels>;
    /** Copy for the popover's footer buttons and the clear icon — the app sends its own translations. */
    labels?: Partial<DateRangePickerLabels>;
    className?: string;
    containerClassName?: string;
};
/**
 * A from–to date range in one field, with one calendar.
 *
 * `Calendar` already draws a range band (`rangeEnd` / `hoverEnd`) — this is the
 * thin wrapper that was still missing: the draft/confirm state machine, the
 * two-date field, and the footer. Grounded on Mediwork's hand-rolled
 * `DateRangeField` (`mediact-web-backoffice/src/components-v2/shared/DateRangeField.tsx`),
 * which exists because `@mui/x-date-pickers` has no range picker outside the
 * Pro licence — the same gap this package has no reason to leave open either.
 *
 * **The selection is a draft until "OK".** A range is half-nonsense while it
 * is being made (one date picked means "from here to nowhere"), so this does
 * not fire `onChange` on every click — a filter wired straight to it would
 * spend a request on a question nobody asked yet. The second click is always
 * the end; clicking before the start begins a new range rather than silently
 * swapping the pair.
 */
declare function DateRangePicker({ id, label, hint, error, required, hideLabel, alwaysFloatLabel, placeholder, value, defaultValue, onChange, displayFormat, disabledDate, minDate, maxDate, showClearInField, reserveMessageSpace, disabled, size, calendarLocale, weekStartsOn, calendarLabels, labels, className, containerClassName, }: DateRangePickerProps): React.JSX.Element;

/** "HH:mm" string in 24-hour format. */
type TimeValue = string;
type TimePickerProps = {
    id?: string;
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    hideLabel?: boolean;
    /**
     * จองที่หนึ่งบรรทัดใต้ช่องไว้เสมอ กันเลย์เอาต์กระตุกตอนข้อความผิดโผล่/หาย
     * ค่าตั้งต้นของ shell คือ `true` — ส่ง `false` เมื่อช่องนี้อยู่ในแถวที่ต้องเรียงกับ
     * ของอื่น (สวิตช์ · ปุ่ม) ที่ไม่มีที่ว่างนั้น แล้วกรอบที่ตาเห็นจะลอยไม่ตรงกัน
     */
    reserveMessageSpace?: boolean;
    alwaysFloatLabel?: boolean;
    value?: TimeValue | null;
    defaultValue?: TimeValue;
    onChange?: (value: TimeValue) => void;
    /** Minute step in the popover (e.g. 5 → 0, 5, 10…). Default `1`. */
    minuteStep?: number;
    /** @deprecated use `minuteStep` */
    step?: number;
    /**
     * Earliest selectable time, inclusive — 24h "HH:mm" string (e.g. "08:00").
     * Disables out-of-range hour/minute options in the popover and snaps a
     * typed value back into range once focus leaves the field. `value`/`onChange`
     * always stay 24h "HH:mm" regardless.
     */
    minTime?: TimeValue;
    /**
     * Latest selectable time, inclusive — 24h "HH:mm" string (e.g. "17:00").
     * See `minTime`.
     */
    maxTime?: TimeValue;
    /**
     * Display the field + popover in 12-hour format with an AM/PM toggle.
     * Display-only — the committed `value`/`onChange` shape never changes,
     * it stays 24h "HH:mm".
     * @default false
     */
    ampm?: boolean;
    disabled?: boolean;
    size?: FieldSize;
    className?: string;
    containerClassName?: string;
};
declare function TimePicker({ id, label, hint, error, required, hideLabel, reserveMessageSpace, alwaysFloatLabel, value, defaultValue, onChange, minuteStep, step, minTime, maxTime, ampm, disabled, size, className, containerClassName, }: TimePickerProps): React.JSX.Element;

declare const numberStepperVariants: (props?: ({
    invalid?: boolean | null | undefined;
    fullWidth?: boolean | null | undefined;
    disabled?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type NumberStepperProps = Omit<React.ComponentProps<"input">, "value" | "onChange" | "type" | "size"> & Pick<VariantProps<typeof numberStepperVariants>, "fullWidth"> & {
    /**
     * ค่าเป็น **string ไม่ใช่ number** โดยตั้งใจ
     *
     * สิ่งที่พิมพ์ค้างไว้อย่าง `"2."` หรือ `""` ต้องรอดผ่านการ render ไปได้ ถ้าแปลงเป็นตัวเลข
     * ทุกครั้งที่พิมพ์ จุดทศนิยมจะถูกกลืนหายทันทีที่กด และช่องว่างจะเด้งกลับเป็น 0
     * ⇒ พิมพ์เองไม่ผ่านตัวแปลง มีแต่ปุ่ม −/+ เท่านั้นที่ผลิตตัวเลข
     */
    value: string;
    onChange: (raw: string) => void;
    /** ค่าที่ปุ่ม −/+ บวก/ลบต่อครั้ง */
    step?: number;
    min: number;
    max: number;
    /**
     * จำนวนตำแหน่งทศนิยมที่ปุ่มควรผลิต
     *
     * ต้องมี เพราะบวกทศนิยมแบบ floating point ด้วย step 0.1 จะรั่วเป็น 2.5000000004
     * ซึ่งเป็นค่าที่ช่องนี้ไม่มีสิทธิ์มี
     */
    precision?: number;
    invalid?: boolean;
    /** `aria-label` ของปุ่มสองข้าง — DS ไม่มี i18n แอปส่งคำแปลมาเอง */
    labels?: {
        decrease: string;
        increase: string;
    };
    className?: string;
    inputClassName?: string;
};
/**
 * ช่องกรอกตัวเลขที่มีปุ่ม − / + ประกบสองข้าง
 *
 * ปุ่มมีไว้สำหรับกรณีปกติ — ปรับทีละขั้นจากค่าที่เห็นอยู่ · ส่วนช่องพิมพ์มีไว้สำหรับกรณีที่ปุ่มผิดที่
 * คือค่าที่ห่างจากค่าปัจจุบันมาก (กด 28 ครั้งไม่ใช่การกรอกข้อมูล) · ต้องมีทั้งคู่
 *
 * ใช้ `type="text"` ไม่ใช่ `type="number"` โดยตั้งใจ: number รับ `"1e3"` · ปล่อยให้เบราว์เซอร์
 * ตีความค่าที่พิมพ์ค้างเอง · และกลืน scroll wheel ไปเปลี่ยนค่าโดยที่ผู้ใช้แค่เลื่อนหน้าจอ
 *
 * ⚠️ อย่าสับสนกับ `Stepper` ใน `layout/` — ตัวนั้นคือแถบบอกขั้นตอนของฟอร์มหลายหน้า
 */
declare const NumberStepper: React.ForwardRefExoticComponent<Omit<NumberStepperProps, "ref"> & React.RefAttributes<HTMLInputElement>>;

/** คืนชื่อกลุ่มของรายการหนึ่ง · คืน `null`/`undefined` = ไม่เข้ากลุ่มไหน */
type GroupBy<T> = (item: T) => string | null | undefined;

type OptionRowState = {
    /** ถูกเลือกอยู่ */
    selected: boolean;
    /**
     * ล็อกไว้ — เลือกอยู่แล้วและถอดออกไม่ได้
     *
     * 🔴 ต่างจาก `disabled` ตรงที่ **ถูกเลือกอยู่เสมอ** · `disabled` คือกดไม่ได้
     * เพราะเลือกไม่ได้ ส่วน `locked` คือกดไม่ได้เพราะเอาออกไม่ได้
     */
    locked: boolean;
    /** กดไม่ได้ — ปิดใช้งานมาเอง หรือเลือกครบเพดาน `maxItems` แล้ว */
    disabled: boolean;
};
/**
 * สถานะที่ส่งให้ `renderChip` (เฉพาะโหมดเลือกหลายอัน)
 *
 * แยกจาก `OptionRowState` เพราะ chip ไม่มีสถานะ "ถูกเลือก" (อยู่บน chip แปลว่าเลือกแล้ว)
 * และไม่มี "กดไม่ได้"
 */
type ChipState = {
    /** ถอดออกไม่ได้ — ต้องบอกผู้ใช้ด้วยว่าทำไม ไม่ใช่แค่ซ่อนปุ่ม × */
    locked: boolean;
};

type ComboBoxOption<V extends string = string> = {
    value: V;
    label: string;
    description?: string;
    disabled?: boolean;
    /**
     * เลือกไว้แล้วและถอดออกไม่ได้ — เช่นหน่วยงานประจำที่ระบบผูกมาให้
     *
     * ⚠️ มีผลเฉพาะ `multiple` — โหมดเลือกอันเดียว การเลือกทับคือการ*เปลี่ยนค่า*
     * ไม่ใช่การถอดออก ล็อกไว้จะกลายเป็นช่องที่แก้ไม่ได้เลย ใช้ `disabled` แทน
     */
    locked?: boolean;
};
type ComboBoxOptionGroup<V extends string = string> = {
    heading: string;
    options: ComboBoxOption<V>[];
};
type ComboBoxCommonProps<V extends string = string> = {
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
    options?: ComboBoxOption<V>[];
    /**
     * ตัวเลือกที่**จัดกลุ่มมาแล้ว** — ใช้เมื่อหลังบ้านคืนข้อมูลเป็นกลุ่มอยู่แล้ว
     * (เช่น `getGrouped()` ที่คืนหน่วยงานแยกตามแผนก) · มีค่าแล้วจะชนะ `options`
     */
    groups?: ComboBoxOptionGroup<V>[];
    /**
     * จัดกลุ่มจาก `options` ที่เป็นรายการแบน — คืนชื่อกลุ่มของแต่ละตัว
     * คืน `null` = ไม่เข้ากลุ่มไหน ไปอยู่ก้อนแรกที่ไม่มีหัวข้อ
     *
     * ⚠️ ส่งมาทั้งคู่ `groups` ชนะ (ของที่ระบุมาตรง ๆ ชนะของที่คำนวณเอาเสมอ)
     */
    groupBy?: GroupBy<ComboBoxOption<V>>;
    /** ลำดับกลุ่ม · ไม่ส่ง = ลำดับที่เจอครั้งแรก · กลุ่มที่ไม่อยู่ในลิสต์นี้ต่อท้าย ไม่ถูกทิ้ง */
    groupOrder?: string[];
    /**
     * ค้นหาเอง — ส่งมาแล้ว cmdk จะ**เลิกกรองในเครื่อง** เพราะถือว่าผลที่ส่งกลับมา
     * กรองมาแล้ว (กรองซ้ำ = ตัดของที่ตั้งใจส่งมาทิ้ง)
     *
     * ต้องค้นหลังบ้านจริงจัง + ทรงข้อมูลไม่ใช่ `{value,label}` → ใช้ `EntityAutocomplete`
     */
    onSearch?: (query: string) => void;
    /**
     * ตัวเลือกกำลังโหลด — ช่องยังอยู่ครบ แต่ในลิสต์ที่เปิดอยู่โชว์แถวกำลังโหลดแทนรายการ
     *
     * ⚠️ **ไม่ใช่** `isLoading` — ตัวนั้นแทนทั้งช่องด้วยโครงร่างเหมือน component อื่นทั้งระบบ
     */
    optionsLoading?: boolean;
    /** ยังไม่รู้ว่าช่องนี้คืออะไร — แทนทั้งช่องด้วยโครงร่างที่สูงเท่ากันทุกประการ */
    isLoading?: boolean;
    loadingText?: string;
    /** วาดแถวตัวเลือกเอง — ได้ `{ selected, locked, disabled }` ครบ */
    renderOption?: (option: ComboBoxOption<V>, state: OptionRowState) => React.ReactNode;
    disabled?: boolean;
    /**
     * พิมพ์ค้น **ในตัวช่องเอง** แทนที่จะเปิดแผงแล้วเจอช่องค้นหาอีกช่อง
     *
     * 🔴 **ปิดเป็นค่าเริ่มต้น** — เปิดแล้วโครงของ trigger เปลี่ยนจาก `<button>` เป็น
     * `<input>` ซึ่งเปลี่ยนทั้งการโฟกัส การอ่านของ screen reader และการเลือกข้อความ
     * ⇒ ไม่ควรเปลี่ยนให้ผู้เรียกเดิมโดยไม่มีใครสั่ง
     *
     * ที่มา: จอตั้งขอบเขตของ Mediwork ทั้ง 3 จอ (ตารางเวรพยาบาล · ตารางเวรแพทย์ ·
     * ภาพรวมอัตรากำลัง) ใช้ MUI `Autocomplete` ซึ่งพิมพ์ในช่องได้ — ผู้ใช้กลุ่มเดียวกัน
     * เจอทรงนี้ทุกวัน · ก่อนหน้านี้ **ไม่มี field ตัวไหนใน DS ทำได้เลย** ทั้ง `ComboBox`
     * และ `EntityAutocomplete` วางช่องค้นหาไว้ในแผงเหมือนกัน
     *
     * ⚠️ ใช้ได้เฉพาะโหมดเลือกอันเดียว — โหมดหลายอันเป็นกล่อง chip ที่สูงตามจำนวนแถว
     * การยัด input เข้าไปด้วยเป็นคนละโจทย์ (ยังไม่ทำ)
     *
     * 📌 ยังใช้ cmdk ตัวเดิม แต่ย้าย `Command` ออกมาครอบทั้งช่องและแผง เพื่อให้
     * `Command.Input` ที่กลายเป็นตัวช่องยังคุมลูกศรขึ้น/ลงและ Enter ของลิสต์ได้เหมือนเดิม
     * — ถ้าแยก context กัน คีย์บอร์ดจะใช้ไม่ได้ทั้งชุด
     */
    typeahead?: boolean;
    size?: FieldSize;
    /**
     * จองบรรทัดข้อความใต้ช่องไว้เสมอ กันเลย์เอาต์กระตุกตอนข้อความผิดโผล่/หาย
     *
     * 🔴 มีไว้เพราะ **ถ้าจองไว้ตลอด ช่องนี้จะเอาไปวางเรียงกับอะไรไม่ได้เลย** — กล่องนอกสูงกว่า
     * ตัวช่องอยู่หนึ่งบรรทัด ⇒ `items-end` ยึดขอบล่างของ *กล่องนอก* ทำให้ตัวช่องลอยสูงกว่า
     * หัวข้อ/ปุ่มข้าง ๆ (วัดจริงบนหน้าตั้งค่าสิทธิ์ของ Portal: เหลื่อมกัน 20px)
     * ชื่อและค่าเริ่มต้นเดียวกับ `Input` เพื่อให้สองตัวนี้สลับกันได้โดยไม่ต้องจำข้อยกเว้น
     * @default true
     */
    reserveMessageSpace?: boolean;
    className?: string;
    containerClassName?: string;
};
/** เฉพาะโหมดเลือกหลายอัน — ไม่มีความหมายตอนเลือกอันเดียว */
type ComboBoxMultiOnlyProps<V extends string = string> = {
    /**
     * วาด chip ของตัวที่เลือกไว้เอง
     *
     * ⚠️ ได้ `state.locked` มาด้วย — **ต้องเอาไปแสดงจริง** ไม่งั้นผู้ใช้จะเห็นแค่
     * chip ที่ไม่มีปุ่ม × แล้วนึกว่าจอเสีย
     */
    renderChip?: (option: ComboBoxOption<V>, state: ChipState) => React.ReactNode;
    /** จำนวน chip ที่โชว์ ที่เหลือยุบเป็น "+N" · ค่าเริ่มต้น `3` */
    maxVisibleChips?: number;
    /** เพดานจำนวนที่เลือกได้ */
    maxItems?: number;
};
type ComboBoxSingleProps<V extends string = string> = ComboBoxCommonProps<V> & {
    multiple?: false;
    value?: V | null;
    defaultValue?: V;
    /** ไม่มีค่า = `null` (ตรงกับ `EntityAutocomplete`) */
    onChange?: (value: V | null) => void;
};
type ComboBoxMultiProps<V extends string = string> = ComboBoxCommonProps<V> & ComboBoxMultiOnlyProps<V> & {
    multiple: true;
    value?: V[];
    defaultValue?: V[];
    onChange?: (value: V[]) => void;
};
type ComboBoxProps<V extends string = string> = ComboBoxSingleProps<V> | ComboBoxMultiProps<V>;
declare function ComboBox<V extends string = string>(props: ComboBoxProps<V>): React.JSX.Element;

type EntityAutocompleteCommonProps<T> = {
    id?: string;
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    hideLabel?: boolean;
    /**
     * จองที่หนึ่งบรรทัดใต้ช่องไว้เสมอ กันเลย์เอาต์กระตุกตอนข้อความผิดโผล่/หาย
     *
     * ค่าตั้งต้นของ shell คือ `true` — ส่ง `false` เมื่อช่องนี้อยู่ในแถวที่ไม่มี validation
     * หรือต้องเรียงความสูงให้ตรงกับช่องอื่นที่ปิดที่ว่างนั้นไว้
     *
     * 🔴 เดิมไม่รับ prop นี้ ทั้งที่ `ComboBox` ซึ่งเป็นพี่น้องที่ใกล้ที่สุดรับได้ — สองตัวนี้
     * ถูกสลับกันใช้บ่อย การที่ prop ไม่เท่ากันทำให้สลับแล้วความสูงเปลี่ยนโดยไม่มีใครคาด
     */
    reserveMessageSpace?: boolean;
    alwaysFloatLabel?: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    /** Rendered in the popover instead of the list when the last search failed. */
    searchError?: React.ReactNode;
    disabled?: boolean;
    size?: FieldSize;
    className?: string;
    containerClassName?: string;
    /** Result set for the current query — this component never fetches on its own, only asks via `onSearch`. */
    options: T[];
    /**
     * Called with the debounced query text as the user types, and once (with `""`)
     * the first time the popover opens — so callers can show an initial/recent
     * result set. Fetch and update `options` (+ `optionsLoading`/`searchError`) from here.
     */
    onSearch: (query: string) => void;
    /** Debounce delay (ms) between the last keystroke and `onSearch` firing. Default `300`. */
    debounceMs?: number;
    /**
     * ตัวเลือกกำลังโหลด — ช่องยังอยู่ครบ แต่ในลิสต์ที่เปิดอยู่โชว์แถวกำลังโหลดแทนรายการ
     *
     * ⚠️ **ไม่ใช่** `isLoading` — ตัวนั้นแทนทั้งช่องด้วยโครงร่างเหมือน component อื่นทั้งระบบ
     * (ชื่อเดิมของ prop นี้คือ `isLoading` ซึ่งชนความหมายกับ `Select` ที่คนสลับกันใช้ตลอด)
     */
    optionsLoading?: boolean;
    /** ยังไม่รู้ว่าช่องนี้คืออะไร — แทนทั้งช่องด้วยโครงร่างที่สูงเท่ากันทุกประการ */
    isLoading?: boolean;
    loadingText?: string;
    /** Stable identity for an item — used to compare selection, dedupe, and as the list key. */
    getOptionValue: (item: T) => string | number;
    getOptionLabel: (item: T) => string;
    getOptionDescription?: (item: T) => React.ReactNode;
    /** Custom row renderer for an option in the popover list. */
    renderOption?: (item: T, state: OptionRowState) => React.ReactNode;
    /**
     * วาด chip ของตัวที่เลือกไว้เอง (เฉพาะโหมดเลือกหลายอัน)
     *
     * ⚠️ ได้ `state.locked` มาด้วย — **ต้องเอาไปแสดงจริง** ไม่งั้นผู้ใช้จะเห็นแค่
     * chip ที่ไม่มีปุ่ม × แล้วนึกว่าจอเสีย (ตัวเริ่มต้นใช้สีต่าง + ไอคอนกุญแจ)
     */
    renderChip?: (item: T, state: ChipState) => React.ReactNode;
    /**
     * รายการที่**เลือกไว้แล้วและถอดออกไม่ได้** — เช่นหน่วยงานประจำที่ระบบผูกมาให้
     *
     * ปิดทางถอดออกครบ 3 ทาง: กดที่ chip · กดซ้ำในลิสต์ · ปุ่มล้างทั้งหมด
     * และแสดงให้เห็นว่าล็อกอยู่ (สี chip ต่างกัน + ไอคอนกุญแจ) ไม่ใช่แค่ซ่อนปุ่ม ×
     *
     * ```tsx
     * isOptionLocked={(u) => u.isHome}
     * ```
     *
     * ⚠️ **ไม่ได้ทำให้ถูกเลือกให้อัตโนมัติ** — ต้องใส่ใน `defaultValue`/`value` เองด้วย
     * (ตัวนี้ตอบว่า "ถอดออกได้ไหม" ไม่ใช่ "ต้องมีไหม")
     *
     * ⚠️ ใช้ได้เฉพาะโหมดเลือกหลายอัน — โหมดเลือกอันเดียวการเลือกทับคือการเปลี่ยนค่า
     * ไม่ใช่การถอดออก ล็อกไว้จะกลายเป็นช่องที่แก้ไม่ได้เลย ให้ใช้ `disabled` แทน
     */
    isOptionLocked?: (item: T) => boolean;
    /**
     * จัดกลุ่มผลค้นหาใต้หัวข้อ — คืนชื่อกลุ่มของแต่ละรายการ
     * คืน `null` = ไม่เข้ากลุ่มไหน ไปอยู่ก้อนแรกที่ไม่มีหัวข้อ
     *
     * ```tsx
     * groupBy={(u) => u.departmentName}
     * ```
     *
     * ⚠️ จัดกลุ่มจาก **ผลที่หลังบ้านคืนมาหน้านี้เท่านั้น** ไม่ใช่ทั้งฐานข้อมูล —
     * ค้นแล้วได้ 20 แถวจาก 3 แผนก หัวข้อจะมี 3 อัน ไม่ใช่ทุกแผนกที่มีอยู่จริง
     * ถ้าต้องการหัวข้อครบทุกกลุ่มเสมอ ต้องให้หลังบ้านคืนมาครบเอง
     */
    groupBy?: GroupBy<T>;
    /** ลำดับกลุ่ม · ไม่ส่ง = ลำดับที่เจอครั้งแรก · กลุ่มที่ไม่อยู่ในลิสต์นี้ต่อท้าย ไม่ถูกทิ้ง */
    groupOrder?: string[];
    /** Maximum visible chips in multi mode — extras collapse into "+N". Default `3`. */
    maxVisibleChips?: number;
    /** Cap selection in multi mode. */
    maxItems?: number;
};
type EntityAutocompleteSingleProps<T> = EntityAutocompleteCommonProps<T> & {
    multiple?: false;
    value?: T | null;
    defaultValue?: T;
    onChange?: (value: T | null) => void;
};
type EntityAutocompleteMultiProps<T> = EntityAutocompleteCommonProps<T> & {
    multiple: true;
    value?: T[];
    defaultValue?: T[];
    onChange?: (value: T[]) => void;
};
type EntityAutocompleteProps<T> = EntityAutocompleteSingleProps<T> | EntityAutocompleteMultiProps<T>;
/**
 * Generic remote-search combobox for domain entities (users, sub-units, ...)
 * where the option shape isn't `{value,label}` — the component asks (debounced)
 * via `onSearch`, the caller owns the fetch and hands back `options`.
 * Single or multi selection from the same component (`multiple` prop).
 *
 * Shares its Popover + cmdk + FloatingFieldShell internals/style with
 * `ComboBox` (single) / `MultiAutocomplete` (multi) — this is the generic-`T`
 * counterpart for remote entity search specifically.
 */
declare function EntityAutocomplete<T>(props: EntityAutocompleteProps<T>): React.JSX.Element;

declare const Table: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>, "ref"> & React.RefAttributes<HTMLTableElement>>;
declare const TableHeader: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>, "ref"> & React.RefAttributes<HTMLTableSectionElement>>;
declare const TableBody: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>, "ref"> & React.RefAttributes<HTMLTableSectionElement>>;
declare const TableFooter: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>, "ref"> & React.RefAttributes<HTMLTableSectionElement>>;
declare const TableRow: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>, "ref"> & React.RefAttributes<HTMLTableRowElement>>;
declare const TableHead: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>, "ref"> & React.RefAttributes<HTMLTableCellElement>>;
declare const TableCell: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>, "ref"> & React.RefAttributes<HTMLTableCellElement>>;
declare const TableCaption: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & React.RefAttributes<HTMLTableCaptionElement>>;

/** สิ่งที่ผู้เรียกได้รับตอนวาดป้ายกลุ่มเอง */
type DataTableGroupLabelContext<TData> = {
    /** ค่าที่ `groupBy` คืนมา — คีย์คงที่ ไม่ใช่ข้อความบนจอ */
    key: string;
    /** แถวในกลุ่มนี้ (เรียงแล้ว ตามที่ตารางเรียง) */
    rows: TData[];
    /** = `rows.length` — ส่งมาให้เพราะ **8 ใน 8 ที่ของจริงแสดงจำนวนในป้าย** */
    count: number;
    /** ลำดับกลุ่ม เริ่มที่ 0 */
    index: number;
};
type DataTableGroupingProps<TData> = {
    /**
     * แบ่งแถวเป็นกลุ่ม — คืนคีย์กลุ่มของแถวนั้น · คืน `null` = ไม่เข้ากลุ่มไหน
     *
     * ใช้ตัวเดียวกับที่ `ComboBox`/`EntityAutocomplete` ใช้จัดกลุ่มตัวเลือก
     * (`form/group-options.ts`) ⇒ "จัดกลุ่ม" แปลว่าเรื่องเดียวกันทั้งระบบ
     *
     * ```tsx
     * groupBy={(p) => (p.isPartTime ? "partTime" : "fullTime")}
     * groupOrder={["fullTime", "partTime"]}
     * ```
     *
     * 🔴 **คืนคีย์ ไม่ใช่ข้อความที่จะแสดง** — ข้อความมาจาก `groupLabel` เพราะต้องแปลภาษา
     * ถ้า `groupBy` คืนคำแปลตรง ๆ กลุ่มจะแตกเป็นคนละกลุ่มทันทีที่สลับภาษา
     */
    groupBy?: GroupBy<TData>;
    /**
     * ลำดับกลุ่มตายตัว — ไม่ส่ง = เรียงตามลำดับที่เจอครั้งแรกในข้อมูล
     *
     * กลุ่มที่ไม่อยู่ในลิสต์**ไม่ถูกทิ้ง** แต่ต่อท้ายให้ (ทิ้ง = แถวหายจากจอเงียบ ๆ)
     */
    groupOrder?: readonly string[];
    /**
     * ป้ายหัวกลุ่ม — ไม่ส่ง = ใช้ `คีย์ (จำนวน)`
     *
     * รับ `count` มาให้เลยเพราะของจริงทุกที่แสดงจำนวน แต่**รูปแบบไม่ตรงกัน**
     * ("9 ส.ค. (3 คำขอ)" · "พนักงานประจำ (5)") ⇒ ปล่อยให้ผู้เรียกประกอบเอง
     * ดีกว่าเติม `(n)` ให้อัตโนมัติแล้วชนกับ `t(key, {count})` ที่นับซ้ำ
     *
     * คืน element ได้ ⇒ จุดสี/ไอคอนหน้าป้ายเป็นของผู้เรียก — DS ไม่รับสีดิบเข้ามา
     */
    groupLabel?: (ctx: DataTableGroupLabelContext<TData>) => React.ReactNode;
    /** พับ/กางกลุ่มได้ — มีที่มาจากตารางเวรซึ่งทำเองอยู่แล้ว */
    collapsibleGroups?: boolean;
    /** กลุ่มที่พับไว้ตั้งแต่แรก (uncontrolled) */
    defaultCollapsedGroups?: readonly string[];
    /** กลุ่มที่พับอยู่ (controlled) — ส่งมาแล้วต้องส่ง `onCollapsedGroupsChange` ด้วย */
    collapsedGroups?: readonly string[];
    onCollapsedGroupsChange?: (keys: string[]) => void;
};
type ResolvedGroup<TData> = {
    /** `null` = ก้อนที่ `groupBy` ไม่จัดกลุ่มให้ — ไม่มีแถวหัว อยู่บนสุด */
    key: string | null;
    rows: Row<TData>[];
    collapsed: boolean;
};
/**
 * แบ่ง row model ที่**เรียงแล้ว**ออกเป็นกลุ่ม
 *
 * 🔴 รับ `Row<TData>` ไม่ใช่ข้อมูลดิบ — เพราะต้องจัดกลุ่ม**หลัง**การเรียงและการแบ่งหน้า
 * ของ TanStack ไม่งั้นกลุ่มจะไม่ตรงกับสิ่งที่ตารางกำลังแสดง และ `row.getIsSelected()`
 * กับ `row.id` ที่ทั้งการติ๊กเลือกใช้อยู่จะหลุดหายไปด้วย
 */
declare function resolveGroups<TData>(rows: Row<TData>[], groupBy: GroupBy<TData>, groupOrder: readonly string[] | undefined, collapsedKeys: readonly string[]): ResolvedGroup<TData>[];
/**
 * แถวหัวกลุ่ม — DS เป็นเจ้าของ `<tr>` และ `colSpan` เอง ผู้เรียกกำหนดได้แค่เนื้อป้าย
 *
 * ตั้งใจไม่เปิด render prop ที่คืน `<tr>` เอง เพราะนั่นคือคืน `colSpan` กลับไปให้
 * ผู้เรียกเขียนเลขเอง = บั๊กเดิมที่ของจริงเป็นอยู่ 5 หน้า
 */
declare function DataTableGroupRow({ colSpan, label, collapsible, collapsed, onToggle, toggleAriaLabel, }: {
    colSpan: number;
    label: React.ReactNode;
    collapsible?: boolean;
    collapsed?: boolean;
    onToggle?: () => void;
    toggleAriaLabel?: string;
}): React.JSX.Element;

type FreezeColumns = {
    /**
     * จำนวนคอลัมน์**ข้อมูล**ที่แช่ไว้ทางซ้าย (นับจาก `columns` ที่ส่งเข้ามา)
     *
     * ⚠️ ช่องติ๊กเลือกแช่ตามให้อัตโนมัติเมื่อ `left ≥ 1` — ไม่ต้องนับรวมเอง
     * (ปล่อยให้ช่องติ๊กเลื่อนหายไปขณะที่ชื่อยังอยู่ = ติ๊กแถวที่มองไม่เห็นว่าแถวไหน)
     */
    left?: number;
    /** จำนวนคอลัมน์ที่แช่ไว้ทางขวา — ปกติคือคอลัมน์ปฏิบัติการ */
    right?: number;
};

/**
 * ช่องเสริมของคอลัมน์ที่ `DataTable` อ่าน
 *
 * TanStack เปิด `ColumnMeta` ไว้ให้ augment ได้ — ประกาศที่นี่ที่เดียว ผู้เรียกทุกแอป
 * จึงได้ทั้ง autocomplete และการตรวจชนิด โดยไม่ต้องประกาศซ้ำในแต่ละรีโป
 */
declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        /** class เพิ่มที่ `<th>` — เช่น `text-right` ให้หัวคอลัมน์ปฏิบัติการตรงกับปุ่มที่ชิดขวา */
        headerClassName?: string;
        /** class เพิ่มที่ `<td>` — เช่น `max-w-50 truncate` สำหรับคอลัมน์ที่ข้อความยาวได้ */
        cellClassName?: string;
        /**
         * ความกว้าง**เป๊ะ** (px) — คนละเรื่องกับ `columnDef.size` ที่ตัวนี้ตีเป็น *ขั้นต่ำ*
         *
         * คอลัมน์ปุ่มกับป้ายสถานะต้องการ "อย่าให้กว้างกว่านี้" ไม่ใช่ "อย่างน้อยเท่านี้"
         * ถ้าใช้ `size` มันจะกินพื้นที่ที่เหลือแล้วบีบคอลัมน์ข้อมูลให้แคบลง
         */
        width?: number;
    }
}
type DataTablePagination = {
    /** 0-based page index. */
    pageIndex: number;
    /** Rows per page. */
    pageSize: number;
    /** Total rows across all pages (server-side). */
    rowCount: number;
    /**
     * จำนวนหน้าที่หลังบ้านบอกมา — ไม่ส่ง = คิดจาก `rowCount / pageSize` เหมือนเดิม
     *
     * ต้องมีเพราะ API บางเส้นนับหน้าไม่ตรงกับสูตรนั้น (เช่นตัดแถวที่ผู้ใช้ไม่มีสิทธิ์เห็น
     * ออกหลังนับ) ⇒ ปุ่ม "หน้าถัดไป" จะเปิด/ปิดผิดจากที่หลังบ้านตั้งใจ
     */
    pageCount?: number;
    onPageChange: (pageIndex: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
};
/**
 * Overrides for every piece of built-in copy `DataTable` renders on its own
 * (all English by default — this package has no i18n lib bound in, so the
 * consuming app supplies translated strings here). Every field is optional;
 * omitted fields keep the English default.
 */
type DataTableLabels = {
    /** aria-label on the header "select all rows" checkbox. Default `"Select all"`. */
    selectAllAriaLabel?: string;
    /** aria-label on each row's own checkbox. Default `"Select row"`. */
    selectRowAriaLabel?: string;
    /**
     * Default empty state (no rows, no `error`). `title` is `string` (not
     * `ReactNode`) because it flows into `EmptyState`, which — like any native
     * `<div>` — only accepts a plain string for its `title` attribute.
     */
    empty?: {
        title?: string;
        description?: React.ReactNode;
    };
    /** Default error state, shown when `error` is set and `errorSlot` isn't. Same `title: string` constraint as `empty`. */
    error?: {
        title?: string;
        description?: React.ReactNode;
    };
    /** Retry button label inside the default error state. Default `"Retry"`. */
    retry?: React.ReactNode;
    /**
     * ชื่อปุ่ม "หน้าก่อนหน้า" · ค่าเริ่มต้น `"Previous page"`
     *
     * 🔴 เป็น `string` ไม่ใช่ `ReactNode` เพราะปุ่มเป็น**ไอคอนล้วน** ⇒ ข้อความนี้ไป
     * เป็น `aria-label` ซึ่งรับได้เฉพาะ string · ส่ง element มาจะได้ `[object Object]`
     */
    prev?: string;
    /** ชื่อปุ่ม "หน้าถัดไป" · ค่าเริ่มต้น `"Next page"` · เป็น `string` ด้วยเหตุผลเดียวกับ `prev` */
    next?: string;
    /** Label next to the page-size select. Default `"Rows per page"`. */
    rowsPerPage?: React.ReactNode;
    /** ชื่อปุ่มพับ/กางกลุ่ม (ไอคอนล้วน) · ค่าเริ่มต้น `"Toggle group"` */
    toggleGroup?: string;
    /** Selected-row-count label. Default `` (n) => `${n} selected` ``. */
    selected?: (count: number) => React.ReactNode;
    /** Visible-range label, e.g. `"1–10 of 53"`. Default is `"0 of 0"` when `total` is 0. */
    of?: (start: number, end: number, total: number) => React.ReactNode;
};
type DataTableProps<TData> = {
    columns: ColumnDef<TData, any>[];
    data: TData[];
    isLoading?: boolean;
    /** Server-side pagination. Omit to render all rows in one view. */
    pagination?: DataTablePagination;
    /** Controlled sorting state. When omitted, table is uncontrolled. */
    sorting?: SortingState;
    /**
     * เรียงคอลัมน์เปลี่ยน — **ได้ `SortingState` มาตรง ๆ พร้อมใช้**
     *
     * 🔴 ไม่ใช่ `OnChangeFn` ของ TanStack ที่ส่ง **ฟังก์ชัน** `(old) => next` กลับมา
     * (พิสูจน์แล้ว: กดหัวตาราง 3 ครั้ง ได้ `typeof === "function"` ทั้ง 3 ครั้ง)
     * ⇒ ทางที่ TanStack ให้มาจะพังทันทีที่เอาไปต่อกับอะไรที่ไม่ใช่ `useState`
     * — queryKey ของ react-query · URL state (`nuqs`) · zustand — เพราะได้ฟังก์ชัน
     * ไปใส่แทนค่า แล้ว key ไม่เปลี่ยน/URL เพี้ยนโดยไม่มี error
     *
     * DS คลี่ให้แล้วที่นี่ที่เดียว ⇒ เหมือน `onPageChange` และ `onCollapsedGroupsChange`
     * ในตัวเดียวกัน · ส่ง `setSorting` ของ `useState` ตรง ๆ ก็ยังใช้ได้เหมือนเดิม
     *
     * ```tsx
     * const [sorting, setSorting] = useState<SortingState>([]);
     * const q = useQuery({ queryKey: ["staff", page, sorting], queryFn: ... });
     * <DataTable manualSorting sorting={sorting} onSortingChange={setSorting} … />
     * ```
     */
    onSortingChange?: (sorting: SortingState) => void;
    /** Manual sorting (server-side). When `true`, the table will not sort rows itself. */
    manualSorting?: boolean;
    /** Enable a checkbox selection column. */
    enableSelection?: boolean;
    /**
     * แถวไหนติ๊กได้บ้าง — ไม่ส่ง = ติ๊กได้ทุกแถว
     *
     * 🔴 **select-all จะติ๊กเฉพาะแถวที่ผ่านเงื่อนไขนี้** และตัวนับ "เลือกแล้ว N จาก M"
     * ใช้ M = จำนวนแถวที่ติ๊กได้ ไม่ใช่จำนวนแถวทั้งหมด
     *
     * ของจริงบน Mediwork ต้องการแบบนี้ทุกหน้าคำขอ — ติ๊กได้เฉพาะใบที่ยัง "รออนุมัติ"
     * ใบที่อนุมัติ/ปฏิเสธไปแล้วต้องเห็นในตารางแต่ทำอะไรไม่ได้
     * (วันนี้แต่ละฟีเจอร์ส่ง `pendingCount` เข้าไปเอง ซ้ำกัน 6 ที่)
     *
     * ```tsx
     * isRowSelectable={(r) => r.status === "PENDING"}
     * ```
     */
    isRowSelectable?: (row: TData) => boolean;
    /**
     * ความกว้างขั้นต่ำของตาราง (px) — แคบกว่านี้แล้วเลื่อนแนวนอนแทนที่จะบีบคอลัมน์
     *
     * ไม่ส่ง = ตารางกว้างเท่ากล่องที่อยู่ ไม่มีการเลื่อน
     */
    minTableWidth?: number;
    /**
     * แช่คอลัมน์ไว้กับที่เวลาเลื่อนแนวนอน — ใช้คู่กับ `minTableWidth`
     *
     * ```tsx
     * minTableWidth={1200}
     * freezeColumns={{ left: 1, right: 1 }}   // ชื่อค้างซ้าย · ปุ่มค้างขวา
     * ```
     *
     * นับเฉพาะคอลัมน์**ข้อมูล** — ช่องติ๊กเลือกแช่ตามให้เองเมื่อ `left ≥ 1`
     *
     * 🔴 **ไม่มีผลถ้าไม่มีอะไรให้เลื่อน** — ตารางที่พอดีกล่องอยู่แล้วจะดูเหมือนไม่ทำงาน
     * ต้องตั้ง `minTableWidth` หรือมีคอลัมน์กว้างพอจนล้นก่อน
     *
     * ⚠️ ของจริงวันนี้แช่ซ้ายอย่างเดียว 1 คอลัมน์ (ตารางเวร 4 ไฟล์) —
     * **ฝั่งขวายังไม่มีที่ไหนทำ** ตัวนี้จึงเป็นของใหม่ ไม่ได้ลอกของเดิมมา
     */
    freezeColumns?: FreezeColumns;
    rowSelection?: RowSelectionState;
    /** แถวที่ติ๊กเปลี่ยน — **ได้ `RowSelectionState` มาตรง ๆ** เหตุผลเดียวกับ `onSortingChange` */
    onRowSelectionChange?: (rowSelection: RowSelectionState) => void;
    /** Stable id for selection — required when data resets. Default uses array index. */
    getRowId?: (row: TData, index: number) => string;
    /** Click handler for a row. Selection checkbox stops propagation. */
    onRowClick?: (row: TData, index: number) => void;
    /** Sticky header inside scrolling container. */
    stickyHeader?: boolean;
    /**
     * จำนวนแถวโครงร่างตอน `isLoading`
     *
     * ไม่ส่ง = `min(pageSize, 10)` — ต้องมีเพดานเพราะ `pageSize` เป็น 50/100 ได้
     * แล้วจะวาดแถวปลอมเป็นร้อยแถวซึ่งไม่ได้ช่วยให้ใครอ่านอะไรออก · ตารางที่ไม่มี
     * pagination เลย (roster ที่แบ่งกลุ่มเอง) ก็ต้องสั่งเองได้เพราะค่าเริ่มต้น 5 ไม่ตรง
     */
    skeletonRowCount?: number;
    /** class ของกล่องที่เลื่อนได้ — ทางเดียวที่จะปลด `max-h` ตั้งต้นออกได้ */
    containerClassName?: string;
    /**
     * class ของ **การ์ดที่ครอบตาราง** (เส้นขอบ · มุมโค้ง · เงา · พื้น)
     *
     * 🔴 ต่างจาก `containerClassName` ซึ่งลงที่กล่อง scroll ข้างใน และต่างจาก `className`
     * ซึ่งลงที่กล่องนอกสุดที่ครอบทั้งตารางและแถบแบ่งหน้า — **ก่อนมี prop นี้ไม่มีทางแตะ
     * การ์ดใบนี้ได้เลย** เพราะ class ของมันเป็นสตริงตายตัว
     *
     * ทรงตั้งต้นยึดจาก Portal ที่ตารางเป็นการ์ดเดี่ยว ๆ บนพื้นหน้า · แต่จอที่วางตารางไว้
     * **ในการ์ดใบใหญ่ที่มีหัวข้อและแท็บอยู่ด้วย** จะได้กรอบซ้อนกันสองชั้น
     * ⇒ ส่ง `"border-0 shadow-none rounded-none"` เพื่อให้ตารางกลืนไปกับการ์ดที่ครอบอยู่
     */
    cardClassName?: string;
    /** Custom empty state. Rendered when there's no error and 0 rows. */
    empty?: React.ReactNode;
    /**
     * ไอคอนของสถานะว่าง — ไม่ส่ง = กล่องจดหมายเปล่า
     *
     * ควรส่งให้ตรงกับสิ่งที่ตารางนี้แสดง — "ยังไม่มีคำขอ" กับ "ยังไม่มีบุคลากร"
     * เป็นความว่างคนละอย่าง และรูปคือทางที่บอกได้เร็วที่สุดว่าอันไหน
     */
    emptyIcon?: React.ReactNode;
    /** ไอคอนของสถานะผิดพลาด — ไม่ส่ง = สามเหลี่ยมเตือน */
    errorIcon?: React.ReactNode;
    /**
     * วาดสถานะว่างเอง — ได้รู้ด้วยว่า **ว่างเพราะกรองแล้วไม่เจอ หรือว่างเพราะยังไม่มีข้อมูลเลย**
     *
     * 🔴 สองอย่างนี้ต้องพูดคนละแบบ: "ไม่พบผลลัพธ์ ลองแก้คำค้น" กับ "ยังไม่มีรายการ กดเพิ่ม"
     * — บอกให้ผู้ใช้ไปสร้างใหม่ทั้งที่เขาแค่กรองผิด คือทางที่ทำให้เขาสร้างข้อมูลซ้ำ
     *
     * ```tsx
     * renderEmpty={({ isFiltered }) => isFiltered ? <NoMatch/> : <FirstRun/>}
     * ```
     *
     * ชนะ `empty` เมื่อส่งมาทั้งคู่
     */
    renderEmpty?: (ctx: {
        isFiltered: boolean;
    }) => React.ReactNode;
    /**
     * ตารางนี้กำลังถูกกรอง/ค้นอยู่หรือเปล่า — ตัวตารางไม่รู้เอง เพราะการกรองเกิดนอกตัวมัน
     * (ช่องค้นหาอยู่เหนือตาราง · ตัวกรองอยู่คนละที่) ⇒ ผู้เรียกต้องบอก
     */
    isFiltered?: boolean;
    className?: string;
    /**
     * Truthy → renders the error state instead of rows/empty state. Pass the
     * actual caught error (for future use / telemetry) or just `true`.
     * `isLoading` still takes priority, so a background refetch doesn't flash
     * a stale error.
     */
    error?: unknown;
    /** Override the default error block entirely. Caller closes over `error` / `onRetry` itself. */
    errorSlot?: React.ReactNode;
    /**
     * วาดสถานะผิดพลาดเอง — **ได้ตัว error กับปุ่มลองใหม่ส่งมาให้** ไม่ต้อง closure เอง
     *
     * ต่างจาก `errorSlot` ตรงที่ไม่ต้องหอบ `error`/`onRetry` ไปผูกไว้ข้างนอก
     * ⇒ แยกเป็น component ที่ใช้ซ้ำได้จริง
     *
     * ```tsx
     * renderError={({ error, retry }) => <ApiError err={error} onRetry={retry} />}
     * ```
     *
     * ชนะ `errorSlot` เมื่อส่งมาทั้งคู่
     */
    renderError?: (ctx: {
        error: unknown;
        retry: (() => void) | undefined;
    }) => React.ReactNode;
    /** Retry action wired into the default error state's button. No-op if `errorSlot` is set. */
    onRetry?: () => void;
    /** Override any built-in copy — see `DataTableLabels`. All English by default. */
    labels?: DataTableLabels;
} & DataTableGroupingProps<TData>;
declare function DataTable<TData>({ columns, data, isLoading, pagination, sorting: sortingProp, onSortingChange, manualSorting, enableSelection, isRowSelectable, minTableWidth, freezeColumns, rowSelection: rowSelectionProp, onRowSelectionChange, getRowId, onRowClick, stickyHeader, skeletonRowCount, containerClassName, cardClassName, empty, emptyIcon, errorIcon, renderEmpty, isFiltered, renderError, className, error, errorSlot, onRetry, labels, groupBy, groupOrder, groupLabel, collapsibleGroups, defaultCollapsedGroups, collapsedGroups, onCollapsedGroupsChange, }: DataTableProps<TData>): React.JSX.Element;

declare const cardVariants: (props?: ({
    variant?: "flat" | "elevated" | "outlined" | null | undefined;
    padding?: "none" | "sm" | "md" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type CardProps = React.ComponentProps<"div"> & VariantProps<typeof cardVariants>;
declare const Card: React.ForwardRefExoticComponent<Omit<CardProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const CardHeader: ({ className, ...props }: React.ComponentProps<"div">) => React.JSX.Element;
declare const CardTitle: ({ className, ...props }: React.ComponentProps<"h3">) => React.JSX.Element;
declare const CardDescription: ({ className, ...props }: React.ComponentProps<"p">) => React.JSX.Element;
declare const CardContent: ({ className, ...props }: React.ComponentProps<"div">) => React.JSX.Element;
declare const CardFooter: ({ className, ...props }: React.ComponentProps<"div">) => React.JSX.Element;

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
    /** Component used to render `items[].href` links — e.g. next/link's `Link`.
     *  Must accept `href`, `className`, and `children`. Defaults to a plain `<a>`,
     *  which keeps this package framework-agnostic (no router import inside DS). */
    linkComponent?: React.ElementType;
};
declare function Breadcrumb({ items, separator, maxItems, linkComponent: LinkComponent, className, ...props }: BreadcrumbProps): React.JSX.Element;
/** Low-level escape hatch — use `<BreadcrumbRoot>` + `<BreadcrumbLink>` for custom rendering. */
declare const BreadcrumbRoot: ({ className, ...props }: React.ComponentProps<"nav">) => React.JSX.Element;
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
    /**
     * เส้นเชื่อมระหว่างขั้น (แนวนอนเท่านั้น)
     *
     * `fill` — ยืดเต็มความกว้างที่มี ขั้นตอนกระจายเต็มแถว (ค่าเริ่มต้น)
     * `fixed` — เส้นสั้นคงที่ แล้วจัดทั้งแถบไว้กลาง · ใช้เมื่อ stepper อยู่ในโมดัลหรือกล่องแคบ
     *           ที่การยืดเต็มทำให้ป้ายลอยห่างกันจนอ่านเป็นกลุ่มเดียวไม่ได้
     */
    connector?: "fill" | "fixed";
    className?: string;
    /** Allow click on completed steps to navigate. */
    onStepClick?: (index: number) => void;
};
declare function Stepper({ steps, current, orientation, connector, className, onStepClick, }: StepperProps): React.JSX.Element;

type SkeletonProps = React.ComponentProps<"div"> & {
    /** Shape preset. `text` defaults to a 1em-height bar. `circle` is square + rounded-full. */
    shape?: "rect" | "text" | "circle";
};
declare const Skeleton: React.ForwardRefExoticComponent<Omit<SkeletonProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
type SkeletonBoxProps = Omit<SkeletonProps, "shape"> & {
    /** class รูปทรงของ component ตัวจริง — ปกติคือผลลัพธ์ของ cva ตัวเดียวกับที่มันใช้ */
    shape?: string;
    /** ข้อความให้โปรแกรมอ่านหน้าจอ — ตั้งค่าเริ่มต้นไว้แล้ว ไม่ต้องส่งทุกที่ */
    label?: string;
};
declare const SkeletonBox: React.ForwardRefExoticComponent<Omit<SkeletonBoxProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

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
}): React.JSX.Element;

/** โทนสีพื้นของป้ายรูป · `brand` = ตามธีมของแอป */
type StateTone = "brand" | "info" | "success" | "warning" | "danger" | "neutral" | "none";
/**
 * ป้ายรูปมีทรงเดียว — **กลม**
 *
 * MediHR มีสี่เหลี่ยมมนอยู่ที่หน้ารายละเอียด แต่ผู้ใช้เคาะให้เหลือทรงเดียว (2026-08-09)
 * — สองทรงในระบบเดียวไม่ได้สื่ออะไรต่างกัน มีแต่ทำให้แต่ละจอเลือกไม่เหมือนกัน
 *
 * `none` = ไม่มีป้าย (ค่าตั้งต้นของ `image` · ภาพประกอบมักมีพื้นในตัวอยู่แล้ว)
 */
type StateMediaShape = "circle" | "none";
type StateSize = "sm" | "md";
type StateBlockProps = Omit<React.ComponentProps<"div">, "title"> & {
    /**
     * ไอคอน — วางในป้ายสีพื้นตามธีมแอป
     *
     * ⚠️ **ขนาดถูกบังคับโดย component** (`sm` 24 · `md` 32) ผู้เรียกกำหนดเองไม่ได้
     * เพราะของจริงเคยมีจอที่พกไอคอนเทา 44px ของตัวเองมาแล้วรับดีไซน์ครึ่งเดียว
     * — ถ้าต้องการขนาดอื่นจริง ๆ ให้ใช้ `image` แทน ซึ่งไม่ถูกบังคับ
     */
    icon?: React.ReactNode;
    /**
     * รูปหรือภาพประกอบ — **ชนะ `icon` เมื่อส่งมาทั้งคู่**
     *
     * รับเป็น element ไม่ใช่ `src` เพราะแต่ละแอปโหลดรูปคนละทาง
     * (`next/image` ของ Next ต้อง import จากฝั่งแอป · DS ดึงเข้ามาไม่ได้)
     *
     * ```tsx
     * image={<Image src={emptyBox} alt="" width={160} height={160} />}
     * ```
     *
     * ตั้งต้น**ไม่มีป้ายสีพื้น** (`mediaShape="none"`) เพราะภาพประกอบมักมีพื้นในตัวอยู่แล้ว
     * — อยากได้พื้นด้วยให้ส่ง `mediaShape` มาเอง
     */
    image?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    /** ปุ่ม/ลิงก์ทางออก — ปกติเป็น `<Button>` หรือคู่ปุ่ม */
    action?: React.ReactNode;
    tone?: StateTone;
    mediaShape?: StateMediaShape;
    size?: StateSize;
    /** class ของป้ายรูป — ทางออกเมื่อต้องการขนาด/สีนอกเหนือจากที่กำหนด */
    mediaClassName?: string;
    /** ความสูงขั้นต่ำ — กันหน้าที่ว่างแล้วสั้นลงจนทุกอย่างข้างล่างกระโดด */
    minHeight?: number | string;
};
type EmptyStateProps = StateBlockProps & {
    /** @deprecated ใช้ `tone` — ชื่อเดิมสื่อว่าใช้ได้กับไอคอนอย่างเดียว ทั้งที่คุมพื้นของรูปด้วย */
    iconTone?: StateTone;
};
/**
 * ไม่มีข้อมูลให้แสดง
 *
 * ⚠️ **"ว่างเพราะกรองไม่เจอ" กับ "ว่างเพราะยังไม่มีข้อมูลเลย" ต้องพูดคนละแบบ** —
 * บอกให้ผู้ใช้ไปสร้างใหม่ทั้งที่เขาแค่กรองผิด คือทางที่ทำให้เขาสร้างข้อมูลซ้ำ
 * (ใน `DataTable` ใช้ `renderEmpty` ที่ได้ `isFiltered` มาแยกสองกรณีนี้)
 */
declare function EmptyState({ iconTone, tone, ...props }: EmptyStateProps): React.JSX.Element;
type ErrorStateProps = Omit<StateBlockProps, "action"> & {
    /** ปุ่มลองใหม่ — ไม่ส่ง = ไม่มีปุ่ม */
    onRetry?: () => void;
    /** ข้อความบนปุ่มลองใหม่ · ค่าเริ่มต้น `"Retry"` — แอปส่งคำแปลมาเอง */
    retryLabel?: React.ReactNode;
    /** ปุ่ม/ทางออกอื่นนอกเหนือจากลองใหม่ */
    action?: React.ReactNode;
    /** ตัว error จริง — ไม่ถูกแสดง มีไว้ให้ผู้เรียกใช้ต่อ (log/telemetry) */
    error?: unknown;
};
/**
 * โหลดไม่สำเร็จ
 *
 * ต่างจาก `EmptyState` แค่ค่าตั้งต้น (โทนแดง · ไอคอนเตือน · ปุ่มลองใหม่) —
 * ใช้โครงเดียวกันโดยตั้งใจ เพราะสองสถานะนี้ยืนอยู่ที่เดียวกันบนจอ
 * ถ้าโครงต่างกัน จอจะกระโดดตอนสลับจาก "กำลังโหลด" ไป "ผิดพลาด"
 *
 * ⚠️ **ไม่มีข้อความตั้งต้นเป็นภาษาไทย** — DS ไม่มี i18n และไม่ควรมี
 * ทุกคำมาจากแอป ที่นี่มีแต่ค่าอังกฤษไว้กันจอว่างเปล่าตอนลืมส่ง
 */
declare function ErrorState({ icon, image, tone, onRetry, retryLabel, action, error: _error, ...props }: ErrorStateProps): React.JSX.Element;

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
declare function Toaster(props: ToasterProps): React.JSX.Element;

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
declare const DialogHeader: ({ className, ...props }: React.ComponentProps<"div">) => React.JSX.Element;
declare const DialogFooter: ({ className, ...props }: React.ComponentProps<"div">) => React.JSX.Element;
declare const DialogTitle: React.ForwardRefExoticComponent<Omit<RadixDialog.DialogTitleProps & React.RefAttributes<HTMLHeadingElement>, "ref"> & React.RefAttributes<HTMLHeadingElement>>;
declare const DialogDescription: React.ForwardRefExoticComponent<Omit<RadixDialog.DialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>, "ref"> & React.RefAttributes<HTMLParagraphElement>>;

/** โทนของ dialog — คุมสีเส้นคั่นและสีปุ่มยืนยัน */
type ConfirmTone = "info" | "warning" | "danger" | "success";
/** ไอคอนสำเร็จรูปตามโทน — ส่งเข้า `icon` เองเมื่ออยากได้ไอคอนด้านบน
 *
 * ไม่ถูกใส่ให้อัตโนมัติ เพราะ **ของจริงส่วนใหญ่ไม่มีทั้งไอคอนและเส้นคั่น**
 * (10 ใน 14 จอของ Portal เป็นหัวข้อ + คำอธิบาย + ปุ่ม เท่านั้น)
 * (`<ConfirmDialog icon={toneIcon.danger} … />`)
 */
declare const toneIcon: {
    readonly info: React.JSX.Element;
    readonly warning: React.JSX.Element;
    readonly danger: React.JSX.Element;
    readonly success: React.JSX.Element;
};
type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: React.ReactNode;
    description?: React.ReactNode;
    /** โทน — คุมสีเส้นคั่นและสีปุ่มยืนยัน */
    tone?: ConfirmTone;
    /**
     * ไอคอนด้านบนกึ่งกลาง (ไม่บังคับ)
     *
     * ส่งมาแล้วเส้นคั่นใต้หัวข้อจะหายไปเอง — กติกาเดียวกับทั้งสามแอป
     * ใช้ไอคอนสำเร็จรูปได้จาก `toneIcon`
     */
    icon?: React.ReactNode;
    /** สั่งเปิด/ปิดเส้นคั่นเอง แทนกติกาอัตโนมัติ (ค่าปกติ = แสดงเมื่อไม่มี `icon`) */
    divider?: boolean;
    confirmLabel?: React.ReactNode;
    cancelLabel?: React.ReactNode;
    /** เรียกเมื่อกดยืนยัน — คืน Promise เพื่อให้ dialog ค้างพร้อมสถานะโหลดจนกว่าจะเสร็จ */
    onConfirm?: () => void | Promise<void>;
    /** เรียกเมื่อกดยกเลิก (ค่าปกติคือปิด dialog) */
    onCancel?: () => void;
    size?: React.ComponentProps<typeof DialogContent>["size"];
    /**
     * สั่งสถานะโหลดจากภายนอก — ชนะสถานะที่ dialog จัดการเองจาก Promise
     *
     * ใช้เมื่อ mutation อยู่นอก dialog (เช่น `mutation.isPending` ของ react-query)
     * ในโหมดนี้ dialog จะไม่รอ `onConfirm` และไม่ปิดตัวเอง — ผู้เรียกเป็นคนปิด
     * (ปกติทำใน `onSuccess`) · ไม่ส่งมา = ใช้พฤติกรรมเดิมที่ dialog จัดการเอง
     */
    isLoading?: boolean;
    /**
     * ชื่อที่ถูกตามกติกา §4.5 ของ DS — `loading` = "สิ่งที่ผู้ใช้สั่งกำลังทำอยู่"
     * `isLoading` ยังใช้ได้เพื่อไม่ให้ผู้เรียกเดิมพัง แต่ `loading` ชนะเมื่อส่งมาทั้งคู่
     */
    loading?: boolean;
    /**
     * ปิดกล่องด้วย Esc / คลิกนอกกล่องได้ไหม — ค่าปกติ `true`
     *
     * ⚠️ **ตอน `loading` จะปิดไม่ได้เสมอ ไม่ว่า prop นี้เป็นอะไร** — กดยืนยันแล้วเผลอ
     * คลิกนอกกล่องระหว่างรอ API ตอบ ผู้ใช้จะไม่รู้ว่าสิ่งที่สั่งไปสำเร็จหรือไม่
     * (ของจริงในแอปเขียน `if (!isLoading) onClose()` ไว้เองทุกจอด้วยเหตุผลนี้)
     */
    dismissible?: boolean;
    /** `start` = หัวข้อและคำอธิบายชิดซ้าย — สำหรับกล่องที่เนื้อหาเป็นรายการหรือฟอร์ม */
    align?: "center" | "start";
    /** โชว์ข้อความผิดพลาดคาไว้ในกล่อง โดยไม่ปิด dialog */
    errorMessage?: React.ReactNode;
    /** `false` = โหมดแจ้งเตือนปุ่มเดียว ไม่มีปุ่มยกเลิก · ค่าปกติ `true` */
    showCancel?: boolean;
    /**
     * ปิดปุ่มยืนยันไว้ก่อน ขณะที่ปุ่มยกเลิกยังกดได้
     *
     * 🔴 ใช้กับกล่องที่ **ยืนยันไม่ได้จนกว่าจะรู้ผล** — เช่นจอถอดคนออกจากหน่วยงานที่ต้อง
     * โหลด preview ผลกระทบมาก่อน (ถ้า preview พัง กล่องยืนยันที่ยังกดได้แย่กว่าไม่มีกล่อง
     * เพราะมันชวนให้กดโดยเข้าใจว่าระบบตรวจให้แล้ว)
     *
     * ⚠️ ต่างจาก `loading` — อันนั้นคือ "กำลังทำอยู่" และปิดปุ่มยกเลิกด้วย
     */
    confirmDisabled?: boolean;
    /**
     * เนื้อหาเพิ่มเติม **ใต้คำอธิบาย เหนือปุ่ม** — ใส่อะไรก็ได้
     *
     * ใช้ตอนที่ข้อความอย่างเดียวไม่พอ เช่น รายการที่จะถูกลบ · ตารางสรุป · ช่องกรอก
     *
     * ⚠️ **ไม่บังคับการจัดวาง** — สืบทอด `text-center` ของกล่องมา ซึ่งตรงกับของจริง
     * ทุกเคสใน Portal ที่ส่ง JSX เข้ามา (ล้วนเป็นข้อความจัดกึ่งกลาง)
     * ถ้าเป็น **ฟอร์ม ต้องสั่ง `text-left` เอง** — label/ตัวนับ/ข้อความ error ที่ลอย
     * กลางอ่านยากและผิดหลักฟอร์ม
     */
    children?: React.ReactNode;
};
declare function ConfirmDialog({ open, onOpenChange, title, description, tone, icon, divider, confirmLabel, cancelLabel, onConfirm, onCancel, size, isLoading, loading: loadingProp, dismissible, align, errorMessage, showCancel, confirmDisabled, children, }: ConfirmDialogProps): React.JSX.Element;

/** @doc ./ContactSupportDialog.md */

/**
 * ช่องทางติดต่อของ MediAct — **ค่าเดียวกันทั้ง 4 แอป**
 *
 * 🔴 นี่คือเหตุผลหลักที่กล่องนี้ย้ายมาอยู่ใน DS: ก่อนหน้านี้ทั้ง 4 แอปคัดลอกเลข 2 ตัวนี้
 * ไว้คนละไฟล์ ⇒ วันที่เบอร์เปลี่ยน ต้องไล่แก้ 4 ที่ และถ้าลืมที่ใดที่หนึ่ง ผู้ใช้คนเดียวกัน
 * จะเห็นเบอร์ไม่ตรงกันระหว่างแอป แล้วไม่รู้ว่าอันไหนของจริง
 *
 * ผู้เรียกทับได้ผ่าน prop (เผื่อสภาพแวดล้อมทดสอบ) แต่ **ปกติไม่ต้องส่ง**
 */
declare const MEDIACT_LINE_URL = "https://line.me/R/ti/p/@019bdeqs";
declare const MEDIACT_LINE_HANDLE = "@mediact";
declare const MEDIACT_SUPPORT_PHONE = "+66 94 124 9291";
type ContactSupportLabels = {
    /** ชื่อเรื่องของกล่อง เช่น "ติดต่อฝ่ายสนับสนุน" */
    title: string;
    lineTitle: string;
    lineDescription: string;
    phoneTitle: string;
    phoneDescription: string;
};
type ContactSupportDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /**
     * ข้อความทั้งหมด — **DS ไม่ถือคำแปล** เพราะแต่ละแอปมี i18n ของตัวเองและคีย์คนละชุด
     * สิ่งที่ DS ถือคือ *ทรง* กับ *ช่องทางติดต่อ* ซึ่งเป็นส่วนที่ต้องตรงกันจริง ๆ
     */
    labels: ContactSupportLabels;
    /**
     * โลโก้บริษัทกลางหัวกล่อง (ไม่บังคับ)
     *
     * ⚠️ เป็น prop ไม่ใช่ของที่ฝังมาใน DS — DS ไม่มีสายพานสำหรับไฟล์ภาพ ผู้เรียกจึงส่ง
     * `<img src="/icons/mediact-logo.svg" alt="MediAct" className="h-10 w-auto" />` เข้ามาเอง
     */
    logo?: React.ReactNode;
    lineUrl?: string;
    lineHandle?: string;
    phoneNumber?: string;
    className?: string;
};
/**
 * กล่อง "ติดต่อฝ่ายสนับสนุน" — ใช้เหมือนกันทั้ง 4 แอป
 *
 * ⚠️ **หัวกล่องจัดกึ่งกลางและไม่มีเส้นคั่น** ต่างจากหน้าต่างฟอร์มทั่วไปที่หัวชิดซ้าย
 * มีป้ายไอคอนและเส้นคั่น — จงใจ เพราะกล่องนี้พูดในนามบริษัท ไม่ใช่ส่วนหนึ่งของงานในจอ
 * และผู้ใช้คนเดียวกันเปิดหลายแอป จึงต้องจำหน้าตา "ที่ขอความช่วยเหลือ" ได้ทันที
 */
declare function ContactSupportDialog({ open, onOpenChange, labels, logo, lineUrl, lineHandle, phoneNumber, className, }: ContactSupportDialogProps): React.JSX.Element;

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
declare function Filter({ children, triggerLabel, trigger, triggerProps, open, defaultOpen, onOpenChange, align, side, sideOffset, contentClassName, }: FilterProps): React.JSX.Element;

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
    /** Override the content panel's classes — e.g. a non-brand tone (dark/light). */
    contentClassName?: string;
};
/**
 * Convenience wrapper. For grouped tooltips wrap your tree in <TooltipProvider>.
 * This component creates its own provider if none is in scope (safe to nest).
 */
declare function Tooltip({ content, children, side, align, delayDuration, open, defaultOpen, onOpenChange, asChild, arrow, contentClassName, }: TooltipProps): React.JSX.Element;

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

declare const statusBadgeVariants: (props?: ({
    tone?: "info" | "success" | "warning" | "neutral" | "danger" | null | undefined;
    size?: "sm" | "md" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type StatusBadgeProps = React.ComponentProps<"span"> & VariantProps<typeof statusBadgeVariants> & {
    /** Hide the leading dot. */
    hideDot?: boolean;
};
/**
 * Dot + label status pill, e.g. "● Published", "● Draft",
 * "● มีการแก้ไขที่ยังไม่บันทึก". Dot inherits the tone's text color.
 */
declare const StatusBadge: React.ForwardRefExoticComponent<Omit<StatusBadgeProps, "ref"> & React.RefAttributes<HTMLSpanElement>>;

declare const dateNavigatorVariants: (props?: ({
    size?: "sm" | "md" | null | undefined;
    fullWidth?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type DateNavigatorUnit = "month" | "day";
type DateNavigatorProps = Omit<React.ComponentProps<"div">, "children" | "onChange"> & VariantProps<typeof dateNavigatorVariants> & {
    /**
     * Controlled mode — เมื่อส่ง `value` มา component จะ format label
     * และคำนวณ ‹ › ให้เองตาม `unit` (สไตล์เดียวกับ MUI controlled component)
     */
    value?: Date;
    /** เรียกพร้อม Date ใหม่เมื่อกด ‹ › หรือเลือกจากปฏิทิน */
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
     *
     * ของจริงในหน้า productivity ใส่สองส่วนในบรรทัดเดียว ("18 ส.ค. 2569 · เวรบ่าย")
     * โดยครึ่งหลังเป็นสีแบรนด์ — รับ ReactNode จึงทำแบบนั้นได้
     */
    label?: React.ReactNode;
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
    /**
     * กดตรงกลางแล้วเปิดปฏิทิน
     *
     * `unit="month"` จะเปิดมาที่ตาราง 12 เดือนและเลือกจบที่เดือนเลย
     * @default false — ตัวเลื่อนแบบอ่านอย่างเดียวยังมีอยู่จริง (การ์ดตารางแพทย์)
     */
    calendar?: boolean;
    /** หัวข้อเหนือปฏิทิน — ไม่ส่งก็ไม่มี */
    calendarTitle?: React.ReactNode;
    /**
     * เนื้อหาเพิ่มใต้ปฏิทิน — เช่นแถวปุ่มเลือกเวรของหน้า productivity
     *
     * DS ไม่รู้จักเวร/แผนก/อะไรก็ตามที่แอปเอามาวาง จึงเป็นสล็อตเปล่า
     * state ของสิ่งที่วางเป็นของผู้เรียกทั้งหมด
     */
    children?: React.ReactNode;
    /**
     * มีข้อความนี้ = **โหมดร่าง** — เลือกวันแล้วยังไม่ commit จนกดปุ่มนี้
     *
     * ใช้เมื่อ popover มีมากกว่าวันที่ (เช่นวัน + เวร) เพราะถ้า commit ทันที
     * ที่กดวัน หน้าจอข้างหลังจะโหลดใหม่ทั้งที่ผู้ใช้ยังเลือกไม่ครบคู่
     * ไม่ส่ง = กดวันแล้ว commit และปิดทันที (แบบ DatePicker)
     */
    confirmLabel?: React.ReactNode;
    /** เรียกตอนกดปุ่มยืนยัน · ไม่ส่งจะ fallback ไปที่ `onChange` */
    onConfirm?: (date: Date) => void;
    /** คุมการเปิด/ปิดปฏิทินเอง */
    calendarOpen?: boolean;
    onCalendarOpenChange?: (open: boolean) => void;
    /** ส่งต่อให้ `Calendar` (เช่น `weekStartsOn`, `labels`) */
    calendarProps?: Omit<CalendarProps, "month" | "onMonthChange" | "selected" | "onSelect" | "minDate" | "maxDate">;
};
/**
 * `‹ label ›` stepper สำหรับเลื่อนเดือน/วัน — กดตรงกลางเปิดปฏิทินได้
 *
 * 2 โหมดของ label:
 * - **Controlled (แนะนำ):** ส่ง `value` + `onChange` — format ไทย/พ.ศ. ให้เอง
 *   ผ่าน Intl ตาม `locale` และ step ตาม `unit`
 * - **Manual:** ส่ง `label` + `onPrev`/`onNext` — ควบคุมเองทั้งหมด
 */
declare const DateNavigator: React.ForwardRefExoticComponent<Omit<DateNavigatorProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

declare function cn(...inputs: ClassValue[]): string;

export { AddButton, type AddButtonProps, AppLauncher, type AppLauncherProps, AppShowcaseDialog, type AppShowcaseDialogProps, Avatar, type AvatarProps, Breadcrumb, type BreadcrumbItem, BreadcrumbLink, type BreadcrumbProps, BreadcrumbRoot, Button, ButtonGroup, type ButtonGroupProps, type ButtonProps, Calendar, type CalendarLabels, type CalendarProps, type CalendarView, Card, CardContent, CardDescription, CardFooter, CardHeader, type CardProps, CardTitle, Checkbox, CheckboxGroup, CheckboxGroupItem, type CheckboxGroupProps, type CheckboxOption, type CheckboxProps, Chip, type ChipProps, type ChipState, ComboBox, type ComboBoxMultiProps, type ComboBoxOption, type ComboBoxOptionGroup, type ComboBoxProps, type ComboBoxSingleProps, ConfirmCancelActions, type ConfirmCancelActionsProps, ConfirmDialog, type ConfirmDialogProps, type ConfirmTone, ContactSupportDialog, type ContactSupportDialogProps, type ContactSupportLabels, type CustomFormat, DataTable, type DataTableGroupLabelContext, DataTableGroupRow, type DataTableGroupingProps, type DataTableLabels, type DataTablePagination, type DataTableProps, DateNavigator, type DateNavigatorProps, type DateNavigatorUnit, DatePicker, type DatePickerProps, DateRangePicker, type DateRangePickerLabels, type DateRangePickerProps, type DateRangeValue, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, EmptyState, type EmptyStateProps, EntityAutocomplete, type EntityAutocompleteMultiProps, type EntityAutocompleteProps, type EntityAutocompleteSingleProps, ErrorState, type ErrorStateProps, FORMAT_PRESETS, FieldIconSlot, type FieldIconSlotProps, type FieldSize, FieldSkeleton, Filter, type FilterProps, FloatingFieldShell, type FloatingFieldShellProps, FormField, type FormFieldProps, FormatInput, type FormatInputProps, type FormatPreset, type GroupBy, Heading, type HeadingProps, IconButton, type IconButtonProps, Input, type InputProps, type LanguageOption, LanguageSwitcher, type LanguageSwitcherProps, LoadingScreen, MEDIACT_LINE_HANDLE, MEDIACT_LINE_URL, MEDIACT_SUPPORT_PHONE, type MediactAppConfig, type MediactAppKey, NotificationBell, type NotificationBellProps, NumberStepper, type NumberStepperProps, type OptionRowState, OutlineButton, type OutlineButtonProps, PillSwitch, type PillSwitchOption, type PillSwitchProps, Popover, PopoverAnchor, PopoverClose, PopoverContent, PopoverTrigger, RadioGroup, RadioGroupItem, type RadioGroupProps, type RadioOption, SHOWCASE_COPY, SHOWCASE_LAYOUT, Select, SelectItem, type SelectOption, type SelectProps, type ShowcaseAppKey, type ShowcaseAssets, type ShowcaseLocale, Sidebar, SidebarGroup, type SidebarGroupProps, SidebarItem, type SidebarItemProps, type SidebarProps, Skeleton, SkeletonBox, type SkeletonBoxProps, type SkeletonProps, SolidButton, type SolidButtonProps, Spinner, type SpinnerProps, type StateMediaShape, type StateSize, type StateTone, StatusBadge, type StatusBadgeProps, Stepper, type StepperProps, type StepperStep, Switch, type SwitchProps, type SwitchTone, type SwitchTrackLabels, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Text, type TextProps, Textarea, type TextareaProps, TimePicker, type TimePickerProps, type TimeValue, Toaster, type ToasterProps, type ToggleSize, Tooltip, TooltipContent, TooltipPortal, type TooltipProps, TooltipProvider, TooltipRoot, TooltipTrigger, TopNav, TopNavBrand, type TopNavBrandProps, type TopNavProps, TopNavSpacer, TopNavToggle, type TopNavToggleProps, UserMenu, type UserMenuItem, type UserMenuProps, avatarVariants, buttonGroupVariants, buttonVariants, checkboxShapeClasses, chipVariants, cn, dayKey, fieldLabelId, fieldShapeClasses, headingVariants, iconButtonVariants, numberStepperVariants, outlineButtonVariants, radioShapeClasses, resolveGroups, solidButtonVariants, statusBadgeVariants, switchToneClasses, textVariants, toneIcon, useSidebarState };
