/**
 * Wire contract of mediact-ai-service (`/v2/ai/*` + the Centrifugo event protocol).
 *
 * Mirrors the service's own frozen shapes — `src/app/domains/chat-event.domain.ts`,
 * `widget.domain.ts` and the `dto/` classes. Anything here that drifts from those files
 * is a bug: the service is the source of truth, this is the typed view of it.
 */

/* ── REST ─────────────────────────────────────────────────────────────────── */

/** `POST /v2/ai/conversations` */
export interface Conversation {
  id: string;
  title: string | null;
  createdAt: string;
}

/** `GET /v2/ai/conversations` — one row of the resume picker. */
export interface ConversationListItem {
  id: string;
  title: string | null;
  preview: string | null;
  createdAt: string;
}

export type MessageRole = "user" | "assistant" | "system";

/** `GET /v2/ai/conversations/:id/messages` — transcript replayed on resume. */
export interface TranscriptMessage {
  role: MessageRole;
  content: string;
  /**
   * The confirm card this turn drew, when it is STILL answerable — the service drops the ones whose change
   * has already been saved or dropped, so a replayed transcript never offers a second confirm on something
   * that is done. Absent on every other turn.
   */
  widget?: WidgetEnvelope;
}

/** `POST /v2/ai/transport/subscribe` — what the FE needs to open the socket. */
export interface ConnectInfo {
  /** Absent when the service has no transport configured — the widget then reports it instead of hanging. */
  wsUrl?: string;
  channels: { chat: string; task: string };
}

/** Handle on an accepted async turn, returned by the `chat.send` RPC. */
export interface RunTicket {
  runId: string;
}

/** `POST /v2/ai/chat/runs/:runId/cancel` */
export interface CancelResult {
  cancelled: boolean;
}

/* ── chat.send params (Centrifugo RPC, not REST) ──────────────────────────── */

/** DEC-AI-06 — carried on EVERY turn; the backend never guesses it from the message. */
export type ChatMode = "assistant" | "schedule";

/**
 * The scope a turn runs in. The host app owns this (it knows which department/sub-unit
 * the user is looking at) and hands it to the widget, which forwards it unchanged.
 */
export interface ChatScope {
  departmentId?: number;
  subUnitId?: number;
  departmentName?: string;
  /** Scheduling-mode target month (1–12) + year — ignored in assistant mode. */
  month?: number;
  year?: number;
}

export interface ChatSendParams extends ChatScope {
  conversationId: string;
  message: string;
  mode?: ChatMode;
  ops?: unknown[];
}

/* ── Centrifugo event protocol (chat:{id} / task:{id}) ────────────────────── */

export type ChatEventName =
  | "user_turn"
  | "token"
  | "tool_call"
  | "widget"
  | "proposal"
  | "task_state"
  | "done";

/**
 * The question that opened a turn.
 *
 * Every other event is the ASSISTANT half of a turn, so the channel used to carry only half a conversation:
 * a client that did not type the question had no way to hear it. Published before the answer is queued, so
 * it is always on screen before the first token.
 */
export interface UserTurnPayload {
  message: string;
}

export interface TokenPayload {
  delta: string;
}

export interface ToolCallPayload {
  /** Thai transparency label, e.g. "กำลังตรวจกฎของแผนก…" (RR-A.6). */
  label_th: string;
  status: "start" | "done" | "error";
}

export interface ProposalPayload {
  proposalId: string;
  ops: unknown[];
  summary_th: string;
}

export interface TaskStatePayload {
  threadId: string;
  stage: string;
}

/**
 * How full this conversation's replayable context is.
 *
 * `limit` is NOT the model's window — it is the budget past which ai-service drops the conversation's
 * OLDEST turns to make room. That is the line a user actually feels ("why did it forget what I said at the
 * start?"), which is why it is worth showing before it is crossed.
 */
export interface ContextUsage {
  /** Estimated tokens the next turn would replay. May exceed `limit` — that overflow is what gets dropped. */
  used: number;
  limit: number;
  /** This turn already had to drop older messages. */
  trimmed?: boolean;
}

export interface DonePayload {
  usage: unknown;
  /** Did a write actually apply this turn? Render the badge from THIS, never from the prose. */
  committed?: boolean;
  /** True once the post-apply verify confirmed live state matches intent. */
  converged?: boolean;
  /** `answered` | `max_steps` | `timeout` | `cancelled` | `budget_exceeded` | `guard_loop` */
  stopReason?: string;
  /** Absent when history replay is off server-side — then nothing accumulates and there is nothing to show. */
  context?: ContextUsage;
}

/* ── Widget payloads (contracts §3, FROZEN — 7 types) ─────────────────────── */

export type WidgetType =
  | "confirm"
  | "staff_picker"
  | "error_card"
  | "schedule_diff"
  | "rule_form"
  | "summary_stats"
  | "extraction_review";

export interface ConfirmWidget {
  title_th: string;
  summary_th: string;
  confirmLabel: string;
  cancelLabel: string;
  proposalId?: string;
  resumeToken: string;
}

export interface StaffPickerWidget {
  prompt_th: string;
  candidates: Array<{
    userId: number;
    displayName: string;
    subUnit?: string;
    hint?: string;
  }>;
  allowNickname?: boolean;
}

export interface ErrorCardWidget {
  code: string;
  severity: "error" | "warning";
  message_th: string;
  location?: { userId: number; date: string; shiftType: string };
  fixActions: Array<{ label_th: string; opRef: string }>;
}

export interface ScheduleDiffWidget {
  scheduleId: number;
  version: number;
  changes: Array<{
    date: string;
    userId: number;
    before: string | null;
    after: string | null;
  }>;
  mobileLayout: "perDay" | "perStaff";
}

export interface RuleFormWidget {
  ruleCode: string;
  prefill: Record<string, unknown>;
  humanSummary_th: string;
  saveOpRef: string;
}

export interface SummaryStatsWidget {
  scheduleId: number;
  stats: Array<{ label_th: string; value: number | string; flag?: "high" | "low" }>;
  warnings_th: string[];
}

export interface ExtractionReviewWidget {
  sourceRef: string;
  sections: Array<{
    target: "shift_types" | "staff" | "operating_hours" | "placements";
    rows: Array<{
      fields: Record<string, unknown>;
      confidence: number;
      sourceCrop?: string;
      resolve?: StaffPickerWidget;
      unresolved?: boolean;
    }>;
  }>;
  warnings_th: string[];
  applyOpRefs: string[];
}

export interface WidgetPayloadMap {
  confirm: ConfirmWidget;
  staff_picker: StaffPickerWidget;
  error_card: ErrorCardWidget;
  schedule_diff: ScheduleDiffWidget;
  rule_form: RuleFormWidget;
  summary_stats: SummaryStatsWidget;
  extraction_review: ExtractionReviewWidget;
}

export interface WidgetEnvelope<T extends WidgetType = WidgetType> {
  type: T;
  payload: WidgetPayloadMap[T];
}

/**
 * Which turn an event belongs to (`ai_runs.id`), carried on every member of the union below.
 *
 * `chat:{conversationId}` is shared by every client the owner has open, so two browser tabs on the same
 * conversation both receive every publication. Without a turn name a client can only guess whose tokens
 * these are — and the guess it used to make ("I have a bubble open, so they must be mine") is wrong in
 * exactly the case that matters. Optional: an older service sends nothing here, and the session falls
 * back to that same guess rather than breaking.
 */
interface TurnStamp {
  turnId?: string;
}

/** One message on `chat:{conversationId}` — the discriminated union of the §4 protocol. */
export type ChatEvent =
  | ({ event: "user_turn"; payload: UserTurnPayload } & TurnStamp)
  | ({ event: "token"; payload: TokenPayload } & TurnStamp)
  | ({ event: "tool_call"; payload: ToolCallPayload } & TurnStamp)
  | ({ event: "widget"; payload: WidgetEnvelope } & TurnStamp)
  | ({ event: "proposal"; payload: ProposalPayload } & TurnStamp)
  | ({ event: "task_state"; payload: TaskStatePayload } & TurnStamp)
  | ({ event: "done"; payload: DonePayload } & TurnStamp);
