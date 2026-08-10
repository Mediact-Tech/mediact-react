import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* 📐 วัดจาก Portal `/metrics-settings` (2026-08-11 · computed style ในเบราว์เซอร์จริง)
 *
 * | จุด | วัดได้ | คลาสเดิมของ Portal | ที่ใช้ที่นี่ |
 * |---|---|---|---|
 * | กรอบนอก | `#b9c2cb` 1px · radius 4 | border `gray-300` + `rounded-sm` | `border-border-input` — **ค่าตรงเป๊ะ** |
 * | เส้นคั่นสองข้างช่องตัวเลข | `#e5e7eb` | border `gray-200` | `border-border-default` — **ค่าตรงเป๊ะ** |
 * | ตัวเลข | `#3f454a` · 14px | `text-text-secondary` | เหมือนเดิม |
 * | ปุ่ม −/+ | `lab(47.78 -0.39 -10.03)` ≈ `#6a7282` · 16px · pad 6/8 | text `gray-500` | `text-text-body` (`#535a61`) |
 * | ทั้งกล่อง | 88.31×38 · ปุ่ม 21×36 · ช่องตัวเลข 40×32 | | เท่าเดิม |
 *
 * 🔴 สีเทาขั้น 500 ที่วัดได้เป็นสีของ **Tailwind** ไม่ใช่ของ DS — `theme.css` ประกาศ
 * `gray-300/700/800` ไว้แต่ **ไม่ได้ประกาศ 500** ⇒ คลาสเดียวกันให้คนละสีขึ้นกับว่าใครประกาศขั้นนั้น
 * (กับดักเดียวกับที่ `TopNav` เจอ · เขียนชื่อคลาสเต็มในคอมเมนต์ไม่ได้ด้วย —
 *  ด่าน `tokens.guard.test.ts` สแกน **ซอร์สดิบ รวมคอมเมนต์** จึงนับว่าเป็นสีดิบ) · เลี่ยงทั้งตระกูลโดยใช้ token จริง — `text-text-body` เข้มกว่า
 * ของเดิมนิดหน่อยแต่คงที่ทุกแอป ตัดสินใจแบบเดียวกับปุ่มไอคอนใน `TopNav`
 */

const numberStepperVariants = cva(
  "flex items-center rounded-sm border transition-colors",
  {
    variants: {
      invalid: {
        true: "border-danger-default",
        false: "border-border-input",
      },
      fullWidth: {
        /* min-w-0 ต้องมีทุกชั้นของ flex ที่ซ้อนกัน ไม่ใช่แค่ชั้นในสุด — `min-width:auto`
           ทำให้กล่องนี้ยึดความกว้างในตัวของ `<input>` เป็นพื้น ⇒ พอคอลัมน์แคบลง
           (เช่นกางรางเมนู) ปุ่ม −/+ จะทะลุขอบการ์ดแทนที่จะหดตาม */
        true: "min-w-0 flex-1",
        false: "",
      },
      disabled: {
        true: "opacity-60",
        false: "",
      },
    },
    defaultVariants: { invalid: false, fullWidth: false, disabled: false },
  },
);

/* cursor-pointer เขียนตรง ๆ: preflight ของ Tailwind v4 ปล่อยปุ่มไว้ที่ลูกศรปกติ
   ไม่ได้แถมมาให้เหมือน v3 */
const stepButtonClass =
  "cursor-pointer px-2 py-1.5 text-text-body transition-colors hover:text-text-secondary disabled:cursor-not-allowed disabled:text-text-muted";

export type NumberStepperProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "type" | "size"
> &
  Pick<VariantProps<typeof numberStepperVariants>, "fullWidth"> & {
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
    labels?: { decrease: string; increase: string };
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
const NumberStepper = React.forwardRef<HTMLInputElement, NumberStepperProps>(
  function NumberStepper(
    {
      value,
      onChange,
      step = 1,
      min,
      max,
      precision = 0,
      invalid = false,
      fullWidth = false,
      disabled,
      labels = { decrease: "Decrease", increase: "Increase" },
      className,
      inputClassName,
      ...props
    },
    ref,
  ) {
    const applyStep = (direction: 1 | -1) => {
      const current = Number(value);
      /* ข้อความที่อ่านเป็นตัวเลขไม่ได้เลย (เช่น "." หรือ "-") เริ่มนับจาก `min`
         ⚠️ ช่อง**ว่าง**ไม่เข้าทางนี้ — `Number("")` คือ 0 ไม่ใช่ NaN จึงเดินจาก 0
         แล้วโดน clamp ขึ้นมาที่ `min` พอดี ⇒ กดเพิ่มจากช่องว่างได้ค่าต่ำสุดที่กรอกได้ */
      const base = Number.isFinite(current) ? current : min;
      const next = Math.min(max, Math.max(min, base + direction * step));
      onChange(next.toFixed(precision).replace(/\.0+$/, ""));
    };

    return (
      <div
        className={cn(
          numberStepperVariants({ invalid, fullWidth, disabled: !!disabled }),
          className,
        )}
      >
        <button
          type="button"
          aria-label={labels.decrease}
          className={stepButtonClass}
          onClick={() => applyStep(-1)}
          disabled={disabled}
        >
          &minus;
        </button>
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          /* `<input>` ที่ไม่ระบุ `size` รายงานความกว้างในตัวประมาณ 20 ตัวอักษร ซึ่งกลายเป็น
             พื้นความกว้างของทุก flex ที่ห่อมัน · ช่องพวกนี้ใส่กัน 2-3 หลัก จึงกดลงต่ำสุด
             แล้วปล่อยความกว้างที่เห็นให้คลาสด้านล่างคุมทั้งหมด */
          size={1}
          className={cn(
            "border-border-default text-text-secondary border-x py-1.5 text-center text-sm outline-none",
            "disabled:bg-bg-surface disabled:cursor-not-allowed",
            /* w-10 ในโหมดพอดีเนื้อหา: ค่าที่ใส่ยาวสุดคือ 2 หลักหรือ "4.5" ถ้ากว้างกว่านี้
               พอมี 5 ช่องเรียงกันที่ 1024px ตัวควบคุมจะล้นการ์ด */
            fullWidth ? "min-w-0 flex-1" : "w-10",
            inputClassName,
          )}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          {...props}
        />
        <button
          type="button"
          aria-label={labels.increase}
          className={stepButtonClass}
          onClick={() => applyStep(1)}
          disabled={disabled}
        >
          +
        </button>
      </div>
    );
  },
);

export { NumberStepper, numberStepperVariants };
