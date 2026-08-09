import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { SkeletonBox } from "../feedback/Skeleton";

/* ────────────────────────────────────────────────────────────────────────────
 * รูปทรงของปุ่มยึดจาก 2 แหล่งที่ตรงกันเอง — Figma (`shadcn/ui Button` ใน
 * MEDIACT — HR · Lo-fi Wireframes) และปุ่มที่ render จริงบน MediHR วันนี้
 * วัดจากจอด้วย Playwright: radius 6px · น้ำหนัก 500 · gap 4px · px-3 py-2
 *
 * ก่อนหน้านี้ตัวนี้เป็น radius 4px / น้ำหนัก 600 / gap 8px / padding ผูกกับ size
 * ซึ่งไม่ตรงกับทั้งสองแหล่ง — และไม่มีแอปไหนเรียกใช้เลย (import = 0/4 แอป)
 * จึงแก้ให้ตรงได้โดยไม่กระทบใคร
 *
 * 📌 `text-body-sm` / `font-medium` / `gap-1` อยู่ที่ base ไม่ผูกกับ size โดยตั้งใจ
 * size คุมแค่ความสูงกับขนาดไอคอน — โครงเดียวกับ `AddButton` ของ DS และ Button
 * ของ hr-web ที่คอมเมนต์เหตุผลไว้ว่าระยะไอคอน→ข้อความต้องเท่ากันทุกขนาด
 * ──────────────────────────────────────────────────────────────────────────── */
const buttonVariants = cva(
  // `rounded-md` ยังตรงกับ SolidButton / OutlineButton / AddButton เหมือนเดิม — ปุ่มทุกตัวใน DS
  // ใช้รัศมีมุมเดียวกัน (ข้อสรุปเดิมจาก main ยังอยู่ครบ ไม่ได้ถูกกลืนตอน merge)
  "inline-flex items-center justify-center gap-1 whitespace-nowrap text-body-sm font-medium transition-all rounded-md cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-foreground shadow-xs hover:bg-brand-hover",
        secondary:
          "border border-brand text-brand bg-bg-default shadow-xs hover:bg-brand-subtle",
        ghost: "bg-transparent shadow-none hover:bg-bg-subtle",
        /** ฟ้ากลาง ไม่ใช่สีแบรนด์ — 20 จุดในแอปจริงเรียก variant ชื่อนี้ */
        info: "bg-info-blue-primary text-white shadow-sm hover:bg-info-blue-primary-hover",
        destructive:
          "bg-cherry-red-600 text-white shadow-xs hover:bg-cherry-red-800",
        success:
          "bg-success-green-primary text-white shadow-sm hover:bg-success-green-primary-hover",
        warning: "bg-warning-normal text-white shadow-sm hover:bg-warning-hover",
      },
      /** คุมความสูงกับขนาดไอคอนเท่านั้น — padding เท่ากันทุกขนาดตามของจริง */
      size: {
        xs: "h-7 px-3 py-2 [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 px-3 py-2 [&_svg:not([class*='size-'])]:size-4",
        md: "h-9 px-3 py-2 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 px-3 py-2 [&_svg:not([class*='size-'])]:size-5",
        xl: "h-12 px-3 py-2 [&_svg:not([class*='size-'])]:size-6",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
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

const Spinner = () => (
  <svg
    className="size-4 animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      opacity="0.25"
    />
    <path
      fill="currentColor"
      d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
    />
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    /* โครงร่างสวมรูปทรงของปุ่มเอง และ **ยังพกเนื้อหาเดิมไว้ข้างใน** (ซ่อนด้วย
     * visibility) ⇒ กว้างเท่าปุ่มจริงเป๊ะ ไม่ใช่หดเหลือแค่ padding */
    if (isLoading) {
      return (
        <SkeletonBox
          shape={cn(buttonVariants({ variant, size, fullWidth, className }))}
        >
          {leftIcon}
          {children}
          {rightIcon}
        </SkeletonBox>
      );
    }

    /* ครอบไอคอนด้วย span เสมอ — ไม่ใช่ทุกไอคอนที่เป็น <svg>
     * (บางที่ส่ง <img>, emoji, หรือ component ของ lucide ที่ห่อ span มาแล้ว)
     * `[&_svg]:shrink-0` ที่ base ครอบเฉพาะ svg ตัว span นี้จึงเป็นตัวการันตี
     * ว่าไอคอนจะไม่ถูกบีบเมื่อข้อความยาว และจัดกึ่งกลางแนวตั้งเสมอ */
    const slot = (node: React.ReactNode, side: "left" | "right") => (
      <span
        aria-hidden="true"
        data-slot={`button-icon-${side}`}
        className="inline-flex shrink-0 items-center"
      >
        {node}
      </span>
    );

    const content = (
      <>
        {loading ? <Spinner /> : leftIcon ? slot(leftIcon, "left") : null}
        {children}
        {!loading && rightIcon ? slot(rightIcon, "right") : null}
      </>
    );

    const shared = {
      "data-slot": "button",
      "data-loading": loading || undefined,
      className: cn(buttonVariants({ variant, size, fullWidth, className })),
      "aria-busy": loading || undefined,
      ...props,
    };

    /* `asChild` ต้องยัดเนื้อหาเข้าไปในลูกตัวเดียว ไม่ใช่ส่งพี่น้องหลายก้อนให้ Slot
     * — `Slot` เรียก `React.Children.only()` ข้างใน ถ้าส่ง 3 ก้อน (ไอคอนซ้าย +
     * ข้อความ + ไอคอนขวา) จะ throw ทันที ก่อนหน้านี้ `asChild` จึงใช้คู่กับไอคอน
     * ไม่ได้เลย ทั้งที่ prop ทั้งสองมีอยู่ */
    if (asChild) {
      const child = React.isValidElement(children) ? children : null;
      return (
        <Slot ref={ref} {...shared}>
          {child
            ? React.cloneElement(
                child as React.ReactElement<{ children?: React.ReactNode }>,
                undefined,
                <>
                  {loading ? <Spinner /> : leftIcon ? slot(leftIcon, "left") : null}
                  {(child.props as { children?: React.ReactNode }).children}
                  {!loading && rightIcon ? slot(rightIcon, "right") : null}
                </>,
              )
            : <span className="inline-flex items-center gap-1">{content}</span>}
        </Slot>
      );
    }

    return (
      <button ref={ref} disabled={isDisabled} {...shared}>
        {content}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };
