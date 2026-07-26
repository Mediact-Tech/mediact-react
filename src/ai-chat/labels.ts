import type { AiChatLabels } from "./types";

/** Thai-first defaults — every consuming app runs Thai as its primary locale. */
export const defaultLabels: AiChatLabels = {
  launcher: "ผู้ช่วย AI",
  title: "ผู้ช่วย AI",
  subtitle: "ถามเรื่องตารางเวร คำขอ และการตั้งค่าได้เลย",
  placeholder: "ถามเรื่องตารางเวร เช่น วันที่ 6 ใครเวรเช้า…",
  placeholderSchedule: 'อยู่ในโหมดจัดเวร — พิมพ์ "จัดเวรเลย" หรือระบุแผนก/เดือน…',
  send: "ส่ง",
  cancel: "ยกเลิก",
  newChat: "แชทใหม่",
  history: "ประวัติแชท",
  emptyTitle: "เริ่มถามได้เลย",
  emptyHint: "เช่น “เดือนนี้เวรดึกใครยังขาดบ้าง”",
  connecting: "กำลังเชื่อมต่อ…",
  disconnected: "การเชื่อมต่อหลุด",
  retry: "ลองใหม่",
  close: "ปิด",
  committed: "บันทึกแล้ว",
  notCommitted: "ยังไม่ได้บันทึก",
  thinking: "กำลังคิด…",
  scheduleMode: "โหมดจัดเวร",
  assistantMode: "โหมดผู้ช่วย",
  // `{context}` ถูกแทนด้วยแผนก/เดือนที่ hand-off ระบุมา (หรือคำชวนให้ระบุ เมื่อยังไม่รู้)
  scheduleGreeting: [
    "🗓️ **เข้าสู่โหมดจัดเวรแล้วครับ**",
    "{context}",
    "",
    "บอกได้เลยว่าจะทำอะไรต่อ เช่น",
    '• **จัดเวรอัตโนมัติ** — พิมพ์ *"จัดเวรเลย"* ให้ระบบจัดให้ทั้งเดือน',
    "• **ตั้งค่าก่อน** — เพิ่มผู้ปฏิบัติงาน · ประเภทเวร · เวลาทำการ · กฎการจัดเวร",
    '• **ลงเวรเอง** — เช่น *"วันที่ 5 ให้สมหญิง เวร D"*',
    "",
    'พิมพ์ *"ยกเลิก"* เพื่อออกจากโหมดได้ทุกเมื่อครับ',
  ].join("\n"),
  scheduleGreetingScoped: "กำลังเตรียมจัดเวร **แผนก {department}**{period}",
  scheduleGreetingUnscoped: 'เริ่มได้โดยบอกแผนกและเดือนที่จะจัดก่อน เช่น *"แผนก ICU เดือนหน้า"*',
  contextTooltip:
    "ความจำของแชทนี้ — ใช้ไปประมาณ {used} จาก {limit} โทเคน\nเกินกว่านี้ ข้อความเก่าสุดจะถูกตัดออกจากสิ่งที่ AI จำได้",
  contextTrimmed: "ตอนนี้ตัดข้อความเก่าบางส่วนออกไปแล้ว — ถ้าต้องการเริ่มใหม่ให้กด “แชทใหม่”",
};

export function resolveLabels(overrides?: Partial<AiChatLabels>): AiChatLabels {
  return overrides ? { ...defaultLabels, ...overrides } : defaultLabels;
}

/**
 * Onboarding message rendered right after entering scheduling mode. Without it the user lands in a
 * mode with no idea what it can do — the dead-end the playground client calls out explicitly.
 */
export function buildScheduleGreeting(
  labels: AiChatLabels,
  seed: { departmentName?: string; month?: number; year?: number } | null,
): string {
  const context = seed?.departmentName
    ? labels.scheduleGreetingScoped
        .replace("{department}", seed.departmentName)
        .replace("{period}", seed.month ? ` เดือน ${seed.month}/${seed.year ?? ""}`.trimEnd() : "")
    : labels.scheduleGreetingUnscoped;
  return labels.scheduleGreeting.replace("{context}", context);
}
