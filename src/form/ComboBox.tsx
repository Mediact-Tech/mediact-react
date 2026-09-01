import * as React from "react";
import { Command as CmdkRoot } from "cmdk";
import { Check, ChevronDown, ChevronsUpDown, Lock, X } from "lucide-react";
import { cn } from "../lib/cn";
import {
  FloatingFieldShell,
  FieldSkeleton,
  fieldLabelId,
  fieldShapeClasses,
  type FieldSize,
} from "./FloatingFieldShell";
import {
  groupItems,
  GROUP_HEADING_CLASS,
  type GroupBy,
  type OptionGroup,
} from "./group-options";
import type { OptionRowState, ChipState } from "./option-row";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../overlay/Popover";
import { Chip } from "../ui/Chip";
import { Spinner } from "../feedback/Spinner";

/* ────────────────────────────────────────────────────────────────────────────
 * ComboBox — เลือกจากรายการที่มีช่องค้นหา · เลือกอันเดียวหรือหลายอันก็ได้
 *
 * 📌 เดิมแยกเป็น `ComboBox` (อันเดียว) กับ `MultiAutocomplete` (หลายอัน)
 *    รวบเป็นตัวเดียว 2026-08-08 เพราะ prop ของ ComboBox เดิม **ทั้ง 23 ตัว
 *    เป็นสับเซตของ MultiAutocomplete ครบทุกตัว** ต่างกันจริงแค่ชนิดของ
 *    `value`/`onChange` กับหน้าตาตัวช่อง — และ `EntityAutocomplete` ก็รวบ
 *    อันเดียว/หลายอันไว้ด้วย `multiple` มาตั้งแต่แรกอยู่แล้ว
 *
 * แบ่งงานกับ `EntityAutocomplete` ที่แกนจริง 2 อย่าง:
 *   ตัวนี้            = ตัวเลือกอยู่ในมือแล้ว · ทรง `{value,label}` · cmdk กรองให้
 *   EntityAutocomplete = ตัวเลือกอยู่หลังบ้าน · object อะไรก็ได้ · ผู้เรียกกรองเอง
 * ──────────────────────────────────────────────────────────────────────────── */

export type ComboBoxOption<V extends string = string> = {
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

export type ComboBoxOptionGroup<V extends string = string> = {
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
  renderOption?: (
    option: ComboBoxOption<V>,
    state: OptionRowState,
  ) => React.ReactNode;
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

export type ComboBoxSingleProps<V extends string = string> =
  ComboBoxCommonProps<V> & {
    multiple?: false;
    value?: V | null;
    defaultValue?: V;
    /** ไม่มีค่า = `null` (ตรงกับ `EntityAutocomplete`) */
    onChange?: (value: V | null) => void;
    /**
     * แสดงปุ่ม × ในช่องเมื่อมีค่าอยู่ กดแล้วคืนค่าเป็น `null`
     *
     * 🔴 **มีไว้เพราะโหมดเลือกอันเดียวเคยล้างค่าจาก UI ไม่ได้เลย** — โหมดหลายอันมีปุ่ม `Clear`
     * ในแผงอยู่แล้ว แต่โหมดนี้ไม่มีทางกลับไปสถานะ "ไม่ได้เลือก" นอกจากรีโหลดหน้าหรือแก้ URL เอง
     * (พบจาก mediact-web-backoffice 2026-08-18: ช่องแผนก/หน่วยงานบนแถบขอบเขต — ตัวกรองที่
     * ล้างไม่ได้ทำให้ตัวเลือก "ดูทั้งหมด" เป็นไปไม่ได้ในทางปฏิบัติ)
     *
     * ทรงเดียวกับ `clearable` ของ `Select` โดยเจตนา — สองตัวนี้ถูกสลับกันใช้บ่อย
     * ⛔ ไม่มีผลในโหมดหลายอัน (`multiple`) ซึ่งมีปุ่มล้างของตัวเองในแผง
     */
    clearable?: boolean;
  };

export type ComboBoxMultiProps<V extends string = string> =
  ComboBoxCommonProps<V> &
    ComboBoxMultiOnlyProps<V> & {
      multiple: true;
      value?: V[];
      defaultValue?: V[];
      onChange?: (value: V[]) => void;
    };

export type ComboBoxProps<V extends string = string> =
  | ComboBoxSingleProps<V>
  | ComboBoxMultiProps<V>;

const minHeights: Record<FieldSize, string> = {
  sm: "min-h-9",
  md: "min-h-11",
  lg: "min-h-12",
};

function ComboBox<V extends string = string>(props: ComboBoxProps<V>) {
  const {
    id,
    label,
    hint,
    error,
    required,
    hideLabel,
    alwaysFloatLabel,
    placeholder,
    reserveMessageSpace,
    searchPlaceholder = "Search...",
    emptyText = "No results found.",
    options = [],
    groups,
    groupBy,
    groupOrder,
    onSearch,
    optionsLoading,
    isLoading,
    loadingText = "Loading...",
    renderOption,
    disabled,
    typeahead,
    size = "md",
    className,
    containerClassName,
    multiple,
    value,
    defaultValue,
    onChange,
  } = props;

  const isMultiple = multiple === true;
  const { renderChip, maxVisibleChips = 3, maxItems } = isMultiple
    ? (props as ComboBoxMultiProps<V>)
    : ({} as ComboBoxMultiOnlyProps<V>);
  /* ปุ่มล้างเป็นของโหมดเดี่ยวเท่านั้น — โหมดหลายอันมีปุ่ม `Clear` ของตัวเองอยู่ในแผง */
  const { clearable } = isMultiple
    ? ({} as ComboBoxSingleProps<V>)
    : (props as ComboBoxSingleProps<V>);

  const reactId = React.useId();
  const triggerId = id ?? reactId;
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  /* ตัวช่องของโหมด `typeahead` — ต้องอ้างถึงได้จากตัวจัดการ "คลิกข้างนอก" ของแผง
   * (ดูเหตุผลเต็มที่ `onPointerDownOutside` ข้างล่าง) */
  const typeaheadInputRef = React.useRef<HTMLInputElement>(null);

  /**
   * แผงปิดเพราะผู้ใช้ไปคลิก/โฟกัสที่อื่น ⛔ ไม่ใช่เพราะเลือก option หรือกด Esc
   *
   * 🔴🔴 **ตัวกันวงวน `Maximum update depth exceeded`** — ช่องของโหมดนี้เปิดแผงตอนได้โฟกัส
   * (`onFocus`) และ Radix คืนโฟกัสให้ anchor เสมอตอนปิด (`onCloseAutoFocus` ค่าเริ่มต้น)
   * ⇒ มี `ComboBox` แบบ `typeahead` สองตัวอยู่ข้างกัน (แถบตัวกรองของ Mediwork มีสองตัว):
   *   เปิดแผงของตัว A ไว้ → คลิกที่ช่องของตัว B
   *   → A ปิดเพราะคลิกข้างนอก → Radix คืนโฟกัสให้ช่อง A → `onFocus` ของ A เปิดแผงใหม่
   *   → โฟกัสจริงต้องไปที่ B → A เห็น focus outside → ปิด → คืนโฟกัส → เปิด → **วนไม่จบ**
   * ⇒ ต้องไม่คืนโฟกัสเมื่อการปิดเกิดจากการที่ผู้ใช้ไปที่อื่นแล้ว
   * ⚠️ **ห้าม `preventDefault` ทุกกรณี** — ปิดด้วยการเลือก option หรือกด Esc ต้องคืนโฟกัสให้ช่อง
   * ตามเดิม ไม่งั้นคนที่ใช้คีย์บอร์ดจะหลุดโฟกัสออกจากฟอร์มทุกครั้งที่เลือกค่า
   */
  const closedByOutsideRef = React.useRef(false);

  /* เก็บสถานะเป็นอาร์เรย์เสมอ แล้วค่อยแปลงตอนส่งออก
   * ⇒ ตรรกะข้างในมีเส้นเดียว ไม่ใช่สองเส้นที่ต้องคอยดูแลให้ตรงกัน */
  const [internal, setInternal] = React.useState<V[]>(() => {
    if (isMultiple) return (defaultValue as V[] | undefined) ?? [];
    return defaultValue !== undefined ? [defaultValue as V] : [];
  });

  const isControlled = value !== undefined;
  const controlled = React.useMemo<V[] | undefined>(() => {
    if (!isControlled) return undefined;
    if (isMultiple) return (value as V[] | undefined) ?? [];
    return value != null ? [value as V] : [];
  }, [isControlled, isMultiple, value]);

  const selected = controlled ?? internal;

  const setSelected = (next: V[]) => {
    if (!isControlled) setInternal(next);
    if (isMultiple) {
      (onChange as ((v: V[]) => void) | undefined)?.(next);
    } else {
      (onChange as ((v: V | null) => void) | undefined)?.(next[0] ?? null);
    }
  };

  /**
   * ปุ่ม × ในช่องของโหมดเลือกอันเดียว — **ประกาศครั้งเดียว ใช้ทั้งเส้น `typeahead` และช่องธรรมดา**
   *
   * 🔴🔴 **`pointer-events-auto` เป็นส่วนที่ทำให้กดได้จริง** — `FloatingFieldShell` ห่อ
   * `rightAdornment` ด้วย `pointer-events-none` โดยเจตนา (คลิกตรงไอคอนต้องทะลุไปเปิดแผง) และเขียน
   * กำกับไว้เองว่า adornment ที่เป็นปุ่มจริงต้องเปิดกลับที่ตัวมันเอง · `Select` เคยตกข้อนี้จนปุ่มล้าง
   * กดไม่ได้เลยบนจอจริง (แก้พร้อมกันในรอบนี้)
   *
   * ⛔ **หยุด event ไม่ให้ไปถึง trigger** — `PopoverTrigger`/`Command.Input` อยู่ใต้ปุ่มนี้
   * ⇒ ปล่อยผ่านเมื่อไหร่ การล้างค่าจะเปิดแผงขึ้นมาด้วยทุกครั้ง ซึ่งอ่านเหมือนกดผิด
   */
  const clearButton =
    clearable && !isMultiple && selected.length > 0 && !disabled ? (
      <button
        type="button"
        aria-label="Clear"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setSelected([]);
          setQuery("");
        }}
        onPointerDown={(event) => event.stopPropagation()}
        /* `cursor-pointer` เขียนเอง — Tailwind v4 ตั้ง `button { cursor: default }` ใน preflight
         * (ต่างจาก v3) ⇒ ไม่ประกาศแล้วได้ลูกศรธรรมดา ซึ่งอ่านเหมือนปุ่มกดไม่ได้ */
        className="pointer-events-auto cursor-pointer rounded-full p-0.5 hover:bg-overlay-press"
      >
        <X className="size-4" />
      </button>
    ) : null;

  const flatOptions = React.useMemo(
    () => (groups ? groups.flatMap((g) => g.options) : options),
    [groups, options],
  );
  const optionByValue = React.useCallback(
    (v: V) => flatOptions.find((o) => o.value === v),
    [flatOptions],
  );

  /* ล็อกมีผลเฉพาะโหมดเลือกหลายอัน — ดูเหตุผลที่ `ComboBoxOption.locked` */
  const isLocked = React.useCallback(
    (opt?: ComboBoxOption<V>) => Boolean(isMultiple && opt?.locked),
    [isMultiple],
  );

  /* ทางที่จะวาดจริง มี 3 แบบ เรียงลำดับความชนะ:
   *   1. `groups`  — จัดกลุ่มมาให้แล้ว (ของที่ระบุตรง ๆ ชนะเสมอ)
   *   2. `groupBy` — จัดกลุ่มจากรายการแบนให้เอง
   *   3. รายการแบนล้วน
   * ทำเป็นทรงเดียวกันหมดตั้งแต่ตรงนี้ ⇒ ข้างล่างมีทางวาดเดียว ไม่ใช่สามทาง */
  const renderGroups = React.useMemo<OptionGroup<ComboBoxOption<V>>[]>(() => {
    if (groups) return groups.map((g) => ({ heading: g.heading, items: g.options }));
    if (groupBy) return groupItems(options, groupBy, groupOrder);
    return [{ heading: null, items: options }];
  }, [groups, groupBy, groupOrder, options]);

  const pick = (v: V) => {
    const opt = optionByValue(v);
    if (!isMultiple) {
      /* เลือกทับตัวเดิม = ล้างค่า (พฤติกรรมเดิมของ ComboBox) */
      setSelected(selected[0] === v ? [] : [v]);
      setOpen(false);
      return;
    }
    if (selected.includes(v)) {
      if (isLocked(opt)) return; // ถอดออกจากลิสต์ไม่ได้
      setSelected(selected.filter((x) => x !== v));
    } else {
      if (maxItems != null && selected.length >= maxItems) return;
      setSelected([...selected, v]);
    }
  };

  const remove = (v: V) => {
    if (isLocked(optionByValue(v))) return; // ถอดออกจาก chip ไม่ได้
    setSelected(selected.filter((x) => x !== v));
  };

  /* ปุ่มล้างทั้งหมดต้องเก็บตัวที่ล็อกไว้ — ล้างหมดจริงคือทางลัดที่ทำให้
   * ด่านอีกสองทางไม่มีความหมาย */
  const clearAll = () =>
    setSelected(selected.filter((v) => isLocked(optionByValue(v))));

  const hasError = Boolean(error);
  const hasValue = selected.length > 0;
  const floating =
    Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);

  const visible = selected.slice(0, maxVisibleChips);
  const overflow = selected.length - visible.length;

  /* โครงร่างใช้ shell ตัวเดียวกับของจริง ⇒ สูงเท่ากันโดยโครงสร้าง */
  if (isLoading) {
    return (
      <FieldSkeleton
        label={label}
        hint={hint}
        required={required}
        hideLabel={hideLabel}
        size={size}
        reserveMessageSpace={reserveMessageSpace}
        containerClassName={containerClassName}
      />
    );
  }

  const selectedLabel = optionByValue(selected[0] as V)?.label;

  /* ลิสต์ตัวเลือก — ดึงออกมาเป็นตัวแปรเพราะสองโหมดใช้ก้อนเดียวกันเป๊ะ
   * ต่างกันแค่ว่า `Command.Input` ไปอยู่ที่ไหน (ในแผง หรือกลายเป็นตัวช่องเอง)
   * ถ้าเขียนซ้ำสองที่ มันจะเพี้ยนออกจากกันแน่นอน — บทเรียนเดิมของ repo นี้ */
  const optionList = (
    <CmdkRoot.List className="max-h-64 overflow-auto p-1">
      {optionsLoading ? (
        <CmdkRoot.Loading className="flex items-center justify-center gap-2 px-3 py-6 text-body-sm text-text-tertiary">
          <Spinner size="sm" />
          {loadingText}
        </CmdkRoot.Loading>
      ) : (
        <>
          <CmdkRoot.Empty className="px-3 py-6 text-center text-body-sm text-text-tertiary">
            {emptyText}
          </CmdkRoot.Empty>
          {renderGroups.map((g) => {
            const rows = g.items.map((opt) => (
              <ComboBoxItem
                key={opt.value}
                opt={opt}
                selected={selected}
                locked={isLocked(opt)}
                maxItems={isMultiple ? maxItems : undefined}
                renderOption={renderOption}
                onPick={pick}
              />
            ));
            /* ก้อนที่ไม่มีหัวข้อไม่ห่อ CmdkRoot.Group — cmdk จะเว้นที่ให้
             * หัวข้อว่างไว้ ทำให้มีช่องว่างลอย ๆ บนสุดของลิสต์ */
            return g.heading == null ? (
              <React.Fragment key="__ungrouped">{rows}</React.Fragment>
            ) : (
              <CmdkRoot.Group
                key={g.heading}
                heading={g.heading}
                className={GROUP_HEADING_CLASS}
              >
                {rows}
              </CmdkRoot.Group>
            );
          })}
        </>
      )}
    </CmdkRoot.List>
  );

  const multiFooter = isMultiple && selected.length > 0 && (
    <div className="flex items-center justify-between border-t border-border-default px-2 py-1.5 text-caption">
      <span className="text-text-tertiary">
        {selected.length} selected
        {maxItems != null && ` / ${maxItems}`}
      </span>
      <button
        type="button"
        onClick={clearAll}
        className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-cherry-red-600 hover:bg-cherry-red-50"
      >
        <X className="size-3" />
        Clear
      </button>
    </div>
  );

  /* ── โหมดพิมพ์ค้นในช่อง ────────────────────────────────────────────────────
   *
   * `Command` ย้ายออกมาครอบ **ทั้งช่องและแผง** ⇒ `Command.Input` ที่กลายเป็นตัวช่อง
   * ยังอยู่ context เดียวกับลิสต์ ลูกศรขึ้น/ลงและ Enter จึงทำงานเหมือนเดิมทุกอย่าง
   * (ถ้าปล่อยให้อยู่คนละ context คีย์บอร์ดจะใช้ไม่ได้ทั้งชุด)
   *
   * ใช้ `PopoverAnchor` แทน `PopoverTrigger` — trigger จะกลืนการพิมพ์ไปเปิด/ปิดแผง
   * ส่วน anchor ทำหน้าที่แค่บอกตำแหน่ง ปล่อยให้ input เป็น input ตามปกติ */
  if (typeahead && !isMultiple) {
    return (
      /* 🔴 `contents` ไม่ใช่ `w-full` — `Command` ของ cmdk เรนเดอร์เป็น `<div>` จริง
       * ถ้าปล่อยให้มันมีกล่องของตัวเอง จะกลายเป็น **ชั้นบล็อกที่แทรกระหว่างผู้เรียกกับตัวช่อง**
       * ⇒ `containerClassName` ที่ผู้เรียกส่งมา (ความกว้าง/flex) ไปลงที่ชั้นในแทน
       * และตัวที่เป็น flex item จริงกลายเป็น div กว้าง 100% ⇒ ทุกช่องกินเต็มแถวแล้วตกบรรทัด
       * (วัดจากจอจริง 2026-08-14: สามช่องอยู่ `left` เดียวกันหมด `top` ห่างกัน 49px)
       *
       * `display: contents` ทำให้ element นี้ไม่สร้างกล่อง ลูกของมันขึ้นไปเป็น flex item
       * ของผู้เรียกตรง ๆ ⇒ โครงเลย์เอาต์เหมือนโหมดปกติทุกประการ · event กับ context
       * ของ cmdk ยังทำงานครบเพราะ element ยังอยู่ใน DOM */
      <CmdkRoot shouldFilter={!onSearch} className="contents">
        <Popover
          open={open}
          onOpenChange={(next) => {
            if (disabled) return;
            setOpen(next);
            // ปิดแล้วต้องกลับไปโชว์ป้ายของตัวที่เลือก ไม่ใช่ค้างคำที่พิมพ์ทิ้งไว้
            if (!next) setQuery("");
          }}
        >
          <FloatingFieldShell
            disabled={disabled}
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
            reserveMessageSpace={reserveMessageSpace}
            containerClassName={containerClassName}
            rightAdornment={
              <>
                {clearButton}
                <ChevronDown
                  className={cn("transition-transform", open && "rotate-180")}
                />
              </>
            }
          >
            <PopoverAnchor asChild>
              <CmdkRoot.Input
                ref={typeaheadInputRef}
                id={triggerId}
                disabled={disabled}
                placeholder={floating ? placeholder : undefined}
                aria-invalid={hasError || undefined}
                /* ปิดอยู่ = โชว์ป้ายของตัวที่เลือก · เปิดอยู่ = โชว์สิ่งที่พิมพ์
                 * ⇒ คนที่เลือกไว้แล้วเปิดมาใหม่จะเห็นรายการทั้งหมด ไม่ใช่ถูกกรอง
                 * ด้วยชื่อตัวเดิมจนเหลือรายการเดียว */
                value={open ? query : (selectedLabel ?? "")}
                onValueChange={(v) => {
                  setQuery(v);
                  onSearch?.(v);
                  if (!open) setOpen(true);
                }}
                onFocus={() => !disabled && setOpen(true)}
                /* 🔴🔴 **`onClick` ⛔ ไม่ใช่ `onMouseDown`** — ตัวกันบั๊กของ `@radix-ui/react-popper`
                 * (มีอยู่ตั้งแต่ 1.3.0 ถึง 1.3.7 ที่เป็นล่าสุด · ไม่มีใน 1.2.8):
                 *
                 * ```js
                 * useLayoutEffect(() => { setPlacementState(placement);
                 *   return () => { setPlacementState(void 0); };  // setState ตอน unmount
                 * }, [placement]);
                 * ```
                 *
                 * `mousedown` ปิดแผงของช่องอื่น (pointer-down-outside) **และ** เปิดแผงของช่องนี้
                 * ในคอมมิตเดียวกัน ⇒ unmount กับ mount ของ `PopperContent` ชนกัน แล้ว cleanup
                 * ข้างบนยิง `setState` ระหว่างที่ fiber กำลังถูกลบ ⇒ React ตัดด้วย
                 * **`Maximum update depth exceeded`** (stack: `commitHookLayoutUnmountEffects`
                 * → `commitDeletionEffectsOnFiber` → `PopperContent.useLayoutEffect`)
                 * ⇒ `click` ยิงหลัง `mouseup` ⇒ การปิดของตัวเก่าจบไปก่อนแล้ว คนละคอมมิต
                 *
                 * ⚠️ **ห้ามถอดทิ้งเฉย ๆ** — `onFocus` ไม่ครอบเคสที่ช่องมีโฟกัสอยู่แล้วแต่แผงปิด
                 * (กด Esc แล้วคลิกซ้ำ) เพราะไม่มี focus event ใหม่ ⇒ ต้องมีตัวจับคลิกไว้เสมอ
                 * 💰 ราคาที่รับ: แผงเปิดช้าลงครึ่งจังหวะ (รอ `mouseup`) — วัดด้วยตาไม่ออก */
                onClick={() => !disabled && setOpen(true)}
                className={cn(
                  fieldShapeClasses({ hasError, size }),
                  "pr-9",
                  className,
                )}
              />
            </PopoverAnchor>
          </FloatingFieldShell>

          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
            /* โฟกัสต้องอยู่ที่ช่องต่อไป ไม่งั้นพิมพ์ตัวที่สองไม่ได้ */
            onOpenAutoFocus={(e) => e.preventDefault()}
            /* 🔴 **ตัวช่องอยู่นอกแผงในสายตาของ Radix** — เพราะเป็น `PopoverAnchor`
             * ไม่ใช่ `PopoverTrigger` (trigger จะกลืนการพิมพ์ไปสลับเปิด/ปิดแทน)
             * ⇒ การกดที่ช่องถูกนับเป็น "คลิกข้างนอก" แล้วปิดแผงทันทีที่เพิ่งเปิด
             * อาการที่วัดได้จริง: กดแล้วแผงไม่ขึ้นเลย และตัวอักษรที่พิมพ์ไปต่อท้ายค่าเดิม
             * กลายเป็น "สูตินรีเวชกรรมศัลย" เพราะช่องยังอยู่โหมดปิด
             *
             * ปล่อยผ่านเฉพาะเหตุการณ์ที่เกิดบนตัวช่องเอง — ที่อื่นยังปิดตามปกติ */
            onPointerDownOutside={(e) => {
              if (typeaheadInputRef.current?.contains(e.target as Node)) {
                e.preventDefault();
                return;
              }
              closedByOutsideRef.current = true;
            }}
            onFocusOutside={(e) => {
              if (typeaheadInputRef.current?.contains(e.target as Node)) {
                e.preventDefault();
                return;
              }
              closedByOutsideRef.current = true;
            }}
            /* 🔴 ปิดเพราะผู้ใช้ไปที่อื่นแล้ว = **ห้ามแย่งโฟกัสกลับมา** — ไม่งั้นจะวนไม่จบกับ
             * `onFocus` ที่สั่งเปิดแผง (เหตุผลเต็มที่ `closedByOutsideRef` ข้างบน)
             * ปิดด้วยการเลือก option หรือ Esc ⇒ ปล่อยให้ Radix คืนโฟกัสให้ช่องตามปกติ */
            onCloseAutoFocus={(e) => {
              if (!closedByOutsideRef.current) return;
              closedByOutsideRef.current = false;
              e.preventDefault();
            }}
          >
            {optionList}
          </PopoverContent>
        </Popover>
      </CmdkRoot>
    );
  }

  return (
    <FloatingFieldShell
      disabled={disabled}
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
      reserveMessageSpace={reserveMessageSpace}
      containerClassName={containerClassName}
      rightAdornment={
        <>
          {clearButton}
          <ChevronsUpDown />
        </>
      }
    >
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (disabled) return;
          setOpen(next);
        }}
      >
        <PopoverTrigger asChild>
          {isMultiple ? (
            /* หลายอัน — กล่อง chip ที่สูงตามจำนวนแถวของ chip */
            <div
              id={triggerId}
              role="combobox"
              aria-labelledby={label ? fieldLabelId(triggerId) : undefined}
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
                "flex w-full cursor-pointer items-center gap-1.5 rounded-sm border bg-bg-default px-3 py-1.5 pr-9 font-medium transition-colors",
                "focus:outline-none focus:ring-1",
                /* พื้นตอนปิดใช้งาน — ค่าเดียวกับ `fieldShapeClasses` (เหตุผลอยู่ที่นั่น) */
                "aria-disabled:cursor-not-allowed aria-disabled:bg-bg-surface",
                minHeights[size],
                hasError
                  ? "border-cherry-red-600 focus:border-cherry-red-600 focus:ring-cherry-red-600/40"
                  : "border-border-strong focus:border-brand focus:ring-brand/30",
                className,
              )}
            >
              <span className="flex flex-1 flex-wrap items-center gap-1">
                {selected.length === 0 ? (
                  <span className="text-body-sm text-text-tertiary">
                    {floating ? placeholder ?? "" : ""}
                  </span>
                ) : (
                  <>
                    {visible.map((v) => {
                      const opt = optionByValue(v) ?? {
                        value: v,
                        label: String(v),
                      };
                      const locked = isLocked(opt);
                      if (renderChip) {
                        return (
                          <React.Fragment key={v}>
                            {renderChip(opt, { locked })}
                          </React.Fragment>
                        );
                      }
                      return (
                        <Chip
                          key={v}
                          size="sm"
                          /* ล็อกไว้ = สีต่างจากที่เลือกเอง — ไม่งั้นผู้ใช้เห็นแค่
                           * "chip ที่ไม่มีปุ่ม ×" แล้วนึกว่าจอเสีย */
                          variant={locked ? "neutral" : "primary"}
                          removable={!locked}
                          onRemove={(e) => {
                            e.stopPropagation();
                            remove(v);
                          }}
                        >
                          <span className="inline-flex items-center gap-1">
                            {locked && (
                              <Lock className="size-3 shrink-0" aria-hidden />
                            )}
                            {opt.label}
                          </span>
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
          ) : (
            /* อันเดียว — ปุ่มที่โชว์ป้ายของตัวที่เลือก ตัดท้ายถ้ายาวเกิน */
            <button
              id={triggerId}
              type="button"
              disabled={disabled}
              aria-invalid={hasError || undefined}
              aria-expanded={open}
              className={cn(
                fieldShapeClasses({ hasError, size }),
                "flex items-center pr-9 text-left",
                !selectedLabel && "text-text-tertiary",
                className,
              )}
            >
              <span className="truncate">
                {selectedLabel ?? (floating ? placeholder ?? "" : "")}
              </span>
            </button>
          )}
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
              className="border-b border-border-default px-3 py-2 text-body-sm outline-none placeholder:text-text-tertiary"
            />
            {optionList}
            {multiFooter}
          </CmdkRoot>
        </PopoverContent>
      </Popover>
    </FloatingFieldShell>
  );
}

/** แถวเดียวในลิสต์ — ใช้ร่วมทั้งทางที่จัดกลุ่มและไม่จัดกลุ่ม */
function ComboBoxItem<V extends string = string>({
  opt,
  selected,
  locked,
  maxItems,
  renderOption,
  onPick,
}: {
  opt: ComboBoxOption<V>;
  selected: V[];
  locked: boolean;
  maxItems?: number;
  renderOption?: (
    option: ComboBoxOption<V>,
    state: OptionRowState,
  ) => React.ReactNode;
  onPick: (v: V) => void;
}) {
  const checked = selected.includes(opt.value);
  const capped = !checked && maxItems != null && selected.length >= maxItems;
  return (
    <CmdkRoot.Item
      value={opt.label}
      disabled={opt.disabled || capped}
      /* ล็อกไว้ยังค้นเจอและอ่านได้ แค่กดไม่ได้ — ใช้ `disabled` ของ cmdk ไม่ได้
       * เพราะมันจะพาแถวหลุดจากการค้นหาและจางจนอ่านไม่ออก */
      aria-disabled={locked || undefined}
      onSelect={() => onPick(opt.value)}
      className={cn(
        "flex items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-body-sm",
        locked ? "cursor-default" : "cursor-pointer",
        "data-[selected=true]:bg-brand-subtle",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      )}
    >
      {renderOption ? (
        renderOption(opt, {
          selected: checked,
          locked,
          disabled: Boolean(opt.disabled) || capped,
        })
      ) : (
        <>
          <span className="flex flex-col">
            <span>{opt.label}</span>
            {opt.description && (
              <span className="text-caption text-text-tertiary">
                {opt.description}
              </span>
            )}
          </span>
          {/* ล็อกไว้โชว์กุญแจแทนเครื่องหมายถูก — ถูกเลือกอยู่แล้วโดยนิยาม
              สิ่งที่ผู้ใช้ต้องรู้คือ "ถอดไม่ได้" ไม่ใช่ "เลือกอยู่" */}
          {locked ? (
            <Lock className="size-3.5 shrink-0 text-text-tertiary" aria-hidden />
          ) : (
            checked && <Check className="size-4 text-text-primary" />
          )}
        </>
      )}
    </CmdkRoot.Item>
  );
}

export { ComboBox };
