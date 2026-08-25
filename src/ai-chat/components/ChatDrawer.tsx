import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import {
  CalendarDays,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  History,
  Plus,
  X,
} from "lucide-react";
import type { ChatMode, ContextUsage, ConversationListItem } from "../api/types";
import type { AiChatLabels, ChatMessage, SessionStatus } from "../types";
import type { TransportStatus } from "../realtime/chatTransport";
import { cn } from "../lib/cn";
import { Composer } from "./Composer";
import { ContextMeter } from "./ContextMeter";
import { ConversationPicker } from "./ConversationPicker";
import { MessageList } from "./MessageList";

export interface ChatDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: ChatMessage[];
  status: SessionStatus;
  transportStatus: TransportStatus;
  error: string | null;
  labels: AiChatLabels;
  position: "bottom-right" | "bottom-left";
  onSend: (text: string) => void;
  onCancel: () => void;
  onNewChat: () => void;
  onPickConversation: (conversationId: string) => void;
  onRetry: () => void;
  loadConversations: () => Promise<ConversationListItem[]>;
  activeConversationId: string | null;
  /**
   * Which mode the CONVERSATION is in, as the session reports it — read-only here.
   *
   * The drawer has no control for it on purpose: entering and leaving scheduling mode is the
   * assistant's decision (`[[ENTER_MODE:…]]` on the way in, `exit` on the way back — see
   * `useAiChatSession`), so the header states the mode rather than offering to change it.
   */
  mode: ChatMode;
  /** Conversation memory fill, as last measured by the service. Null hides the meter entirely. */
  contextUsage?: ContextUsage | null;
  suggestions?: string[];
}

/**
 * The chat surface itself. Deliberately NON-modal (`modal={false}` + outside-interaction
 * kept alive): the assistant answers questions about the page behind it, so covering that
 * page — or stealing its scroll and focus — would defeat the point.
 */
export function ChatDrawer(props: ChatDrawerProps) {
  const {
    open,
    onOpenChange,
    messages,
    status,
    transportStatus,
    error,
    labels,
    position,
    onSend,
    onCancel,
    onNewChat,
    onPickConversation,
    onRetry,
    loadConversations,
    activeConversationId,
    mode,
    contextUsage,
    suggestions,
  } = props;

  const [historyOpen, setHistoryOpen] = React.useState(false);
  const busy = status === "sending" || status === "streaming";
  const starting = status === "starting";

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <RadixDialog.Portal>
        <RadixDialog.Content
          data-slot="ai-chat-drawer"
          aria-describedby={undefined}
          // Clicking the host page must not dismiss the assistant — it is a companion panel,
          // not a modal. Esc still closes it (Radix default).
          onInteractOutside={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          style={{ zIndex: "var(--mediact-ai-chat-z, 1310)" }}
          className={cn(
            /* พื้นแผงเป็น **ขาว** ไม่ใช่ `bg-bg-subtle` — คำตอบของผู้ช่วยเลิกอยู่ในการ์ดแล้ว (`MessageBubble`)
               ถ้าพื้นยังเป็นเทา ข้อความจะลอยอยู่บนเทาโดยไม่มีอะไรรองรับ · ที่เคยต้องเป็นเทาเพราะมีการ์ดขาววางทับ */
            "fixed inset-y-0 flex w-full flex-col bg-bg-default shadow-2xl outline-none",
            "sm:w-[var(--mediact-ai-chat-drawer-width,26rem)]",
            position === "bottom-left"
              ? "left-0 border-r border-border-default"
              : "right-0 border-l border-border-default",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            position === "bottom-left"
              ? "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
              : "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
          )}
        >
          <header className="flex items-center gap-2 border-b border-border-subtle bg-bg-default px-4 py-3">
            {/* ปุ่มย้อนกลับโผล่เฉพาะตอนอยู่ในประวัติ — ประวัติกินพื้นที่ทั้งแผง ทางออกจึงต้องอยู่ที่แถบหัว
                ไม่ใช่ให้กดปุ่มเดิมซ้ำแบบสวิตช์ (ผู้ใช้ที่เพิ่งเข้ามาไม่รู้ว่าปุ่มไหนพาตัวเองกลับ) */}
            {historyOpen && (
              <IconButton label={labels.historyBack} onClick={() => setHistoryOpen(false)}>
                <ChevronLeft className="size-4" />
              </IconButton>
            )}

            <div className="min-w-0 flex-1">
              <RadixDialog.Title className="truncate text-body-sm font-semibold text-text-black">
                {historyOpen ? labels.historyTitle : labels.title}
              </RadixDialog.Title>
              {/* บรรทัดที่สองมีค่าหนึ่งช่อง จึงให้ของที่ **เปลี่ยนตามสถานะ** ก่อนของที่คงที่:
                  โหมดเปลี่ยนสิ่งที่ผู้ช่วยทำได้จริง (ช่องพิมพ์คนละคำใบ้ · เปิดเส้นเขียนตาราง)
                  ส่วนคำบรรยายอ่านรอบเดียวก็พอ · แถบโหมดเคยเป็นแถวของตัวเองใต้แถบหัว ซึ่งกิน
                  ความสูงถาวรราว 36px ในแผงกว้าง 416px ที่ทุกบรรทัดต้องแย่งกัน

                  🔴 เป็น **ข้อความอย่างเดียว กดไม่ได้** — การเข้า/ออกโหมดเป็นการตัดสินใจของผู้ช่วย
                  (ตัวแทน `[[ENTER_MODE:…]]` พาเข้า และ `exit` พากลับ ดู `useAiChatSession`)
                  ไม่ใช่สวิตช์ของผู้ใช้ · เมื่อไม่มีปุ่มให้กด ก็ไม่ต้องบอกชื่อโหมดปกติ — บอกเฉพาะ
                  ตอนที่ผู้ช่วยพาเข้าโหมดจัดเวร ซึ่งเป็นตอนเดียวที่สถานะต่างจากที่ผู้ใช้คาด */}
              {!historyOpen && mode === "schedule" ? (
                <p className="mt-0.5 flex min-w-0 items-center gap-1 truncate text-caption font-medium text-brand">
                  <CalendarDays className="size-3 shrink-0" aria-hidden />
                  {/* แค่ "โหมดจัดเวร" — เคยต่อท้ายด้วยแผนก/หน่วยงานที่ล็อกไว้ ซึ่งยาวเกินบรรทัดนี้
                      และซ้ำกับข้อความเปิดโหมดที่ผู้ช่วยพิมพ์ไปแล้ว */}
                  {labels.scheduleMode}
                </p>
              ) : !historyOpen ? (
                /* คำบรรยายมีเฉพาะหน้าแชท — ในหน้าประวัติ หัวข้อบอกตัวเองครบแล้ว
                   และแถวรายการต้องการความสูงมากกว่าคำอธิบายซ้ำ */
                <p className="truncate text-caption text-text-body">{labels.subtitle}</p>
              ) : null}
            </div>

            {/* Sits beside the actions rather than in the log: it describes the CONVERSATION, and it
                has to stay readable while the transcript scrolls. */}
            {!historyOpen && (
              <ContextMeter usage={contextUsage ?? null} labels={labels} className="mr-1" />
            )}

            {!historyOpen && (
              <IconButton label={labels.history} onClick={() => setHistoryOpen(true)}>
                <History className="size-4" />
              </IconButton>
            )}
            <IconButton label={labels.newChat} onClick={onNewChat}>
              <Plus className="size-4" />
            </IconButton>

            {/* ปิดประวัติ — ทางออกที่สองโดยตั้งใจ: ปุ่มย้อนซ้ายบนกับกากบาทขวาบนเป็นความคุ้นเคยคนละแบบ
                ทั้งคู่พากลับบทสนทนาเดิม ไม่ได้ปิดแผงและไม่ได้ล้างบทสนทนา */}
            {historyOpen && (
              <IconButton label={labels.historyClose} onClick={() => setHistoryOpen(false)}>
                <X className="size-4" />
              </IconButton>
            )}
            {/* A collapse chevron, not an ✕. Putting the panel away keeps the thread — `start()` resumes
                the remembered conversation, so reopening lands back in the same transcript — but an ✕ in
                the top-right corner is the universal "close this / discard it" affordance, and users read
                it as ending the chat and starting over. The chevron points at the edge the drawer came
                from, which is what actually happens to it. "New chat" is the button beside it, deliberately
                distinct.
                🔴 ซ่อนตอนอยู่ในประวัติ — ไม่งั้นมุมขวาบนมีทั้ง ✕ (ปิดประวัติ) และ » (ย่อแผง) ติดกัน
                ซึ่งหน้าตาเหมือน "ปิด" ทั้งคู่แต่ผลต่างกันคนละเรื่อง */}
            {!historyOpen && (
              <RadixDialog.Close asChild>
                <IconButton label={labels.minimize}>
                  {position === "bottom-left" ? (
                    <ChevronsLeft className="size-4" />
                  ) : (
                    <ChevronsRight className="size-4" />
                  )}
                </IconButton>
              </RadixDialog.Close>
            )}
          </header>

          {/* 🔴 ประวัติ **แทนที่** บทสนทนา ไม่ได้แทรกทับ — ที่ 416px รายการแบบแทรกเห็นได้ทีละ ~4 แถว
              และหัวข้อถูกตัดกลางคำ · การสลับทั้งใบยังทำให้ "ตอนนี้อยู่โหมดไหน" มีคำตอบเดียว
              ⚠️ ทั้งสองฝั่งถูก unmount จริงเมื่ออีกฝั่งแสดง — `MessageList` เลื่อนหาข้อความล่าสุดตอน mount
              อยู่แล้ว การกลับจากประวัติจึงลงที่ท้ายบทสนทนาเสมอ ไม่ต้องจำตำแหน่งเลื่อน */}
          {historyOpen ? (
            <ConversationPicker
              load={loadConversations}
              activeId={activeConversationId}
              labels={labels}
              onPick={(id) => {
                setHistoryOpen(false);
                onPickConversation(id);
              }}
            />
          ) : (
            <>
              <StatusBar
                status={status}
                transportStatus={transportStatus}
                error={error}
                labels={labels}
                onRetry={onRetry}
              />

              <MessageList
                messages={messages}
                labels={labels}
                busy={busy}
                suggestions={suggestions}
                onWidgetAction={onSend}
              />

              <Composer
                onSend={onSend}
                onCancel={onCancel}
                busy={busy}
                disabled={starting || status === "error"}
                labels={labels}
                placeholder={mode === "schedule" ? labels.placeholderSchedule : labels.placeholder}
              />
            </>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

function StatusBar({
  status,
  transportStatus,
  error,
  labels,
  onRetry,
}: {
  status: SessionStatus;
  transportStatus: TransportStatus;
  error: string | null;
  labels: AiChatLabels;
  onRetry: () => void;
}) {
  if (status === "error") {
    return (
      <div className="flex items-center gap-2 bg-error-red-50 px-4 py-2 text-caption text-error-red-800">
        <span className="min-w-0 flex-1">
          {error}
          {/* S11-F1: while centrifuge keeps re-dialing behind the scenes, say so — a silent red bar
              reads as "it's dead", when the room will in fact unlock itself on reconnect. */}
          {transportStatus === "connecting" && (
            <span className="mt-0.5 block text-error-red-800/70">{labels.reconnecting}</span>
          )}
        </span>
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 font-semibold underline cursor-pointer"
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  if (status === "starting" || transportStatus === "connecting") {
    return <div className="bg-brand-subtle px-4 py-1.5 text-caption text-brand">{labels.connecting}</div>;
  }

  if (transportStatus === "disconnected") {
    return (
      <div className="flex items-center gap-2 bg-overlay-hover px-4 py-1.5 text-caption text-text-body">
        <span className="min-w-0 flex-1 truncate">{labels.disconnected}</span>
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 font-semibold underline cursor-pointer"
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  return null;
}

const IconButton = React.forwardRef<
  HTMLButtonElement,
  { label: string; onClick?: () => void; active?: boolean; children: React.ReactNode }
>(function IconButton({ label, onClick, active, children, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        /* มุม 10 (`rounded-[10px]`) ไม่ใช่ 6 — ปุ่มไอคอนสี่ตัวเรียงกันในแถบหัวที่กว้าง 416
           มุมที่คมกว่ากล่องอื่นในแผงทำให้แถบนี้อ่านเป็นแถบเครื่องมือแยกจากเนื้อหา
           hover เป็นพื้นจางของแบรนด์ ไม่ใช่เทา — ปุ่มพวกนี้เป็นทางลัดของผู้ช่วย ไม่ใช่ปุ่มกลางของระบบ */
        "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-text-body transition-colors",
        "hover:bg-brand-subtle hover:text-brand-hover",
        active && "bg-brand-subtle text-brand-hover",
      )}
      {...props}
    >
      {children}
    </button>
  );
});

