import * as React from "react";
import { Command as CmdkRoot } from "cmdk";
import { Check, ChevronsUpDown, Lock, TriangleAlert } from "lucide-react";
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
  OPTION_LIST_CLASS,
  OPTION_PANEL_CLASS,
  OPTION_ROOT_CLASS,
} from "./option-panel";
import { SelectAllRow, type SelectAllProps } from "./select-all";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../overlay/Popover";
import { Chip } from "../ui/Chip";
import { Spinner } from "../feedback/Spinner";

/** `selectAll*` (เฉพาะ `multiple`) มาจาก `form/select-all.tsx` ชุดเดียวกับ `ComboBox` */
type EntityAutocompleteCommonProps<T> = SelectAllProps & {
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
  /**
   * วาด chip "+N" เอง — ได้จำนวนที่ยุบไว้ และตัวที่ถูกยุบ (เอาไปทำ tooltip รายชื่อได้)
   *
   * มีไว้คู่กับ `renderChip` — แอปที่วาด chip เองด้วย library อื่น (เช่น MUI ใน Mediwork) จะได้
   * "+N" หน้าตาเดียวกับ chip ข้าง ๆ · ไม่ส่ง = `Chip` โทน `neutral` ของ DS ตามเดิม
   * (เดิมวาดเองไม่ได้ ⇒ วัดบน Mediwork ได้ chip รายชื่อพื้นเทาไม่มีกรอบ ต่อด้วย "+12" พื้นขาวมีกรอบ)
   */
  renderOverflowChip?: (count: number, hidden: T[]) => React.ReactNode;
  /** Cap selection in multi mode. */
  maxItems?: number;

  /**
   * พิมพ์ค้น **ในตัวช่องเอง** โดย chip ที่เลือกไว้อยู่ในช่องเดียวกัน (เฉพาะ `multiple`)
   *
   * ปิดเป็นค่าเริ่มต้น — เปิดแล้วโครงของช่องเปลี่ยนจาก `<div role="combobox">` ที่กดเปิดแผง
   * เป็นกล่องที่มี `<input>` อยู่ข้างใน (โฟกัส · screen reader · การเลือกข้อความเปลี่ยนตาม)
   * ⇒ ไม่เปลี่ยนให้ผู้เรียกเดิมโดยไม่มีใครสั่ง · โหมดเลือกอันเดียวไม่มีผล
   *
   * ที่มา: ช่องเลือกทีมผ่าตัดของ Mediwork (Figma D2) — ไอคอนแว่นขยาย + chip ของคนที่เลือกแล้ว
   * + ช่องพิมพ์ชื่ออยู่ในกล่องเดียวกัน แผงข้างล่างมีแต่รายชื่อ · `ComboBox typeahead` ทำได้เฉพาะโหมดเดี่ยว
   *
   * 🔴 ใช้กลไกเดียวกับ `ComboBox typeahead` (`PopoverAnchor` + cmdk ครอบทั้งช่องและแผง · ตัวกัน
   * `Maximum update depth` ตอนมีหลายช่องวางข้างกัน) — ห้ามแก้ที่ใดที่หนึ่งโดยไม่ดูอีกที่
   */
  typeahead?: boolean;
  /**
   * ไอคอนหน้าช่อง (เช่น แว่นขยาย) — วาดที่ `leftAdornment` ของ shell · ป้ายที่ยังไม่ลอยขยับขวาตาม
   * ใช้ได้ทั้งโหมดปกติและ `typeahead`
   */
  leadingIcon?: React.ReactNode;
  /**
   * บรรทัดท้ายแผง (พื้นเทาอ่อน ตัวเล็ก) — เช่น "แสดง 4 จาก 38 แพทย์ · พิมพ์ชื่อเพื่อค้นหา"
   * อยู่ใต้ลิสต์และใต้ footer จำนวนที่เลือก (ถ้ามี) ไม่เลื่อนไปกับลิสต์
   */
  listFooter?: React.ReactNode;
  /**
   * footer "จำนวนที่เลือก · ล้าง" ของโหมด `multiple` — ค่าตั้งต้น `true`
   *
   * ส่ง `false` เมื่อดีไซน์ไม่มีแถบนี้ (ทีมผ่าตัด: chip ในช่องบอกอยู่แล้วว่าเลือกใครบ้าง และ
   * ข้อความในแถบนี้เป็นภาษาอังกฤษตายตัว ⇒ ไม่ควรโผล่ในจอภาษาไทย)
   */
  selectionFooter?: boolean;
  /**
   * class เพิ่มของแผง (`PopoverContent`) — รวมกับค่าตั้งต้นด้วย `cn` จึงทับได้
   * ค่าตั้งต้นกว้างเท่าช่อง · ใส่ `min-w-[22rem]` เมื่อช่องแคบกว่าแถวรายชื่อที่ต้องอ่าน (Figma D2)
   */
  panelClassName?: string;
};

export type EntityAutocompleteSingleProps<T> =
  EntityAutocompleteCommonProps<T> & {
    multiple?: false;
    value?: T | null;
    defaultValue?: T;
    onChange?: (value: T | null) => void;
  };

export type EntityAutocompleteMultiProps<T> =
  EntityAutocompleteCommonProps<T> & {
    multiple: true;
    value?: T[];
    defaultValue?: T[];
    onChange?: (value: T[]) => void;
  };

export type EntityAutocompleteProps<T> =
  | EntityAutocompleteSingleProps<T>
  | EntityAutocompleteMultiProps<T>;

const minHeights: Record<FieldSize, string> = {
  sm: "min-h-9",
  md: "min-h-11",
  lg: "min-h-12",
};

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
function EntityAutocomplete<T>(props: EntityAutocompleteProps<T>) {
  const {
    id,
    label,
    hint,
    error,
    required,
    hideLabel,
    reserveMessageSpace,
    alwaysFloatLabel,
    placeholder,
    searchPlaceholder = "Search...",
    emptyText = "No results found.",
    searchError,
    disabled,
    size = "md",
    className,
    containerClassName,
    options,
    onSearch,
    debounceMs = 300,
    optionsLoading,
    isLoading,
    loadingText = "Loading...",
    getOptionValue,
    getOptionLabel,
    getOptionDescription,
    renderOption,
    renderChip,
    renderOverflowChip,
    isOptionLocked,
    groupBy,
    groupOrder,
    maxVisibleChips = 3,
    maxItems,
    typeahead,
    leadingIcon,
    listFooter,
    selectionFooter = true,
    panelClassName,
    selectAll,
    selectAllLabel,
    selectAllMatchesLabel,
    selectAllMaxLabel,
    multiple,
    value,
    defaultValue,
    onChange,
  } = props;

  const isMultiple = multiple === true;

  const reactId = React.useId();
  const triggerId = id ?? reactId;
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  /* ของโหมด `typeahead` — กล่องช่องกับ input ต้องอ้างถึงได้จากตัวจัดการ "คลิกข้างนอก" ของแผง */
  const boxRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  /* แผงปิดเพราะผู้ใช้ไปคลิก/โฟกัสที่อื่น ⛔ ไม่ใช่เพราะเลือกหรือกด Esc — เหตุผลเต็มที่ `ComboBox`
   * (`closedByOutsideRef`): ช่องที่เปิดแผงตอนได้โฟกัสแล้ว Radix คืนโฟกัสให้ตอนปิด วนไม่จบเมื่อมีสองช่องข้างกัน */
  const closedByOutsideRef = React.useRef(false);
  /* Esc ที่ปิดแผงของช่อง `typeahead` ต้องไม่ลอยไปปิด dialog รอบข้าง — ดู effect ข้างล่าง */
  const openRef = React.useRef(false);
  const escapeOwnedRef = React.useRef(false);
  React.useEffect(() => {
    openRef.current = open;
  }, [open]);
  React.useEffect(() => {
    if (!typeahead || !multiple) return;
    /* 🔴 ต้องเป็น native listener ที่ `document` ช่วง capture และลงทะเบียน**ก่อน** Radix (ลงทะเบียนตอนแผงเปิด)
     * ⇒ จับได้ว่า "ตอนกด Esc แผงเปิดอยู่" ก่อนที่ Radix จะปิดมัน
     * ที่อ่านจาก state ใน `onKeyDown` ของ React ไม่ได้: Radix ปิดแผงใน native handler แล้ว React flush render
     * ใน microtask ซึ่งคั่นกลางระหว่าง native handler กับ React `onKeyDown` ⇒ เห็น `open=false` เสมอ
     * ⇒ Esc ลอยต่อไปหา MUI `Dialog` ที่ฟัง Esc ที่ราก แล้วปิดทั้งฟอร์ม (วัดบน Mediwork ฟอร์มจองห้องผ่าตัด) */
    const arm = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !openRef.current) return;
      if (!boxRef.current?.contains(document.activeElement)) return;
      escapeOwnedRef.current = true;
      setTimeout(() => {
        escapeOwnedRef.current = false;
      }, 0);
    };
    document.addEventListener("keydown", arm, true);
    return () => document.removeEventListener("keydown", arm, true);
  }, [typeahead, multiple]);

  const keyOf = React.useCallback(
    (item: T) => String(getOptionValue(item)),
    [getOptionValue],
  );

  const [internalItems, setInternalItems] = React.useState<T[]>(() => {
    if (isMultiple) return (defaultValue as T[] | undefined) ?? [];
    return defaultValue !== undefined ? [defaultValue as T] : [];
  });

  const isControlled = value !== undefined;
  const controlledItems = React.useMemo<T[] | undefined>(() => {
    if (!isControlled) return undefined;
    if (isMultiple) return (value as T[] | undefined) ?? [];
    return value != null ? [value as T] : [];
  }, [isControlled, isMultiple, value]);

  const selectedItems = controlledItems ?? internalItems;

  const setSelectedItems = (next: T[]) => {
    if (!isControlled) setInternalItems(next);
    if (isMultiple) {
      (onChange as ((v: T[]) => void) | undefined)?.(next);
    } else {
      (onChange as ((v: T | null) => void) | undefined)?.(next[0] ?? null);
    }
  };

  /* ล็อกมีผลเฉพาะโหมดเลือกหลายอัน — โหมดเลือกอันเดียว การเลือกทับคือการ
   * *เปลี่ยนค่า* ไม่ใช่การถอดออก ล็อกไว้จะกลายเป็นช่องที่แก้ไม่ได้เลย */
  const lockedOf = React.useCallback(
    (item: T) => (isMultiple && isOptionLocked ? isOptionLocked(item) : false),
    [isMultiple, isOptionLocked],
  );

  const selectItem = (item: T) => {
    const k = keyOf(item);
    if (isMultiple) {
      if (lockedOf(item)) return; // ถอดออกจากลิสต์ไม่ได้
      const exists = selectedItems.some((i) => keyOf(i) === k);
      if (exists) {
        setSelectedItems(selectedItems.filter((i) => keyOf(i) !== k));
      } else {
        if (maxItems != null && selectedItems.length >= maxItems) return;
        setSelectedItems([...selectedItems, item]);
        /* พิมพ์ค้นในช่องแล้วเลือก = จบการค้นหานั้น — ล้างคำที่พิมพ์ให้ลิสต์กลับเป็นทั้งหมด
         * และคืนโฟกัสให้ช่อง: คลิกแถวในแผงย้ายโฟกัสไปที่แผง ⇒ พิมพ์คนต่อไปไม่ได้จนกว่าจะคลิกช่องซ้ำ */
        if (typeahead) {
          setQuery("");
          inputRef.current?.focus();
        }
      }
    } else {
      const isSame =
        selectedItems[0] != null && keyOf(selectedItems[0]) === k;
      setSelectedItems(isSame ? [] : [item]);
      setOpen(false);
    }
  };

  const removeItem = (item: T) => {
    if (lockedOf(item)) return; // ถอดออกจาก chip ไม่ได้
    const k = keyOf(item);
    setSelectedItems(selectedItems.filter((i) => keyOf(i) !== k));
  };

  /* ปุ่มล้างทั้งหมดต้องเก็บตัวที่ล็อกไว้ — ล้างหมดจริงคือทางลัดที่ทำให้
   * ด่านอีกสองทางไม่มีความหมาย */
  const clearAll = () => setSelectedItems(selectedItems.filter(lockedOf));

  const hasError = Boolean(error);
  const hasValue = selectedItems.length > 0;
  const floating =
    Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);

  // Debounced onSearch — fires while the popover is open, on every query
  // change (plus once right after opening, since `query` starts at ""), so
  // callers can show an initial/recent result set. Keeps the latest
  // `onSearch` in a ref so a fresh inline callback each render doesn't reset
  // the debounce timer.
  const onSearchRef = React.useRef(onSearch);
  React.useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  React.useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onSearchRef.current(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, open, debounceMs]);

  const visible = selectedItems.slice(0, maxVisibleChips);
  const overflow = selectedItems.length - visible.length;

  /* ไม่ส่ง `groupBy` = ก้อนเดียวไม่มีหัวข้อ ⇒ ข้างล่างมีทางวาดเดียว ไม่ใช่สองทาง */
  const renderGroups = React.useMemo<OptionGroup<T>[]>(
    () =>
      groupBy
        ? groupItems(options, groupBy, groupOrder)
        : [{ heading: null, items: options }],
    [options, groupBy, groupOrder],
  );

  const renderRow = (item: T) => {
    const k = keyOf(item);
    const checked = selectedItems.some((i) => keyOf(i) === k);
    const capped =
      isMultiple && !checked && maxItems != null && selectedItems.length >= maxItems;
    const locked = lockedOf(item);
    return (
      <CmdkRoot.Item
        key={k}
        value={k}
        disabled={capped}
        /* ล็อกไว้ยังค้นเจอและอ่านได้ แค่กดไม่ได้ — ใช้ `disabled` ของ cmdk ไม่ได้
         * เพราะมันจะพาแถวหลุดจากการค้นหาและจางจนอ่านไม่ออก */
        aria-disabled={locked || undefined}
        onSelect={() => selectItem(item)}
        className={cn(
          "flex items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-body-sm",
          locked ? "cursor-default" : "cursor-pointer",
          "data-[selected=true]:bg-brand-subtle",
          "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        )}
      >
        {renderOption ? (
          renderOption(item, {
            selected: checked,
            locked,
            disabled: capped,
          })
        ) : (
          <>
            <span className="flex flex-col">
              <span>{getOptionLabel(item)}</span>
              {getOptionDescription && (
                <span className="text-caption text-text-tertiary">
                  {getOptionDescription(item)}
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
  };

  /* chip ของตัวที่เลือกไว้ + "+N" — ใช้ร่วมกันทั้งช่องปกติและ `typeahead` */
  const chipNodes = (
    <>
      {visible.map((item) => {
        const k = keyOf(item);
        const locked = lockedOf(item);
        if (renderChip) {
          return (
            <React.Fragment key={k}>
              {renderChip(item, {
                locked,
                onRemove: locked
                  ? undefined
                  : (e) => {
                      e.stopPropagation();
                      removeItem(item);
                    },
              })}
            </React.Fragment>
          );
        }
        return (
          <Chip
            key={k}
            size="sm"
            /* ล็อกไว้ = สีต่างจากที่เลือกเอง — ไม่งั้นผู้ใช้เห็นแค่
             * chip ที่ไม่มีปุ่ม × แล้วนึกว่าจอเสีย */
            variant={locked ? "neutral" : "primary"}
            removable={!locked}
            onRemove={(e) => {
              e.stopPropagation();
              removeItem(item);
            }}
          >
            <span className="inline-flex items-center gap-1">
              {locked && (
                <Lock className="size-3 shrink-0" aria-hidden />
              )}
              {getOptionLabel(item)}
            </span>
          </Chip>
        );
      })}
      {overflow > 0 &&
        (renderOverflowChip ? (
          renderOverflowChip(overflow, selectedItems.slice(visible.length))
        ) : (
          <Chip size="sm" variant="neutral">
            +{overflow}
          </Chip>
        ))}
    </>
  );

  /* หลังบ้านกรองมาแล้ว ⇒ ตัวที่มองเห็นคือ `options` ตามที่ได้มา · ตัดเฉพาะตัวที่ล็อก
   * กำลังโหลด / ค้นพัง ⇒ ลิสต์ไม่ได้โชว์ `options` อยู่ ⇒ ไม่มีเป้าหมาย */
  const selectAllRow = isMultiple && (
    <SelectAllRow
      selectAll={selectAll}
      selectAllLabel={selectAllLabel}
      selectAllMatchesLabel={selectAllMatchesLabel}
      selectAllMaxLabel={selectAllMaxLabel}
      targets={
        optionsLoading || searchError ? [] : options.filter((o) => !lockedOf(o))
      }
      selected={selectedItems}
      keyOf={keyOf}
      maxItems={maxItems}
      searching={query !== ""}
      onChange={setSelectedItems}
    />
  );

  /* ลิสต์ในแผง (เลือกทั้งหมด · แถว · footer) — ใช้ร่วมกันทั้งช่องปกติและ `typeahead` */
  const panelList = (
    <>
      {selectAllRow}
      <CmdkRoot.List className={OPTION_LIST_CLASS}>
        {optionsLoading ? (
          <CmdkRoot.Loading className="flex items-center justify-center gap-2 px-3 py-6 text-body-sm text-text-tertiary">
            <Spinner size="sm" />
            {loadingText}
          </CmdkRoot.Loading>
        ) : searchError ? (
          <div className="flex items-center justify-center gap-2 px-3 py-6 text-center text-body-sm text-cherry-red-600">
            <TriangleAlert className="size-4 shrink-0" />
            {searchError}
          </div>
        ) : (
          <>
            <CmdkRoot.Empty className="px-3 py-6 text-center text-body-sm text-text-tertiary">
              {emptyText}
            </CmdkRoot.Empty>
            {renderGroups.map((g) => {
              const rows = g.items.map(renderRow);
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
      {isMultiple && selectionFooter && selectedItems.length > 0 && (
        <div className="flex items-center justify-between border-t border-border-default px-2 py-1.5 text-caption">
          <span className="text-text-tertiary">
            {selectedItems.length} selected
            {maxItems != null && ` / ${maxItems}`}
          </span>
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-cherry-red-600 hover:bg-cherry-red-50"
          >
            Clear
          </button>
        </div>
      )}
      {listFooter && (
        <div className="border-t border-border-default bg-bg-surface px-3 py-2 text-caption text-text-tertiary">
          {listFooter}
        </div>
      )}
    </>
  );

  /* โครงร่างใช้ shell ตัวเดียวกับของจริง ⇒ สูงเท่ากันโดยโครงสร้าง
   * ⚠️ ต้องอยู่ **หลัง** hook ทุกตัวข้างบน — return ก่อนจะทำให้จำนวน hook ต่างกันระหว่าง render */
  if (isLoading) {
    return (
      <FieldSkeleton
        label={label}
        hint={hint}
        required={required}
        hideLabel={hideLabel}
        size={size}
        containerClassName={containerClassName}
      />
    );
  }

  /* พิมพ์ค้นในช่อง (เฉพาะ `multiple`) — โครงเดียวกับ `ComboBox typeahead`:
   * cmdk ครอบทั้งช่องและแผง (`contents` = ไม่สร้างกล่องเพิ่มให้ผู้เรียก) · ช่องเป็น `PopoverAnchor`
   * ไม่ใช่ `PopoverTrigger` (trigger จะกลืนการพิมพ์ไปสลับเปิด/ปิดแผง) */
  if (typeahead && isMultiple) {
    const insideField = (target: EventTarget | null) =>
      boxRef.current?.contains(target as Node) ?? false;
    const lastRemovable = [...selectedItems].reverse().find((i) => !lockedOf(i));
    return (
      /* 🔴 ชื่อของช่องสำหรับ screen reader มาจาก `label` ของ `Command` เท่านั้น — cmdk บังคับ `id` และ
       * `aria-labelledby` ของ `Command.Input` เองทับของที่ส่งเข้าไป (ชี้ไปป้ายว่างของ Command) ⇒ ไม่ส่ง `label`
       * ช่องจะไม่มีชื่อเลย · ป้ายที่ไม่ใช่ข้อความล้วน (ReactNode) บอก screen reader ผ่านทางนี้ไม่ได้ */
      <CmdkRoot
        shouldFilter={false}
        label={typeof label === "string" ? label : undefined}
        className="contents"
      >
        <Popover
          open={open}
          onOpenChange={(next) => {
            if (disabled) return;
            setOpen(next);
            // ปิดแล้วไม่ค้างคำที่พิมพ์ทิ้งไว้
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
            reserveMessageSpace={reserveMessageSpace}
            htmlFor={triggerId}
            size={size}
            floating={floating}
            focused={open}
            hasError={hasError}
            containerClassName={containerClassName}
            leftAdornment={leadingIcon}
            rightAdornment={<ChevronsUpDown />}
          >
            <PopoverAnchor asChild>
              <div
                ref={boxRef}
                aria-disabled={disabled || undefined}
                onClick={() => !disabled && inputRef.current?.focus()}
                className={cn(
                  "flex w-full flex-wrap items-center gap-1.5 rounded-sm border bg-bg-default py-1.5 pr-9 font-medium transition-colors cursor-text",
                  leadingIcon ? "pl-9" : "pl-3",
                  "focus-within:ring-1",
                  "aria-disabled:cursor-not-allowed aria-disabled:bg-bg-surface",
                  minHeights[size],
                  hasError
                    ? "border-cherry-red-600 focus-within:border-cherry-red-600 focus-within:ring-cherry-red-600/40"
                    : "border-border-strong focus-within:border-brand focus-within:ring-brand/30",
                  className,
                )}
              >
                {chipNodes}
                <CmdkRoot.Input
                  ref={inputRef}
                  id={triggerId}
                  disabled={disabled}
                  placeholder={floating ? placeholder : undefined}
                  aria-invalid={hasError || undefined}
                  /* ปิดอยู่ = ว่าง (chip บอกสิ่งที่เลือก) · เปิดอยู่ = สิ่งที่พิมพ์ */
                  value={open ? query : ""}
                  onValueChange={(v) => {
                    setQuery(v);
                    if (!open) setOpen(true);
                  }}
                  onFocus={() => !disabled && setOpen(true)}
                  /* `onClick` ⛔ ไม่ใช่ `onMouseDown` — เหตุผลเดียวกับ `ComboBox` (Radix popper unmount ชนกับ mount) */
                  onClick={() => !disabled && setOpen(true)}
                  onKeyDown={(e) => {
                    /* Esc ตอนแผงเปิด = ปิดแผงเท่านั้น (Radix ปิดให้เองที่ document) — ห้ามให้ลอยต่อขึ้นไปหา
                     * พ่อแม่ ไม่งั้น dialog รอบข้าง (MUI `Dialog` ของ Mediwork ฟัง Esc ที่ราก) ปิดตามทั้งฟอร์ม
                     * แล้วคนที่แค่ปิดรายชื่อเจอกล่อง "ทิ้งข้อมูลที่กรอกไว้?" · แผงปิดอยู่ = ปล่อยผ่านตามปกติ */
                    if (e.key === "Escape" && escapeOwnedRef.current) {
                      e.stopPropagation();
                    }
                    // ลบที่ช่องว่าง = ถอด chip สุดท้าย (ตัวที่ล็อกไม่ถอด)
                    if (e.key === "Backspace" && query === "" && lastRemovable) {
                      removeItem(lastRemovable);
                    }
                  }}
                  className="min-w-[8rem] flex-1 bg-transparent text-body-sm outline-none placeholder:text-text-tertiary disabled:cursor-not-allowed"
                />
              </div>
            </PopoverAnchor>
          </FloatingFieldShell>

          <PopoverContent
            className={cn(OPTION_PANEL_CLASS, panelClassName)}
            align="start"
            /* โฟกัสต้องอยู่ที่ช่องต่อไป ไม่งั้นพิมพ์ตัวที่สองไม่ได้ */
            onOpenAutoFocus={(e) => e.preventDefault()}
            /* ช่องอยู่นอกแผงในสายตาของ Radix (เป็น anchor) ⇒ กดที่ช่องถูกนับเป็น "คลิกข้างนอก"
             * แล้วปิดแผงทันทีที่เพิ่งเปิด — ปล่อยผ่านเฉพาะเหตุการณ์บนตัวช่องเอง */
            onPointerDownOutside={(e) => {
              if (insideField(e.target)) {
                e.preventDefault();
                return;
              }
              closedByOutsideRef.current = true;
            }}
            onFocusOutside={(e) => {
              if (insideField(e.target)) {
                e.preventDefault();
                return;
              }
              closedByOutsideRef.current = true;
            }}
            /* ปิดเพราะผู้ใช้ไปที่อื่นแล้ว = ห้ามแย่งโฟกัสกลับ (วนไม่จบกับ `onFocus` ที่สั่งเปิดแผง) */
            onCloseAutoFocus={(e) => {
              if (!closedByOutsideRef.current) return;
              closedByOutsideRef.current = false;
              e.preventDefault();
            }}
          >
            <div className={OPTION_ROOT_CLASS}>{panelList}</div>
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
      reserveMessageSpace={reserveMessageSpace}
      htmlFor={triggerId}
      size={size}
      floating={floating}
      focused={open}
      hasError={hasError}
      containerClassName={containerClassName}
      leftAdornment={leadingIcon}
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
          {isMultiple ? (
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
                "flex w-full items-center gap-1.5 rounded-sm border bg-bg-default px-3 py-1.5 pr-9 font-medium transition-colors cursor-pointer",
                leadingIcon && "pl-9",
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
                {selectedItems.length === 0 ? (
                  <span className="text-body-sm text-text-tertiary">
                    {floating ? placeholder ?? "" : ""}
                  </span>
                ) : (
                  chipNodes
                )}
              </span>
            </div>
          ) : (
            <button
              id={triggerId}
              type="button"
              disabled={disabled}
              aria-invalid={hasError || undefined}
              aria-expanded={open}
              className={cn(
                fieldShapeClasses({ hasError, size }),
                "flex items-center text-left pr-9",
                !selectedItems[0] && "text-text-tertiary",
                className,
              )}
            >
              <span className="truncate">
                {selectedItems[0]
                  ? getOptionLabel(selectedItems[0])
                  : floating
                    ? placeholder ?? ""
                    : ""}
              </span>
            </button>
          )}
        </PopoverTrigger>
        <PopoverContent
          className={cn(OPTION_PANEL_CLASS, panelClassName)}
          align="start"
        >
          {/* Options come from the caller's own search (`onSearch`) — cmdk
              must not re-filter an already server-filtered result set. */}
          <CmdkRoot shouldFilter={false} className={OPTION_ROOT_CLASS}>
            <CmdkRoot.Input
              value={query}
              onValueChange={setQuery}
              placeholder={searchPlaceholder}
              className="border-b border-border-default px-3 py-2 text-body-sm outline-none placeholder:text-text-tertiary"
            />
            {panelList}
          </CmdkRoot>
        </PopoverContent>
      </Popover>
    </FloatingFieldShell>
  );
}

export { EntityAutocomplete };
