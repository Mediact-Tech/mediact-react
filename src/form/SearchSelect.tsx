"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "../lib/cn";
import { Spinner } from "../feedback/Spinner";
import { FloatingFieldShell, fieldShapeClasses, fieldLabelId } from "./FloatingFieldShell";
import type { FieldSize } from "./FloatingFieldShell";

/**
 * ช่องค้นหา-แล้วเลือก **ที่ไม่มี Radix Popover · ไม่มี popper · ไม่มี floating-ui**
 *
 * 🔴🔴 **ทำไมต้องมีตัวนี้ ทั้งที่มี `ComboBox`/`EntityAutocomplete` อยู่แล้ว** (เจ้าของเคาะ 2026-08-20)
 *
 * สองตัวนั้นวางแผงด้วย Radix Popover ซึ่งลากมาสามชั้น — `react-popover` → `react-popper` →
 * `@floating-ui/react-dom` — และวันเดียวเราชนบั๊กของสามชั้นนั้นครบ **ในจอเดียวของ Mediwork**:
 *   ① `Dialog` กับ `Popover` ได้ `react-focus-scope` **คนละก๊อป** — แพ็กเกจนั้นเก็บ stack ของ
 *      focus scope ไว้ **ระดับ module** ⇒ 2 ก๊อป = 2 stack ที่มองไม่เห็นกัน ⇒ `Dialog` ดึงโฟกัสกลับ
 *      จากแผงที่ถูก `Portal` ออกไปนอกกล่อง ⇒ **พิมพ์ไม่ติดเลย** (แผงเปิดสวย ตัวเลือกคลิกได้ ไม่มี error)
 *   ② `react-popper` **1.3.x** มี `setState` ใน cleanup ของ `useLayoutEffect`
 *      (`setPlacementState(void 0)`) ⇒ แผงหนึ่ง unmount ชนกับ mount ในคอมมิตเดียว = วนไม่จบ
 *   ③ `@floating-ui/react-dom` ยิง `setState` ตอน React **ถอด ref** ระหว่างลบ subtree
 *      (`safelyDetachRef` → `_setFloating(null)`) ⇒ `Maximum update depth exceeded`
 *
 * ②③ เป็นบั๊ก **ต้นน้ำ** ที่เราคุมได้แค่เลือกเวอร์ชัน — และตรวจ dist แล้วว่า floating-ui `2.1.9`
 * (ล่าสุด) มีโค้ดตรงจุดนั้น **เหมือน `2.1.8` เป๊ะ** ⇒ ไม่มีเวอร์ชันไหนแก้ให้
 *
 * 🔑 **สิ่งที่ตัวนี้ทำต่างออกไปมีข้อเดียว: แผงอยู่ในต้นไม้ DOM เดิม** (`absolute` ใน `relative` ของ
 * ตัวเอง) ⛔ ไม่ `Portal` ⇒ ไม่มีทั้ง focus scope ข้ามต้นไม้ · ไม่มี popper · ไม่มี floating-ui
 * ⇒ **สามบั๊กข้างบนหมดสิทธิ์เกิดโดยโครงสร้าง ไม่ใช่โดยการเลือกเวอร์ชันให้ถูก**
 * 🔑 หน้าตายังเป็นของ DS ทั้งหมด — ยืม `FloatingFieldShell` · `fieldShapeClasses` ตัวเดียวกับทุกช่อง
 *
 * ⛔ **ไม่แตะ `ComboBox`/`EntityAutocomplete`/`Popover` แม้บรรทัดเดียว** (ข้อบังคับจากเจ้าของ) —
 * ไฟล์นี้เป็นของใหม่ล้วน · จอที่ใช้ของเดิมอยู่ยังทำงานเหมือนเดิมทุกจอ
 *
 * ⚠️ **ราคาที่รับไว้ ต้องรู้ก่อนใช้**
 *   · แผงถูก **clip ได้** ถ้าบรรพบุรุษมี `overflow: hidden`/`overflow: auto` — นี่คือเหตุผลที่
 *     ไลบรารีทั่วโลก portal กัน ⇒ ⛔ อย่าวางในกล่องที่ตัดขอบแล้วสูงไม่พอ · ในโมดัลและแถบขอบเขต
 *     (ที่ที่เราต้องใช้) พื้นที่พอและไม่มีการตัดขอบ
 *   · ไม่มีการพลิกด้านอัตโนมัติแบบ popper — เปิดลงล่างเสมอ · ถ้าจอเตี้ยจริงให้ผู้เรียกจัดที่ให้
 *   · ⛔ ไม่รองรับเลือกหลายอัน (ยังไม่มีที่ใช้) — ต้องการหลายอันให้ใช้ `ComboBox multiple` ตามเดิม
 */
export type SearchSelectProps<T> = {
  /** ป้ายลอยของช่อง */
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  size?: FieldSize;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  hideLabel?: boolean;
  reserveMessageSpace?: boolean;
  /** ป้ายลอยขึ้นค้างเสมอ ไม่ต้องรอโฟกัส/มีค่า */
  alwaysFloatLabel?: boolean;
  id?: string;
  className?: string;
  containerClassName?: string;

  /** ผลค้นหาที่ผู้เรียกไปเอามาเอง — คอมโพเนนต์นี้ไม่ยิง API เอง */
  options: T[];
  /** กำลังค้นหา ⇒ แผงโชว์แถบหมุน (ไม่ใช่ทั้งช่องเป็นโครงร่าง) */
  optionsLoading?: boolean;
  value: T | null;
  onChange: (value: T | null) => void;
  /**
   * ผู้ใช้พิมพ์อะไร — เรียกทุกครั้งที่คำเปลี่ยน **รวมตอนล้างเป็นค่าว่าง**
   * ⛔ ไม่ debounce ที่นี่: ผู้เรียกคือคนที่รู้ว่าหลังบ้านทนได้แค่ไหน (ของ Mediwork หน่วงที่ hook อยู่แล้ว)
   */
  onSearch: (term: string) => void;
  getOptionValue: (option: T) => string;
  getOptionLabel: (option: T) => string;
  /** บรรทัดที่สองของตัวเลือก — อีเมล · บทบาท ฯลฯ */
  getOptionDescription?: (option: T) => string;
  /** ยังพิมพ์ไม่ถึงเกณฑ์ ⇒ ข้อความชวนพิมพ์ต่อ */
  hintText?: string;
  /** ค้นแล้วไม่เจอ */
  emptyText?: string;
  /** จำนวนตัวอักษรที่เริ่มถือว่า "ค้นหาแล้ว" — ต่ำกว่านี้แผงจะโชว์ `hintText` */
  minChars?: number;
  /**
   * มีปุ่มล้างค่า (X) เมื่อเลือกไว้แล้ว
   *
   * 🔴 **ต้องมี ไม่ใช่ของแถม** — ช่องขอบเขต (แผนก/หน่วยงาน) ที่ไม่มีปุ่มนี้ = เลือกไปแล้วกลับไป
   * สถานะ "ยังไม่เลือก" ไม่ได้นอกจากรีโหลดหน้า (เป็นบั๊กที่เจ้าของแจ้งเองเมื่อ 2026-08-19)
   * ⚠️ ค่าเริ่มต้นปิด — จอที่ค่าว่างไม่ใช่สถานะที่ถูกต้อง (เช่นฟอร์มที่บังคับเลือก) ไม่ควรมีปุ่มนี้
   */
  clearable?: boolean;
  /** ป้ายของปุ่มล้าง — ผู้เรียกส่งคำแปลมาเอง (DS ไม่ถือคำแปล) */
  clearLabel?: string;
};

export const SearchSelect = <T,>({
  label,
  placeholder,
  required,
  disabled,
  size = "md",
  hint,
  error,
  hideLabel,
  reserveMessageSpace,
  alwaysFloatLabel,
  id,
  className,
  containerClassName,
  options,
  optionsLoading,
  value,
  onChange,
  onSearch,
  getOptionValue,
  getOptionLabel,
  getOptionDescription,
  hintText,
  emptyText,
  minChars = 0,
  clearable = false,
  clearLabel,
}: SearchSelectProps<T>): React.ReactElement => {
  const reactId = React.useId();
  const fieldId = id ?? reactId;
  const listboxId = `${fieldId}-listbox`;

  const [open, setOpen] = React.useState(false);
  const [term, setTerm] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isSearching = term.trim().length >= minChars && term.trim().length > 0;
  const visible = isSearching || minChars === 0 ? options : [];

  /**
   * ปิดเมื่อผู้ใช้ไปที่อื่น — ฟังที่ `document` เอง
   *
   * 🔑 ใช้ `pointerdown` ⛔ ไม่ใช่ `click` — ต้องปิดก่อนที่ปลายทางจะได้โฟกัส ไม่งั้นคลิกช่องอื่นแล้ว
   * แผงยังค้างทับอยู่ครึ่งจังหวะ · และผูก/ถอดตาม `open` เท่านั้น ⇒ ตอนปิดไม่มี listener ค้างในหน้า
   */
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  /**
   * ปิดแผงด้วย Esc — **ดักที่ `window` แบบ capture** ⛔ ไม่ใช่ `onKeyDown` ของช่อง
   *
   * 🔴🔴 `Dialog` ของ Radix ฟัง `keydown` ที่ `document` ด้วย **`{ capture: true }`**
   * (`use-escape-keydown/dist/index.mjs:12`) ⇒ capture ไล่ `window` → `document` → … → target
   * ⇒ handler ของมัน **ทำงานก่อน** อะไรที่อยู่บน element ของเรา · `stopPropagation` ใน `onKeyDown`
   * จึงสายเกินไป — เทสจับได้ว่าโมดัลปิดตามไปด้วย (ผู้ใช้เสียข้อมูลที่กรอกค้างไว้ทั้งฟอร์ม)
   * 🔑 ทางเดียวที่ชนะคือดักที่ **`window`** ซึ่ง capture ถึงก่อน `document` แล้ว
   * `stopImmediatePropagation()` เพื่อไม่ให้ตัวฟังตัวอื่นบนเส้นทางนั้นได้เห็น
   * 🔑 ผูกเฉพาะ **ตอนแผงเปิด** ⇒ ปิดแผงแล้ว Esc ครั้งถัดไปถึงโมดัลตามปกติ ⛔ ไม่กลืน Esc ของคนอื่นทิ้ง
   */
  React.useEffect(() => {
    if (!open) return;
    const onKeyDownCapture = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(false);
    };
    window.addEventListener("keydown", onKeyDownCapture, true);
    return () => window.removeEventListener("keydown", onKeyDownCapture, true);
  }, [open]);

  const commit = (option: T) => {
    onChange(option);
    setTerm("");
    setOpen(false);
    /* คืนโฟกัสให้ช่องเอง — ไม่มี Radix มาทำให้ ⇒ ต้องทำเอง ไม่งั้นโฟกัสหลุดไปที่ `body`
       แล้วกด Tab ต่อจะเริ่มจากต้นหน้า */
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (visible.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => {
        const next = current + step;
        if (next < 0) return visible.length - 1;
        if (next >= visible.length) return 0;
        return next;
      });
      return;
    }
    if (event.key === "Enter") {
      const option = visible[activeIndex];
      if (open && option) {
        event.preventDefault();
        commit(option);
      }
    }
  };

  /**
   * คำที่โชว์ในช่อง
   *
   * 🔴 **เปิดแผงแล้วยังต้องเห็นค่าที่เลือกอยู่ จนกว่าจะเริ่มพิมพ์** — เดิมเขียน `open ? term : …`
   * ⇒ พอเปิดแผง ช่องกลายเป็นว่างและโชว์ placeholder ทั้งที่มีค่าเลือกไว้แล้ว (เจ้าของเห็นจากจอจริง
   * 2026-08-20: ตัวเลือกมีเครื่องหมายถูกอยู่ แต่ช่องเขียนว่า "เลือกหน่วยงาน") ⇒ อ่านว่ายังไม่ได้เลือก
   * 🔑 เกณฑ์ที่ถูกคือ **"ผู้ใช้เริ่มพิมพ์แล้วหรือยัง"** ไม่ใช่ "แผงเปิดอยู่ไหม"
   */
  const shown = term !== "" ? term : value ? getOptionLabel(value) : "";
  const hasValue = Boolean(value) || term.length > 0;

  return (
    <FloatingFieldShell
      disabled={disabled}
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      reserveMessageSpace={reserveMessageSpace}
      htmlFor={fieldId}
      size={size}
      floating={Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder)}
      focused={open}
      hasError={Boolean(error)}
      containerClassName={containerClassName}
      rightAdornment={
        /* 🔑 ปุ่มล้างแทนลูกศรเมื่อมีค่า **และ** เปิด `clearable` ⛔ ไม่วางซ้อนกันสองอัน —
           ช่องกว้าง 37px ตามดีไซน์ของแถบขอบเขต ใส่สองไอคอนแล้วตัวอักษรจะไปมุดใต้ปุ่ม
           `pointer-events-auto` เพราะ shell ปิด pointer ของ adornment ไว้ (ไม่งั้นมันทับช่อง) */
        clearable && value !== null && !disabled ? (
          <button
            type="button"
            aria-label={clearLabel}
            title={clearLabel}
            /* 🔴 `cursor-pointer` ต้องเขียนเอง — **Tailwind v4 preflight เลิกตั้งให้ `button` แล้ว**
               (v3 ตั้งให้) · ทุกตัวควบคุมของ DS จึงเขียนเองทั้งหมด และตัวที่ลืมจะอ่านเป็น
               ข้อความธรรมดา — เคยเกิดกับ `Tabs`/`Sidebar` มาแล้ว (บันทึกใน CLAUDE.md ของ repo) */
            className="pointer-events-auto flex size-4 cursor-pointer items-center justify-center text-text-tertiary hover:text-text-body"
            onPointerDown={(event) => {
              /* กันไม่ให้ pointer นี้ไปเปิดแผง/ย้ายโฟกัสก่อนที่เราจะล้างค่า */
              event.preventDefault();
              onChange(null);
              setTerm("");
              setOpen(false);
            }}
          >
            <X className="size-4" />
          </button>
        ) : (
          <ChevronsUpDown className="size-4 text-text-tertiary" />
        )
      }
    >
      {/* `relative` คือจุดยึดของแผง — ทั้งหมดอยู่ในต้นไม้เดิม ไม่มี portal */}
      <div ref={rootRef} className="relative w-full">
        <input
          ref={inputRef}
          id={fieldId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-labelledby={label ? fieldLabelId(fieldId) : undefined}
          aria-invalid={Boolean(error) || undefined}
          disabled={disabled}
          placeholder={placeholder}
          value={shown}
          onFocus={() => !disabled && setOpen(true)}
          onClick={() => !disabled && setOpen(true)}
          onChange={(event) => {
            /**
             * 🔴 **ตัวอักษรแรกต้อง *ทับ* ชื่อที่เลือกไว้ ⛔ ไม่ใช่ต่อท้าย**
             *
             * ช่องนี้โชว์ป้ายของค่าที่เลือกอยู่ (ถ้าโชว์ว่างจะอ่านว่า "ยังไม่ได้เลือก" — เจ้าของเห็น
             * จากจอจริง) ⇒ เมื่อผู้ใช้เริ่มพิมพ์ ค่าที่เข้ามาคือ `ชื่อเดิม + ตัวที่พิมพ์` เช่นเลือก
             * `Alicia` แล้วพิมพ์ `b` ได้ `Aliciab` ⇒ **ค้นไม่เจออะไรเลย** และดูเหมือนช่องเสีย
             * ⛔ `select()` ตอนโฟกัสแก้ไม่ได้ — การคลิกยุบ selection ทิ้งทั้งใน jsdom และเบราว์เซอร์จริง
             * 🔑 จึงตัด prefix ที่เป็นชื่อเดิมออกเอง **เฉพาะครั้งแรกที่ยังไม่มีคำค้น**
             * ⚠️ ถ้าผู้ใช้ย้าย caret ไปกลางคำแล้วพิมพ์ จะไม่เข้าเงื่อนไขนี้ (ได้พฤติกรรมต่อท้ายตามเดิม)
             * — ยอมรับ เพราะเป็นทางที่คาดเดาได้ และเคสหลักคือพิมพ์ต่อท้ายทันทีหลังคลิก
             */
            const raw = event.target.value;
            const label = value ? getOptionLabel(value) : "";
            const next = term === "" && label && raw.startsWith(label) ? raw.slice(label.length) : raw;

            setTerm(next);
            setActiveIndex(-1);
            setOpen(true);
            onSearch(next);
          }}
          onKeyDown={handleKeyDown}
          className={cn(fieldShapeClasses({ hasError: Boolean(error), size }), "pr-9", className)}
        />

        {open && (
          /* 🔑 พื้นของแผงใช้ **token** `bg-bg-default` (`#ffffff`) ⛔ ไม่ใช่คลาสสีของ Tailwind ตรง ๆ —
             ด่านกันสีดิบของ repo นี้นับคลาสพวกนั้นและกติกาคือ "ห้ามเพิ่มจำนวน"
             (`tokens.guard.test.ts`) · เป็น token ตัวเดียวกับที่ `DataTable` ใช้เป็นพื้น surface
             ⚠️ ด่านนั้น **สแกนคอมเมนต์ด้วย** ⇒ ห้ามเขียนชื่อคลาสสีดิบไว้ในเนื้อคอมเมนต์เอง
             (เจอจริงตอนเขียนไฟล์นี้: คอมเมนต์ที่อธิบายว่าอย่าใช้ กลายเป็นตัวทำให้ด่านแดง) */
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-sm border border-border-default bg-bg-default p-1 shadow-lg"
          >
            {optionsLoading ? (
              <div className="flex items-center justify-center gap-2 px-3 py-6 text-body-sm text-text-tertiary">
                <Spinner size="sm" />
                {hintText}
              </div>
            ) : visible.length === 0 ? (
              <div className="px-3 py-6 text-center text-body-sm text-text-tertiary">
                {isSearching || minChars === 0 ? emptyText : hintText}
              </div>
            ) : (
              visible.map((option, index) => {
                const key = getOptionValue(option);
                const selected = value !== null && getOptionValue(value) === key;
                const description = getOptionDescription?.(option);
                return (
                  <div
                    key={key}
                    role="option"
                    aria-selected={selected}
                    tabIndex={-1}
                    onPointerDown={(event) => {
                      /* กันไม่ให้ `pointerdown` นี้ถูกอ่านว่า "คลิกข้างนอก" และกันโฟกัสหลุดจากช่อง
                         ⇒ เลือกเสร็จโฟกัสยังอยู่ที่เดิม ไม่กระพริบ */
                      event.preventDefault();
                      commit(option);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-2 rounded-xs px-3 py-2 text-body-sm",
                      index === activeIndex && "bg-overlay-hover",
                      selected && "font-medium",
                    )}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-text-black">{getOptionLabel(option)}</span>
                      {description && <span className="truncate text-caption text-text-tertiary">{description}</span>}
                    </span>
                    {selected && <Check className="size-4 shrink-0 text-brand" />}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </FloatingFieldShell>
  );
};
