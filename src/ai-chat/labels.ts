import type { AiChatLabels, AiChatLocale } from "./types";

/**
 * Thai copy — the widget's primary locale, and the fallback for every key an override omits.
 *
 * 🔴 Kept exported as `defaultLabels` under its original name: three apps import it and one test
 * asserts on it. Adding `en` must not force any of them to change a line.
 */
export const thLabels: AiChatLabels = {
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
  reconnecting: "กำลังเชื่อมต่อใหม่อัตโนมัติ…",
  retry: "ลองใหม่",
  minimize: "ย่อหน้าต่างแชท (บทสนทนายังอยู่)",
  committed: "บันทึกแล้ว",
  notCommitted: "ยังไม่ได้บันทึก",
  thinking: "กำลังคิด…",
  scheduleMode: "โหมดจัดเวร",
  assistantMode: "โหมดผู้ช่วย",
  you: "คุณ",
  assistant: "ผู้ช่วย",
  historyTitle: "ประวัติการสนทนา",
  historySearch: "ค้นหาในประวัติ",
  historyBack: "กลับไปที่บทสนทนา",
  historyClose: "ปิดประวัติ",
  /* "เริ่มวันนี้" ไม่ใช่ "วันนี้" — จัดกลุ่มด้วย `createdAt` ซึ่งคือตอนเริ่มบทสนทนา
     บทที่กลับไปคุยต่อจะยังอยู่ในกลุ่มของวันที่เริ่ม ไม่ใช่วันที่พิมพ์ล่าสุด */
  historyToday: "เริ่มวันนี้",
  historyEarlier: "ก่อนหน้านี้",
  historyNoMatch: "ไม่พบบทสนทนาที่ตรงกับคำค้น",
  historyCapped: "แสดง {count} บทสนทนาล่าสุด — เก่ากว่านี้ค้นไม่เจอ",
  historyUntitled: "(ไม่มีชื่อ)",
  timeJustNow: "เมื่อสักครู่",
  timeMinutesAgo: "{count} นาทีที่แล้ว",
  timeHoursAgo: "{count} ชม.ที่แล้ว",
  dateLocale: "th-TH",
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
  scheduleGreetingPeriod: " เดือน {month}/{year}",
  scheduleGreetingUnscoped: 'เริ่มได้โดยบอกแผนกและเดือนที่จะจัดก่อน เช่น *"แผนก ICU เดือนหน้า"*',
  contextTooltip:
    "ความจำของแชทนี้ — ใช้ไปประมาณ {used} จาก {limit} โทเคน\nเกินกว่านี้ ข้อความเก่าสุดจะถูกตัดออกจากสิ่งที่ AI จำได้",
  contextTrimmed: "ตอนนี้ตัดข้อความเก่าบางส่วนออกไปแล้ว — ถ้าต้องการเริ่มใหม่ให้กด “แชทใหม่”",
};

/**
 * English copy.
 *
 * ⚠️ This covers the widget's own chrome only. Everything the **service** sends back — tool-trail
 * labels, confirm cards, error explanations — arrives on `*_th` fields in the wire contract, with no
 * English counterpart, so those stay Thai whatever this is set to. See `labels.md`.
 */
export const enLabels: AiChatLabels = {
  launcher: "AI assistant",
  title: "AI assistant",
  subtitle: "Ask about rosters, requests and settings",
  placeholder: "Ask about the roster — e.g. who is on the morning shift on the 6th…",
  placeholderSchedule: 'Scheduling mode — type "generate the roster", or name a department/month…',
  send: "Send",
  cancel: "Cancel",
  newChat: "New chat",
  history: "Chat history",
  emptyTitle: "Ask away",
  emptyHint: "For example, “who is still missing from night shifts this month?”",
  connecting: "Connecting…",
  disconnected: "Connection lost",
  reconnecting: "Reconnecting automatically…",
  retry: "Try again",
  minimize: "Minimise the chat (the conversation is kept)",
  committed: "Saved",
  notCommitted: "Not saved yet",
  thinking: "Thinking…",
  scheduleMode: "Scheduling mode",
  assistantMode: "Assistant mode",
  you: "You",
  assistant: "Assistant",
  historyTitle: "Conversation history",
  historySearch: "Search history",
  historyBack: "Back to the conversation",
  historyClose: "Close history",
  /* "Started today", not "Today" — grouped by `createdAt`, i.e. when the thread began. Coming back to
     yesterday's thread keeps it in "Earlier", so the heading has to say which date it means. */
  historyToday: "Started today",
  historyEarlier: "Earlier",
  historyNoMatch: "No conversation matches that search",
  historyCapped: "Showing the {count} most recent conversations — older ones are not searchable",
  historyUntitled: "(untitled)",
  timeJustNow: "just now",
  timeMinutesAgo: "{count} min ago",
  timeHoursAgo: "{count} hr ago",
  dateLocale: "en-GB",
  scheduleGreeting: [
    "🗓️ **Scheduling mode is on.**",
    "{context}",
    "",
    "Tell me what to do next, for example:",
    '• **Generate the roster** — type *"generate the roster"* and I will fill the whole month',
    "• **Set things up first** — add staff · shift types · operating hours · scheduling rules",
    '• **Assign by hand** — e.g. *"put Somying on shift D on the 5th"*',
    "",
    'Type *"cancel"* to leave this mode at any time.',
  ].join("\n"),
  scheduleGreetingScoped: "Getting ready to schedule **{department}**{period}",
  scheduleGreetingPeriod: " for {month}/{year}",
  scheduleGreetingUnscoped: 'Start by naming the department and month — e.g. *"ICU next month"*',
  contextTooltip:
    "This chat's memory — about {used} of {limit} tokens used\nPast that, the oldest messages drop out of what the AI remembers",
  contextTrimmed: "Some older messages have been dropped — press “New chat” to start clean",
};

/** Every locale the widget ships copy for. A host that needs another one injects `labels` instead. */
export const labelsByLocale: Record<AiChatLocale, AiChatLabels> = {
  th: thLabels,
  en: enLabels,
};

/** @deprecated in name only — kept because three apps and one test import it. Same object as `thLabels`. */
export const defaultLabels = thLabels;

/**
 * Base copy for `locale`, with the host's own `labels` layered on top.
 *
 * 🔴 The merge is one level deep and **partial by design**: an app that only wants to rename the
 * launcher passes one key and keeps the rest of that locale. Falling back to Thai for a missing key
 * would be worse than useless in an English UI, which is why the base is picked *before* the merge,
 * not after.
 */
export function resolveLabels(
  overrides?: Partial<AiChatLabels>,
  locale: AiChatLocale = "th",
): AiChatLabels {
  const base = labelsByLocale[locale] ?? thLabels;
  return overrides ? { ...base, ...overrides } : base;
}

/**
 * Onboarding message rendered right after entering scheduling mode. Without it the user lands in a
 * mode with no idea what it can do — the dead-end the playground client calls out explicitly.
 */
export function buildScheduleGreeting(
  labels: AiChatLabels,
  seed: { departmentName?: string; month?: number; year?: number } | null,
): string {
  /* The period fragment is its own label, not a template literal — it used to be `\` เดือน ${…}\``
     inlined here, which meant an English `scheduleGreetingScoped` still rendered a Thai month word
     in the middle of it. Anything the user reads has to come out of `labels`. */
  const period = seed?.month
    ? labels.scheduleGreetingPeriod
        .replace("{month}", String(seed.month))
        .replace("{year}", String(seed.year ?? ""))
        .trimEnd()
    : "";
  const context = seed?.departmentName
    ? labels.scheduleGreetingScoped
        .replace("{department}", seed.departmentName)
        .replace("{period}", period)
    : labels.scheduleGreetingUnscoped;
  return labels.scheduleGreeting.replace("{context}", context);
}
