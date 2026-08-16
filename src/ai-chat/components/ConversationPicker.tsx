import * as React from "react";
import { Loader2, MessageSquare, Search } from "lucide-react";
import type { ConversationListItem } from "../api/types";
import type { AiChatLabels } from "../types";
import { cn } from "../lib/cn";

export interface ConversationPickerProps {
  load: () => Promise<ConversationListItem[]>;
  onPick: (conversationId: string) => void;
  activeId: string | null;
  labels: AiChatLabels;
}

/**
 * เพดานที่ `listSummaries` ของ service คืนมา (`cap = 100`)
 *
 * 🔴 ไม่มี API ค้นหา — ช่องค้นในจอนี้กรอง "รายการที่โหลดมาแล้ว" เท่านั้น ⇒ ผู้ใช้ที่มีบทสนทนา
 * มากกว่านี้จะค้นของเก่าไม่เจอ และหน้าจอต้อง**บอก**เขา ไม่ใช่ปล่อยให้อ่านว่า "ไม่มี"
 */
const LIST_CAP = 100;

/**
 * "3 นาทีที่แล้ว" reads faster than a timestamp when picking which thread to resume.
 *
 * 🔴 Takes `labels` rather than formatting inline: the three phrases *and* the date format have to
 * change together with the rest of the panel. `th-TH` was hardcoded here, so an English panel still
 * printed Buddhist-era dates in its own list — the one place a stray locale is easy to miss, because
 * rows younger than a day never reach that branch.
 */
function relativeTime(iso: string, labels: AiChatLabels): string {
  const date = new Date(iso);
  const seconds = (Date.now() - date.getTime()) / 1000;
  if (seconds < 60) return labels.timeJustNow;
  if (seconds < 3600) return labels.timeMinutesAgo.replace("{count}", String(Math.floor(seconds / 60)));
  if (seconds < 86400) return labels.timeHoursAgo.replace("{count}", String(Math.floor(seconds / 3600)));
  return date.toLocaleDateString(labels.dateLocale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * บทสนทนานี้ "เริ่มวันนี้" หรือไม่
 *
 * ⚠️ ตัดสินจาก `createdAt` = ตอน**เริ่ม**บทสนทนา ไม่ใช่ตอนพิมพ์ล่าสุด (สัญญาไม่มีค่านั้น และ service
 * ก็เรียงด้วย `createdAt desc` เหมือนกัน) ⇒ กลับไปคุยต่อบทเมื่อวาน มันยังอยู่กลุ่ม "ก่อนหน้านี้"
 * หัวกลุ่มจึงเขียนว่า "เริ่มวันนี้" ตรง ๆ แทนที่จะเป็น "วันนี้" ซึ่งจะกลายเป็นคำโกหกทันทีที่คุยต่อ
 *
 * 🔴 เทียบวันแบบ local ไม่ใช่ `toISOString()` — ในไทย (UTC+7) ทุกอย่างก่อน 07:00 จะถูกนับเป็นเมื่อวาน
 * (กับดักเดียวกับที่ `Calendar.dayKey` ของ DS เขียนกำกับไว้)
 */
function startedToday(iso: string): boolean {
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

/** ชื่อที่แสดง — `title` และ `preview` เป็น nullable ทั้งคู่ในสัญญาของ service */
const displayTitle = (item: ConversationListItem, labels: AiChatLabels): string =>
  item.title || item.preview || labels.historyUntitled;

/**
 * จอประวัติ — **เต็มแผง ไม่ใช่แผ่นซ้อน**
 *
 * ลิ้นชักกว้าง 26rem (416px) · ของเดิมเป็นรายการสูง `max-h-64` แทรกอยู่ใต้แถบหัวโดยที่บทสนทนายังอยู่ข้างล่าง
 * ⇒ เห็นได้ทีละ ~4 แถว หัวข้อถูกตัดกลางคำ และ "ตอนนี้ฉันอยู่โหมดไหน" ตอบได้ไม่ชัด
 * การกินพื้นที่ทั้งใบทำให้รายการได้ความกว้างเต็ม มีที่พอสำหรับข้อความตัวอย่างบรรทัดที่สอง และมีช่องค้นหาได้
 *
 * โหลดตอนเปิดเท่านั้น — ลิ้นชักที่ปิดอยู่จึงไม่กินคำขอสักครั้ง
 */
export function ConversationPicker({ load, onPick, activeId, labels }: ConversationPickerProps) {
  const [items, setItems] = React.useState<ConversationListItem[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    load()
      .then((result) => {
        if (!cancelled) setItems(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const matched = React.useMemo(() => {
    if (!items) return null;
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      `${item.title ?? ""} ${item.preview ?? ""}`.toLowerCase().includes(needle),
    );
  }, [items, query]);

  const groups = React.useMemo(() => {
    if (!matched) return null;
    return {
      today: matched.filter((item) => startedToday(item.createdAt)),
      earlier: matched.filter((item) => !startedToday(item.createdAt)),
    };
  }, [matched]);

  return (
    <div data-slot="ai-chat-history" className="flex min-h-0 flex-1 flex-col bg-bg-default">
      <div className="px-4 pt-3 pb-2">
        <label className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-subtle px-3 py-2 focus-within:border-brand-active focus-within:bg-bg-default">
          <Search className="size-4 shrink-0 text-text-tertiary" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.historySearch}
            aria-label={labels.historySearch}
            className="min-w-0 flex-1 bg-transparent text-body-sm outline-none placeholder:text-text-tertiary"
          />
        </label>
      </div>

      {error ? (
        <p className="px-4 py-3 text-caption text-error-red-600">{error}</p>
      ) : !groups ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-4 animate-spin text-text-tertiary" />
        </div>
      ) : items && items.length === 0 ? (
        <p className="px-4 py-3 text-caption text-text-body">{labels.emptyHint}</p>
      ) : groups.today.length + groups.earlier.length === 0 ? (
        <p className="px-4 py-3 text-caption text-text-body">{labels.historyNoMatch}</p>
      ) : (
        <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2.5 pb-3">
          {groups.today.length > 0 && <GroupHeading>{labels.historyToday}</GroupHeading>}
          {groups.today.map((item) => (
            <Row key={item.id} item={item} activeId={activeId} labels={labels} onPick={onPick} />
          ))}

          {groups.earlier.length > 0 && <GroupHeading>{labels.historyEarlier}</GroupHeading>}
          {groups.earlier.map((item) => (
            <Row key={item.id} item={item} activeId={activeId} labels={labels} onPick={onPick} />
          ))}
        </ul>
      )}

      {/* บอกเพดานเฉพาะตอนที่ชนจริง — เห็นเมื่อการค้นหาเริ่มเชื่อถือไม่ได้ ไม่ใช่กวนตลอดเวลา */}
      {items && items.length >= LIST_CAP && (
        <p className="border-t border-border-subtle px-4 py-2 text-[11px] text-text-tertiary">
          {labels.historyCapped.replace("{count}", String(items.length))}
        </p>
      )}
    </div>
  );
}

function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <li
      role="presentation"
      className="px-2 pt-3 pb-1.5 text-[11px] font-semibold tracking-wide text-text-tertiary uppercase"
    >
      {children}
    </li>
  );
}

function Row({
  item,
  activeId,
  labels,
  onPick,
}: {
  item: ConversationListItem;
  activeId: string | null;
  labels: AiChatLabels;
  onPick: (id: string) => void;
}) {
  const active = item.id === activeId;

  return (
    <li>
      <button
        type="button"
        onClick={() => onPick(item.id)}
        aria-current={active ? "true" : undefined}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 rounded-xl p-2.5 text-left transition-colors",
          active ? "bg-brand-subtle" : "hover:bg-bg-subtle",
        )}
      >
        {/* สี่เหลี่ยมมุมมน ไม่ใช่วงกลม — วงกลมอ่านเป็นรูปคน ซึ่งผิด: คู่สนทนามีสองคนเสมอ
          * ไอคอนตัวนี้บอก "นี่คือบทสนทนา" ไม่ได้บอกว่าใคร · ไอคอนเดียวทุกแถวเพราะสัญญาไม่มีฟิลด์
          * ประเภทให้แยกเรื่อง (จะแยกได้ต้องแตะหลังบ้าน) */}
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl",
            active ? "bg-brand text-text-black" : "bg-bg-subtle text-text-body",
          )}
        >
          <MessageSquare className="size-4" aria-hidden />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-body-sm font-medium text-text-black">
            {displayTitle(item, labels)}
          </span>
          {/* บรรทัดสองคือ **ข้อความแรกของผู้ใช้** ในบทนั้น (service นิยาม `preview` ไว้แบบนั้น)
            * ซ่อนเมื่อมันถูกใช้เป็นชื่อไปแล้ว จะได้ไม่เห็นข้อความเดียวกันสองบรรทัด */}
          {item.preview && item.title && (
            <span className="block truncate text-[12px] text-text-tertiary">{item.preview}</span>
          )}
        </span>

        <span className="shrink-0 text-[11px] text-text-tertiary">{relativeTime(item.createdAt, labels)}</span>
      </button>
    </li>
  );
}
