import * as React from "react";
import { cn } from "../lib/cn";

export type SkeletonProps = React.ComponentProps<"div"> & {
  /** Shape preset. `text` defaults to a 1em-height bar. `circle` is square + rounded-full. */
  shape?: "rect" | "text" | "circle";
};

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ className, shape = "rect", style, ...props }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "animate-pulse bg-bg-skeleton",
          shape === "rect" && "rounded-sm",
          shape === "text" && "h-4 rounded-sm",
          shape === "circle" && "rounded-full",
          className,
        )}
        style={style}
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

/* ────────────────────────────────────────────────────────────────────────────
 * SkeletonBox — โครงร่างที่ "สวมรูปทรงของ component ตัวจริง"
 *
 * ปัญหาของ skeleton ทั่วไปคือมันเป็นกล่องเทาที่เดาขนาดเอา พอข้อมูลมาถึง
 * เลย์เอาต์กระโดด (layout shift) ตัวนี้แก้ด้วยการ **รับ class รูปทรงของ
 * component นั้นมาตรง ๆ** แล้วลบเฉพาะสิ่งที่ไม่ควรเห็นตอนโหลด
 *
 *   <SkeletonBox shape={buttonVariants({ size, fullWidth })} />
 *
 * ที่ลบให้อัตโนมัติ (อาศัย tailwind-merge ใน `cn`): สีพื้น · เส้นขอบ · เงา ·
 * สีตัวอักษร · การรับคลิก — เหลือแค่ความสูง ความกว้าง มุมโค้ง และ padding
 * ⇒ ขนาดตรงกับของจริงเสมอ โดยไม่ต้องมาไล่ตั้งตัวเลขซ้ำในทุก component
 * ──────────────────────────────────────────────────────────────────────────── */
export type SkeletonBoxProps = Omit<SkeletonProps, "shape"> & {
  /** class รูปทรงของ component ตัวจริง — ปกติคือผลลัพธ์ของ cva ตัวเดียวกับที่มันใช้ */
  shape?: string;
  /** ข้อความให้โปรแกรมอ่านหน้าจอ — ตั้งค่าเริ่มต้นไว้แล้ว ไม่ต้องส่งทุกที่ */
  label?: string;
};

const SkeletonBox = React.forwardRef<HTMLDivElement, SkeletonBoxProps>(
  function SkeletonBox(
    { shape, className, label = "กำลังโหลด", children, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="status"
        aria-busy="true"
        data-slot="skeleton-box"
        className={cn(
          shape,
          /* ลบทุกอย่างที่เป็น "เนื้อหา" เหลือแต่กรอบ — เรียงหลัง shape เพื่อให้ชนะ
           * ⚠️ `border-transparent` ไม่ใช่ `border-0` — ตัวหลังลบ *ความกว้าง* ของเส้นขอบ
           * ทำให้ variant ที่มีขอบ (เช่น secondary) แคบกว่าของจริง 2px */
          "pointer-events-none animate-pulse border-transparent bg-bg-skeleton text-transparent shadow-none select-none",
          className,
        )}
        {...props}
      >
        <span className="sr-only">{label}</span>
        {/* เนื้อหาจริงยังอยู่ใน DOM แต่ `invisible` (visibility:hidden) — ยังกินที่เท่าเดิม
         * ⇒ โครงร่างกว้างเท่าของจริงเป๊ะ ไม่ต้องเดาความกว้างหรือตั้ง w-* เอง
         * ต่างจาก `hidden` ที่ถอดออกจากเลย์เอาต์แล้วกล่องจะหดเหลือแค่ padding */}
        {children != null && (
          <span aria-hidden="true" className="invisible contents">
            {children}
          </span>
        )}
      </div>
    );
  },
);

SkeletonBox.displayName = "SkeletonBox";

export { Skeleton, SkeletonBox };
