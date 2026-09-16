import * as React from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { SkeletonBox } from "../feedback/Skeleton";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full bg-gray-100 text-text-tertiary",
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-caption",
        md: "size-10 text-body-sm",
        lg: "size-12 text-body-md",
        xl: "size-16 text-body-lg",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/**
 * วงสีตกแต่ง 6 คู่ — ค่าอยู่ที่ `--color-avatar-*` (semantic layer) เหมือนกันทุกธีม
 *
 * 🔴 **ลำดับคือส่วนหนึ่งของสัญญา** — โทนของแต่ละคนคือ `key % 6` ⇒ สลับลำดับหรือ
 * แทรกกลาง = ทุกคนในทุกแอปเปลี่ยนสีพร้อมกัน คนที่จำเพื่อนร่วมงานจากสีวงกลมจะ
 * เจอว่า "คนละคน" ทั้งตาราง · เพิ่มต่อท้ายก็เปลี่ยนตัวหาร ผลเหมือนกัน
 */
const avatarTones = [
  "bg-avatar-1-bg text-avatar-1-fg",
  "bg-avatar-2-bg text-avatar-2-fg",
  "bg-avatar-3-bg text-avatar-3-fg",
  "bg-avatar-4-bg text-avatar-4-fg",
  "bg-avatar-5-bg text-avatar-5-fg",
  "bg-avatar-6-bg text-avatar-6-fg",
] as const;

/**
 * เลือกโทนจากคีย์แบบคงที่ — คีย์เดิมได้สีเดิมเสมอ ทุกเครื่อง ทุกครั้งที่ render
 *
 * ตัวเลข → `|key| % 6` ตรง ๆ · สตริง → djb2 ก่อน (ไม่ใช่ผลรวมของ charCode ซึ่ง
 * ให้ค่าเท่ากันทุก anagram — "AB" กับ "BA" จะได้สีเดียวกัน)
 *
 * ⚠️ ไม่เชื่อว่าเลขมาถูกเสมอ: `NaN % 6` = `NaN` ⇒ index หลุด แล้ววงกลมกลายเป็น
 * เทาไม่มีสไตล์แบบเงียบ ๆ ⇒ ค่าที่ไม่ใช่จำนวนจำกัดตกลงโทนแรก
 */
export function avatarToneIndex(key: string | number): number {
  if (typeof key === "number") {
    return Number.isFinite(key)
      ? Math.abs(Math.trunc(key)) % avatarTones.length
      : 0;
  }
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 33 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % avatarTones.length;
}

export type AvatarProps = Omit<
  React.ComponentProps<typeof RadixAvatar.Root>,
  "asChild"
> &
  VariantProps<typeof avatarVariants> & {
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

/** Honorific/title prefixes stripped before computing initials (dots ignored). */
const TITLE_PREFIXES = new Set([
  // Thai medical / academic / honorific
  "นพ", "พญ", "ทพ", "ทพญ", "ภก", "ภกญ", "สพ", "สพญ",
  "ดร", "ผศ", "รศ", "ศ", "นาย", "นาง", "นางสาว", "นส",
  // English
  "mr", "mrs", "ms", "miss", "dr", "prof",
]);

/**
 * คำนำหน้าที่ **ติดกับชื่อโดยไม่มีตัวคั่น** — ตัดออกก่อนหาตัวย่อ
 *
 * 🔴 **ไม่ใช่เคสหายาก — เป็นรูปแบบหลักของข้อมูลจริง** วัดจาก production ของ MediAct
 * (ตาราง `users`, 14,446 แถว, 2026-09-11) · ไม่มีคอลัมน์คำนำหน้าแยก คำนำหน้าถูกเก็บ
 * ปนอยู่ใน `first_name` แล้ว backend ประกอบเป็น `fullName`:
 *   • ติดกัน **มีจุด** (`"นพ.วรวิทย์"`)      32 แถว
 *   • `"นางสาว"` ติดกัน **ไม่มีจุด**         11 แถว
 *   • เป็นคำแยกมีเว้นวรรค (`"นพ. วรวิทย์"`)   4 แถว  ← ทางเดียวที่โค้ดเดิมรองรับ
 * ⇒ ก่อนหน้านี้ 43 จาก 47 แถวได้ตัวย่อเป็น **พยัญชนะของคำนำหน้า** ("น" จาก "นพ.")
 *   แทนที่จะเป็นอักษรแรกของชื่อจริง
 *
 * ── เส้นแบ่งว่าตัดตัวไหน: **ขอบเขตต้องไม่กำกวม** ────────────────────────────
 * ✅ **มีจุด** — จุดคือเครื่องหมายย่อ ไม่มีชื่อจริงคนไหนมีจุดคั่นกลาง ⇒ ตัดได้ทุกคำนำหน้า
 * ✅ **`"นางสาว"` ไม่มีจุด** — ยาว 6 อักขระ ไม่มีชื่อจริงที่ขึ้นต้นแบบนี้
 * ⛔ **`"นาย"` / `"นาง"` ไม่มีจุด (4 แถว) — จงใจไม่ตัด** เพราะกินชื่อจริงได้
 *    ("นางนวล" · "นายก") การตัดพลาดทำให้ตัวย่อ**ผิดคน** ซึ่งแย่กว่าการไม่ตัด
 *    ที่แค่ได้ตัวย่อไม่สวย — 4 แถวไม่คุ้มกับความเสี่ยงนั้น
 */
const NO_DOT_GLUED_TITLES = ["นางสาว"];

/* เรียงยาวไปสั้นเพื่อให้ชนตัวที่เจาะจงกว่าก่อน — ไม่งั้น "ทพ" จะชน "ทพญ" และ
 * "นาง" จะชน "นางสาว" แล้วเหลือเศษคำนำหน้าติดมากับชื่อ
 * (สมาชิกทุกตัวเป็นตัวอักษรล้วน ไม่มีอักขระพิเศษของ regex จึงไม่ต้อง escape) */
const TITLE_ALTERNATION = [...TITLE_PREFIXES]
  .sort((a, b) => b.length - a.length)
  .join("|");

/** `(?=.)` — ต้องเหลือตัวอักษรหลังคำนำหน้า ไม่งั้น `"นพ."` เดี่ยว ๆ จะถูกลบจนว่าง */
const GLUED_TITLE_REGEX = new RegExp(
  `^(?:(?:${TITLE_ALTERNATION})\\.|${NO_DOT_GLUED_TITLES.join("|")})(?=.)`,
  "i",
);

/**
 * Thai consonants ก–ฮ (U+0E01–U+0E2E). Leading vowels (เ แ โ ใ ไ) sort before the
 * consonant they belong to in string order, so a bare "first character" can land
 * on a vowel mark that means nothing on its own — this is what a single-character
 * initial must skip.
 */
const THAI_CONSONANT_REGEX = /[ก-ฮ]/;

/** First Thai consonant of a word (skipping any leading vowel), else its first character. */
function firstInitialOf(word: string): string {
  const consonant = Array.from(word).find((char) => THAI_CONSONANT_REGEX.test(char));
  return consonant ?? word[0]!;
}

/**
 * Compute up to 2 uppercase initials from a name string.
 * Leading titles (e.g. "นพ.", "พญ.", "Dr.") are skipped whether they are their own
 * word or glued to the given name, so "นพ. วรวิทย์ ตันสกุล", "นพ.วรวิทย์ ตันสกุล" and
 * "Dr.John Smith" all resolve to the name's own initials — see `NO_DOT_GLUED_TITLES`
 * above for which glued forms are safe to strip and why the rest deliberately are not.
 *
 * Each name's initial is its first *consonant*, not its first character: "ธนชาญ
 * โอค้ากอง" → "ธอ", not "ธโ" — a leading vowel alone renders as a floating mark
 * with nothing to attach to.
 */
function initials(name?: string) {
  if (!name) return "";
  let parts = name.trim().split(/\s+/).filter(Boolean);

  /* ตัดคำนำหน้าออกจนไม่เหลือ — วนเพราะมีได้มากกว่าชั้นเดียว ("ผศ. นพ.สมชาย")
   * และเพราะตัดแบบติดกันแล้วอาจโผล่คำนำหน้าตัวถัดไปที่เป็นคำแยก */
  for (let guard = 0; guard < parts.length + 2; guard++) {
    /* ① คำนำหน้าเป็น **คำแยก** — "นพ. วรวิทย์ ตันสกุล"
     *    ต้องเหลือคำอื่นอย่างน้อยหนึ่งคำ ไม่งั้นจะไม่เหลืออะไรให้ย่อ */
    if (
      parts.length > 1 &&
      TITLE_PREFIXES.has(parts[0]!.replace(/\./g, "").toLowerCase())
    ) {
      parts = parts.slice(1);
      continue;
    }
    /* ② คำนำหน้า **ติดกับชื่อ** — "นพ.วรวิทย์" */
    const head = parts[0];
    if (!head) break;
    const stripped = head.replace(GLUED_TITLE_REGEX, "");
    if (!stripped || stripped === head) break;
    parts = [stripped, ...parts.slice(1)];
  }

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (
    firstInitialOf(parts[0]!) + firstInitialOf(parts[parts.length - 1]!)
  ).toUpperCase();
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { className, size, src, name, fallback, colorKey, isLoading, ...props },
  ref,
) {
  if (isLoading) {
    return (
      <SkeletonBox
        className={cn(avatarVariants({ size }), "rounded-full", className)}
      />
    );
  }
  return (
    <RadixAvatar.Root
      ref={ref}
      className={cn(
        avatarVariants({ size }),
        /* หลัง variant เพื่อให้ทับคู่สีเทาตั้งต้นใน `avatarVariants` ได้
           แต่ยังก่อน `className` — ผู้เรียกยังบังคับสีเองได้อยู่
           (เขียนชื่อคลาสเทาตรง ๆ ไม่ได้ — ด่านกันสีดิบสแกนคอมเมนต์ด้วย) */
        colorKey !== undefined && avatarTones[avatarToneIndex(colorKey)],
        className,
      )}
      {...props}
    >
      {src && (
        <RadixAvatar.Image
          src={src}
          alt={name ?? ""}
          className="size-full object-cover"
        />
      )}
      <RadixAvatar.Fallback
        // undefined (not 0) when no image — renders immediately incl. SSR;
        // 0 would defer to a client timer and skip server-rendered initials
        delayMs={src ? 200 : undefined}
        className="flex size-full items-center justify-center font-semibold"
      >
        {fallback ?? initials(name)}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
});

export { Avatar, avatarVariants };
