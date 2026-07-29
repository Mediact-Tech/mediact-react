import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { CalendarDays, History, MessageCircle, Plus, X } from "lucide-react";
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
  mode: ChatMode;
  onModeChange?: (mode: ChatMode) => void;
  showModeToggle?: boolean;
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
    onModeChange,
    showModeToggle,
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
            "fixed inset-y-0 flex w-full flex-col bg-gray-50 shadow-2xl outline-none",
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
          <header className="flex items-center gap-2 border-b border-border-subtle bg-white px-4 py-3">
            <div className="min-w-0 flex-1">
              <RadixDialog.Title className="truncate text-sm font-semibold text-black">
                {labels.title}
              </RadixDialog.Title>
              <p className="truncate text-xs text-gray-500">{labels.subtitle}</p>
            </div>

            {/* Sits beside the actions rather than in the log: it describes the CONVERSATION, and it
                has to stay readable while the transcript scrolls. */}
            <ContextMeter usage={contextUsage ?? null} labels={labels} className="mr-1" />

            <IconButton label={labels.history} onClick={() => setHistoryOpen((v) => !v)} active={historyOpen}>
              <History className="size-4" />
            </IconButton>
            <IconButton label={labels.newChat} onClick={onNewChat}>
              <Plus className="size-4" />
            </IconButton>
            <RadixDialog.Close asChild>
              <IconButton label={labels.close}>
                <X className="size-4" />
              </IconButton>
            </RadixDialog.Close>
          </header>

          {/* Shown when the host enables the toggle OR the agent handed the turn into scheduling
              mode on its own — the user must always be able to see (and leave) the mode they're in. */}
          {(showModeToggle || mode === "schedule") && onModeChange && (
            <div className="flex gap-1 border-b border-border-subtle bg-white px-4 py-2">
              <ModeChip
                active={mode === "assistant"}
                onClick={() => onModeChange("assistant")}
                icon={<MessageCircle className="size-3.5" />}
                label={labels.assistantMode}
              />
              <ModeChip
                active={mode === "schedule"}
                onClick={() => onModeChange("schedule")}
                icon={<CalendarDays className="size-3.5" />}
                // Just "โหมดจัดเวร". The resolved department/sub-unit used to be appended here, which put a
                // long org name in a 2-word chip and repeated what the mode's own opening message already
                // states — the chip's job is to say which mode you are in, and how to leave it.
                label={labels.scheduleMode}
              />
            </div>
          )}

          {historyOpen && (
            <ConversationPicker
              load={loadConversations}
              activeId={activeConversationId}
              labels={labels}
              onPick={(id) => {
                setHistoryOpen(false);
                onPickConversation(id);
              }}
            />
          )}

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
      <div className="flex items-center gap-2 bg-error-red-50 px-4 py-2 text-xs text-error-red-800">
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
    return <div className="bg-brand-subtle px-4 py-1.5 text-xs text-brand">{labels.connecting}</div>;
  }

  if (transportStatus === "disconnected") {
    return (
      <div className="flex items-center gap-2 bg-gray-100 px-4 py-1.5 text-xs text-gray-600">
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
        "flex size-8 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors cursor-pointer",
        "hover:bg-gray-100 hover:text-black",
        active && "bg-brand-subtle text-brand",
      )}
      {...props}
    >
      {children}
    </button>
  );
});

function ModeChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
        active
          ? "bg-brand text-brand-foreground"
          : "border border-border-default bg-white text-gray-600 hover:bg-gray-50",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
