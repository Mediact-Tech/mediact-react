import * as React from 'react';
import { ClassValue } from 'clsx';

/**
 * Wire contract of mediact-ai-service (`/v2/ai/*` + the Centrifugo event protocol).
 *
 * Mirrors the service's own frozen shapes — `src/app/domains/chat-event.domain.ts`,
 * `widget.domain.ts` and the `dto/` classes. Anything here that drifts from those files
 * is a bug: the service is the source of truth, this is the typed view of it.
 */
/** `POST /v2/ai/conversations` */
interface Conversation {
    id: string;
    title: string | null;
    createdAt: string;
}
/** `GET /v2/ai/conversations` — one row of the resume picker. */
interface ConversationListItem {
    id: string;
    title: string | null;
    preview: string | null;
    createdAt: string;
}
type MessageRole = "user" | "assistant" | "system";
/** `GET /v2/ai/conversations/:id/messages` — transcript replayed on resume. */
interface TranscriptMessage {
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
interface ConnectInfo {
    /** Absent when the service has no transport configured — the widget then reports it instead of hanging. */
    wsUrl?: string;
    channels: {
        chat: string;
        task: string;
    };
}
/** Handle on an accepted async turn, returned by the `chat.send` RPC. */
interface RunTicket {
    runId: string;
}
/** `POST /v2/ai/chat/runs/:runId/cancel` */
interface CancelResult {
    cancelled: boolean;
}
/** DEC-AI-06 — carried on EVERY turn; the backend never guesses it from the message. */
type ChatMode = "assistant" | "schedule";
/**
 * The scope a turn runs in. The host app owns this (it knows which department/sub-unit
 * the user is looking at) and hands it to the widget, which forwards it unchanged.
 */
interface ChatScope {
    departmentId?: number;
    subUnitId?: number;
    departmentName?: string;
    /** Scheduling-mode target month (1–12) + year — ignored in assistant mode. */
    month?: number;
    year?: number;
}
interface ChatSendParams extends ChatScope {
    conversationId: string;
    message: string;
    mode?: ChatMode;
    ops?: unknown[];
}
type ChatEventName = "user_turn" | "token" | "tool_call" | "widget" | "proposal" | "task_state" | "done";
/**
 * The question that opened a turn.
 *
 * Every other event is the ASSISTANT half of a turn, so the channel used to carry only half a conversation:
 * a client that did not type the question had no way to hear it. Published before the answer is queued, so
 * it is always on screen before the first token.
 */
interface UserTurnPayload {
    message: string;
}
interface TokenPayload {
    delta: string;
}
interface ToolCallPayload {
    /** Thai transparency label, e.g. "กำลังตรวจกฎของแผนก…" (RR-A.6). */
    label_th: string;
    status: "start" | "done" | "error";
}
interface ProposalPayload {
    proposalId: string;
    ops: unknown[];
    summary_th: string;
}
interface TaskStatePayload {
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
interface ContextUsage {
    /** Estimated tokens the next turn would replay. May exceed `limit` — that overflow is what gets dropped. */
    used: number;
    limit: number;
    /** This turn already had to drop older messages. */
    trimmed?: boolean;
}
interface DonePayload {
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
type WidgetType = "confirm" | "staff_picker" | "error_card" | "schedule_diff" | "rule_form" | "summary_stats" | "extraction_review";
interface ConfirmWidget {
    title_th: string;
    summary_th: string;
    confirmLabel: string;
    cancelLabel: string;
    proposalId?: string;
    resumeToken: string;
}
interface StaffPickerWidget {
    prompt_th: string;
    candidates: Array<{
        userId: number;
        displayName: string;
        subUnit?: string;
        hint?: string;
    }>;
    allowNickname?: boolean;
}
interface ErrorCardWidget {
    code: string;
    severity: "error" | "warning";
    message_th: string;
    location?: {
        userId: number;
        date: string;
        shiftType: string;
    };
    fixActions: Array<{
        label_th: string;
        opRef: string;
    }>;
}
interface ScheduleDiffWidget {
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
interface RuleFormWidget {
    ruleCode: string;
    prefill: Record<string, unknown>;
    humanSummary_th: string;
    saveOpRef: string;
}
interface SummaryStatsWidget {
    scheduleId: number;
    stats: Array<{
        label_th: string;
        value: number | string;
        flag?: "high" | "low";
    }>;
    warnings_th: string[];
}
interface ExtractionReviewWidget {
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
interface WidgetPayloadMap {
    confirm: ConfirmWidget;
    staff_picker: StaffPickerWidget;
    error_card: ErrorCardWidget;
    schedule_diff: ScheduleDiffWidget;
    rule_form: RuleFormWidget;
    summary_stats: SummaryStatsWidget;
    extraction_review: ExtractionReviewWidget;
}
interface WidgetEnvelope<T extends WidgetType = WidgetType> {
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
type ChatEvent = ({
    event: "user_turn";
    payload: UserTurnPayload;
} & TurnStamp) | ({
    event: "token";
    payload: TokenPayload;
} & TurnStamp) | ({
    event: "tool_call";
    payload: ToolCallPayload;
} & TurnStamp) | ({
    event: "widget";
    payload: WidgetEnvelope;
} & TurnStamp) | ({
    event: "proposal";
    payload: ProposalPayload;
} & TurnStamp) | ({
    event: "task_state";
    payload: TaskStatePayload;
} & TurnStamp) | ({
    event: "done";
    payload: DonePayload;
} & TurnStamp);

/** A tool call plus when the client first saw it — the elapsed counter is rendered from this. */
interface ToolCallEntry extends ToolCallPayload {
    startedAt: number;
}
/** One rendered turn. Assistant turns accumulate their tool trail + widgets as events arrive. */
interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    /** True while tokens are still streaming into this turn. */
    streaming?: boolean;
    /** Transparency trail (RR-A.6) — what the agent did during this turn. */
    tools?: ToolCallEntry[];
    /** Structured widgets emitted during this turn (confirm / error_card / schedule_diff / …). */
    widgets?: WidgetEnvelope[];
    /** Present once `done` arrived — drives the write-outcome badge, never the prose. */
    outcome?: DonePayload;
    /** This turn ended in an error; `content` holds the reason. Rendered as a failed bubble. */
    failed?: boolean;
}
type SessionStatus = "idle" | "starting" | "ready" | "sending" | "streaming" | "error";
/**
 * Locales the widget ships copy for.
 *
 * Deliberately a closed set of two: the apps run Thai and English, and a third would need a whole
 * label set written by someone who speaks it. A host with another language injects `labels` instead —
 * that path stays open and needs no change here.
 */
type AiChatLocale = "th" | "en";
/** Labels the host can override — Thai defaults, since every consuming app runs Thai-first. */
interface AiChatLabels {
    launcher: string;
    title: string;
    subtitle: string;
    placeholder: string;
    /** Composer hint while scheduling mode is active — the two modes accept different things. */
    placeholderSchedule: string;
    send: string;
    cancel: string;
    newChat: string;
    history: string;
    emptyTitle: string;
    emptyHint: string;
    connecting: string;
    disconnected: string;
    /** Sub-line on the error bar while the socket is auto-redialing (S11-F1). */
    reconnecting: string;
    retry: string;
    /**
     * The button that puts the panel away — NOT a "close".
     *
     * Hiding the drawer keeps the thread: `start()` resumes the remembered conversation, so reopening lands
     * back in the same transcript. An ✕ in the corner said the opposite, and users read it as "end this chat",
     * which is why the glyph is a collapse chevron and this label says so in words.
     */
    minimize: string;
    committed: string;
    notCommitted: string;
    thinking: string;
    scheduleMode: string;
    /**
     * 🔴 No longer rendered by the drawer — the header states the mode, it does not offer to change it.
     * Kept because it is part of the public label set three apps may already override, and because the
     * name of the default mode is the obvious thing a host writes into its own copy.
     */
    assistantMode: string;
    /** Accessible name of the popover that asks how to open a link the assistant wrote. */
    linkOpenTitle: string;
    /** "Open here" — navigates this tab, ending the page the conversation was about. */
    linkOpenHere: string;
    /** "Open in a new tab" — keeps the conversation alive behind it. */
    linkOpenNewTab: string;
    /**
     * ป้ายกำกับผู้พูดเหนือทุกเทิร์น
     *
     * 🔴 มีเพราะสีอย่างเดียวบอกไม่ได้ว่าใครพูด — คนที่แยกสีเขียว/เทาไม่ออก หรืออ่านผ่านโปรแกรม
     * อ่านหน้าจอ จะเหลือแค่ "ข้อความชิดซ้าย/ชิดขวา" ซึ่งไม่ใช่ข้อมูล
     */
    you: string;
    assistant: string;
    /** หัวของหน้าประวัติ — คนละคำกับ `history` ที่เป็น tooltip ของปุ่ม */
    historyTitle: string;
    historySearch: string;
    historyBack: string;
    historyClose: string;
    /** หัวกลุ่มของรายการ — จัดตาม **วันที่เริ่ม** บทสนทนา ไม่ใช่วันที่คุยล่าสุด (ดู `ConversationPicker`) */
    historyToday: string;
    historyEarlier: string;
    /** ไม่พบผลลัพธ์จากคำค้น — ต่างจาก `emptyHint` ที่แปลว่ายังไม่เคยมีบทสนทนาเลย */
    historyNoMatch: string;
    /**
     * บอกเมื่อรายการชนเพดานที่หลังบ้านคืนมา (`listSummaries` cap 100)
     *
     * ⚠️ ไม่มี API ค้นหา — การค้นเป็นการกรองรายการที่โหลดมาแล้วเท่านั้น ⇒ ถ้าไม่บอก ผู้ใช้ที่มีบทสนทนา
     * เกินเพดานจะคิดว่า "ค้นแล้วไม่มี" ทั้งที่แปลว่า "ค้นไม่ถึง"
     */
    historyCapped: string;
    /** ใช้เมื่อบทสนทนาไม่มีทั้ง `title` และ `preview` — ทั้งคู่ nullable ในสัญญาของ service */
    historyUntitled: string;
    /** เวลาสัมพัทธ์บนรายการประวัติ — `{count}` คือจำนวนเต็มที่ปัดลงแล้ว */
    timeJustNow: string;
    timeMinutesAgo: string;
    timeHoursAgo: string;
    /**
     * BCP-47 tag ที่ `toLocaleDateString` ใช้กับรายการที่เก่ากว่าหนึ่งวัน
     *
     * 🔴 อยู่ใน `labels` ทั้งที่ไม่ใช่ "คำ" เพราะมันคือสิ่งที่ผู้ใช้อ่านเหมือนกัน และต้องเปลี่ยน
     * **พร้อมกัน**กับคำอื่น — แยกไปเป็น prop ต่างหากเมื่อไหร่ ก็มีวันที่จอพูดอังกฤษแต่วันที่เป็น
     * พ.ศ. ⚠️ `th-TH` ให้ปีพุทธศักราช ส่วน `en-GB` ให้ ค.ศ. แบบวัน-เดือน (ไม่ใช่ `en-US`
     * ที่สลับเป็นเดือน-วัน)
     */
    dateLocale: string;
    /** Onboarding shown right after entering scheduling mode. `{context}` = the scoped/unscoped line. */
    scheduleGreeting: string;
    /** `{department}` + `{subUnit}` + `{period}` — used when the hand-off already resolved the scope. */
    scheduleGreetingScoped: string;
    /** The `{subUnit}` fragment itself — the ward a roster is actually built in. Empty when unknown. */
    scheduleGreetingSubUnit: string;
    /** The `{period}` fragment itself — `{month}` / `{year}`. Empty when the hand-off carried no month. */
    scheduleGreetingPeriod: string;
    /** Used when nothing is resolved yet, to ask for department + month. */
    scheduleGreetingUnscoped: string;
    /** Context meter tooltip. `{used}` / `{limit}` are token counts, already grouped with commas. */
    contextTooltip: string;
    /** Appended to the tooltip once the service has actually dropped older messages. */
    contextTrimmed: string;
}
/**
 * Sign the widget in AS ITSELF, against its own Keycloak client, instead of borrowing the host app's token.
 *
 * Why it matters beyond tidiness: revise-api authorizes per KC client (`azp`). Its scheduling routes admit
 * `mediwork` and `mediact-ai-assistant` — so the very same widget that works inside Mediwork gets a 403 for
 * the auto-scheduler inside Portal, purely because of whose token it forwarded. Holding its own
 * `mediact-ai-assistant` token makes the widget behave identically in all three apps, without opening those
 * routes to each app's own front end.
 *
 * The user is not asked to log in again: the browser already has an SSO session for the realm, and
 * `check-sso` adopts it silently in an iframe. That iframe is same-SITE in every deployed environment
 * (`*.mediact.biz`), so cookie policy allows it; on localhost, where it is cross-site and blocked, the
 * widget falls back to the host's `getToken`.
 */
interface AiChatAuthConfig {
    /** Keycloak base URL, e.g. `https://sso.non-prod.mediact.biz`. */
    url: string;
    /** Realm the host app itself authenticates against — it must be the SAME one to reuse the SSO session. */
    realm: string;
    /** Defaults to `mediact-ai-assistant` — the client revise-api allow-lists for AI traffic. */
    clientId?: string;
    /**
     * Page that completes the silent check. Defaults to `${origin}/silent-check-sso.html`; the host app must
     * serve that file (3 lines, see the README) or silent adoption cannot report back.
     */
    silentCheckSsoRedirectUri?: string;
    /**
     * How long to wait for the silent check before falling back to `getToken`. Default 3000ms — raise it only
     * on a slow network, never to "make it work": a check that needs longer is being blocked, not delayed.
     */
    initTimeoutMs?: number;
}
interface AiChatConfig {
    /** ai-service base URL, e.g. `http://localhost:8086`. */
    baseUrl: string;
    /**
     * Current Keycloak access token from the HOST app. Optional once `auth` is set, where it becomes the
     * fallback for browsers that refuse the silent check (localhost, blocked third-party cookies).
     */
    getToken?: () => string | Promise<string>;
    /** Let the widget hold its own Keycloak session — see `AiChatAuthConfig` for why this is preferable. */
    auth?: AiChatAuthConfig;
    /** Department/sub-unit (and scheduling month) the turn runs against. Read fresh on each send. */
    scope?: ChatScope;
    /** Default turn mode. `schedule` switches the backend to the roster agent profile (DEC-AI-06). */
    mode?: ChatMode;
    /**
     * @deprecated Ignored since the mode became read-only. Entering and leaving scheduling mode is the
     * assistant's decision (`[[ENTER_MODE:…]]` in, `exit` back), so the drawer states the mode instead of
     * offering a switch. Still accepted so hosts that pass it keep compiling; remove it on their next pass.
     */
    showModeToggle?: boolean;
    /** Example questions on the empty state — tapping one sends it. Defaults to roster examples. */
    suggestions?: string[];
    /** Which corner the launcher sits in. Default `bottom-right`. */
    position?: "bottom-right" | "bottom-left";
    /**
     * Which shipped copy set to start from. Default `th`.
     *
     * 🔴 The host must pass its **current** language, not the one it booted with — the widget is mounted
     * once at the root and never remounts, so a value read once at mount freezes the chat in whatever
     * language the user happened to start in.
     */
    locale?: AiChatLocale;
    labels?: Partial<AiChatLabels>;
    /** Surfaced for host-side logging/monitoring — the widget renders its own error state regardless. */
    onError?: (error: Error) => void;
    fetchImpl?: typeof fetch;
    debug?: boolean;
}

interface AiChatWidgetProps extends AiChatConfig {
    /** Controlled open state. Omit to let the widget own it. */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Hide the built-in launcher when the host opens the drawer from its own button. */
    hideLauncher?: boolean;
    className?: string;
}
/**
 * The single component every app mounts — floating launcher + chat drawer, one import.
 *
 * Mount it once, high in the tree (Portal `_app`, Mediwork/Medimatch root layout). Nothing
 * happens until the user opens it: no socket, no request. Everything the widget needs from
 * the host arrives as props (`baseUrl`, `getToken`, `scope`), so it stays free of any app's
 * auth wiring, HTTP client or router.
 */
declare function AiChatWidget({ open: controlledOpen, defaultOpen, onOpenChange, hideLauncher, className, ...config }: AiChatWidgetProps): React.JSX.Element;

/**
 * Host → widget bridge. The drawer is mounted ONCE at the app root, but the moments that want to
 * open it live deep inside feature screens (a diagnostics banner, an error toast). Threading an
 * `open` prop through every layer would couple all of them to the root layout, so the bridge is a
 * window CustomEvent instead: any host code calls `openAiChat(...)`, the mounted widget listens.
 */
declare const AI_CHAT_OPEN_EVENT = "mediact-ai-chat:open";
interface AiChatOpenDetail {
    /** Sent as the user's turn once the session is ready. Omit to just open the drawer. */
    message?: string;
    /** Switch the conversation to this mode before sending (e.g. `schedule` for roster work). */
    mode?: ChatMode;
}
/**
 * Open the chat drawer — and, with `message`, send it as the user once the session connects.
 * Returns false when no widget is mounted to receive it, so callers can fall back to their own hint
 * instead of silently doing nothing.
 */
declare function openAiChat(detail?: AiChatOpenDetail): boolean;

/**
 * Thai copy — the widget's primary locale, and the fallback for every key an override omits.
 *
 * 🔴 Kept exported as `defaultLabels` under its original name: three apps import it and one test
 * asserts on it. Adding `en` must not force any of them to change a line.
 */
declare const thLabels: AiChatLabels;
/**
 * English copy.
 *
 * ⚠️ This covers the widget's own chrome only. Everything the **service** sends back — tool-trail
 * labels, confirm cards, error explanations — arrives on `*_th` fields in the wire contract, with no
 * English counterpart, so those stay Thai whatever this is set to. See `labels.md`.
 */
declare const enLabels: AiChatLabels;
/** Every locale the widget ships copy for. A host that needs another one injects `labels` instead. */
declare const labelsByLocale: Record<AiChatLocale, AiChatLabels>;
/** @deprecated in name only — kept because three apps and one test import it. Same object as `thLabels`. */
declare const defaultLabels: AiChatLabels;
/**
 * Base copy for `locale`, with the host's own `labels` layered on top.
 *
 * 🔴 The merge is one level deep and **partial by design**: an app that only wants to rename the
 * launcher passes one key and keeps the rest of that locale. Falling back to Thai for a missing key
 * would be worse than useless in an English UI, which is why the base is picked *before* the merge,
 * not after.
 */
declare function resolveLabels(overrides?: Partial<AiChatLabels>, locale?: AiChatLocale): AiChatLabels;
/**
 * Onboarding message rendered right after entering scheduling mode. Without it the user lands in a
 * mode with no idea what it can do — the dead-end the playground client calls out explicitly.
 */
declare function buildScheduleGreeting(labels: AiChatLabels, seed: {
    departmentName?: string;
    subUnitName?: string;
    month?: number;
    year?: number;
} | null): string;

/**
 * WebSocket half of the contract. Sending a turn is WS-only (`chat.send` RPC through the
 * Centrifugo proxy) — there is no HTTP fallback by design, so this is the answer path too:
 * every token/tool_call/widget/done arrives as a publication on `chat:{conversationId}`.
 *
 * Auth: no minted Centrifugo token. The socket authenticates by passing the Keycloak token as
 * connect `data`, which the service's connect proxy verifies.
 *
 * ⚠️ Token freshness is a CONNECTION-level concern here, not a request-level one. The connect
 * proxy pins the JWT into the connection meta (`coreJwt`) and every later `chat.send` is executed
 * with THAT token — it is forwarded to revise-api as the caller's Bearer and never re-verified.
 * Centrifugo is configured without a refresh proxy and the connect reply carries no `expire_at`,
 * so nothing re-pins it on its own: a drawer left open past the access token's lifetime would keep
 * sending turns that fail downstream. Hence `ensureFreshConnection()` — reconnecting is the only
 * way to install a refreshed token, so we do it exactly when the token actually changed.
 */
type TransportStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";
interface ChatTransportConfig {
    wsUrl: string;
    getToken: () => string | Promise<string>;
    channels: {
        chat: string;
        task: string;
    };
    onEvent: (event: ChatEvent, channel: "chat" | "task") => void;
    onStatusChange?: (status: TransportStatus) => void;
    onError?: (error: Error) => void;
    /** Forwarded to centrifuge — `localStorage.centrifuge.debug = true` also works at runtime. */
    debug?: boolean;
}
declare class ChatTransport {
    private readonly config;
    private client;
    private subs;
    private status;
    /** The token the current connection was opened with — what the service will forward downstream. */
    private pinnedToken;
    /** Suppresses the transient "disconnected" blip while we deliberately re-pin the token. */
    private repinning;
    constructor(config: ChatTransportConfig);
    get currentStatus(): TransportStatus;
    connect(): Promise<void>;
    /**
     * Re-open the socket if the host's token changed since it was pinned. Cheap in the common case
     * (a string compare), and the reconnect only happens on the ~5-minute cadence of a real refresh.
     */
    ensureFreshConnection(): Promise<void>;
    /** Send one turn. Resolves with the run ticket the client tracks for streaming/cancel. */
    send(params: ChatSendParams): Promise<RunTicket>;
    /** Resolves true once connected, false on timeout. */
    waitUntilConnected(timeoutMs?: number): Promise<boolean>;
    disconnect(): void;
    private teardown;
    private setStatus;
}

interface ChatDrawerProps {
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
declare function ChatDrawer(props: ChatDrawerProps): React.JSX.Element;

interface FloatingButtonProps {
    open: boolean;
    onClick: () => void;
    /** ชื่อของปุ่ม — ไปอยู่ที่ `aria-label` และ `title` เพราะปุ่มไม่มีคำบนตัวมันเอง */
    label: string;
    /** ฝั่งที่ปุ่ม **เด้งกลับไปเกาะ** ทุกครั้งที่ปล่อย */
    position?: "bottom-right" | "bottom-left";
    /**
     * ลากไปไหนก็ได้ · ปล่อยแล้วเด้งกลับไปชิดฝั่ง · ค่าเริ่มต้น `true`
     *
     * ปิดเมื่อโฮสต์มีเหตุผลให้ปุ่มอยู่กับที่ (เช่นจอที่สอนผู้ใช้ว่าปุ่มอยู่ตรงไหน)
     */
    draggable?: boolean;
    className?: string;
}
/**
 * The always-mounted entry point. Sits in a viewport corner on top of the host app, so it
 * carries the widget's z-index var — a host that needs it lower overrides
 * `--mediact-ai-chat-z` rather than patching the component.
 *
 * ── 🔄 วงกลมไอคอนล้วน + ลากได้อิสระ แล้วเด้งกลับไปชิดฝั่ง 2026-08-16 ────────────
 *
 * เดิมสถานะปิดเป็น **แคปซูลที่มีคำว่า "ผู้ช่วย AI"** โดยตั้งใจ — เหตุผลเดิมคือฟองแชทเปล่า ๆ
 * มุมจอในระบบโรงพยาบาลอ่านว่า "แชทฝ่ายสนับสนุน" ซึ่งไม่มีใครกดเพื่อถามว่าคืนนี้ใครขึ้นเวร
 *
 * 🔑 **กลับคำเพราะเหตุผลที่หนักกว่า: แคปซูลบังจอ** — มันกว้างพอจะทับปุ่ม/ตารางที่มุมล่างของ
 * จอที่ผู้ใช้กำลังทำงานอยู่ · สิ่งที่แลกมาคือ "ปุ่มนี้คืออะไร" ต้องมาจากทางอื่นแทน:
 * - `aria-label` + `title` ยังเป็นคำเต็ม ⇒ hover ก็เห็น · โปรแกรมอ่านหน้าจอก็ได้ยิน
 * - `Sparkles` ยังอยู่ ⇒ คนที่รู้ convention ของ AI อ่านออกทันที
 * ⚠️ **คนที่ไม่รู้ทั้งสองทางจะไม่รู้ว่าปุ่มนี้ทำอะไรจนกว่าจะกด** — เป็นราคาที่รับไว้
 *
 * 🔴 **ลากได้ทุกทิศ แต่ปล่อยแล้วเด้งกลับไปชิดฝั่งเสมอ · จำไว้แค่ความสูง**
 * ระหว่างลากปุ่มตามนิ้วอิสระเพราะนั่นคือสิ่งที่มือคาดหวัง — แต่จุดจอดต้องอยู่ที่ขอบ:
 * 1. `ChatDrawer` กางออกจาก**ฝั่งเดียวกับปุ่ม** ⇒ ปุ่มที่จอดกลางจอไม่มีความสัมพันธ์กับแผงที่มันเปิด
 *    และตอนเปิดอยู่มันคือปุ่ม "พับ" ซึ่งชี้ไปทางขอบ
 * 2. ปุ่มที่จอดกลางเนื้อหาบังหนักกว่าเดิม — ตรงข้ามกับเหตุผลที่ย่อมันลงเป็นวงกลม
 * 3. จุดจอดที่เดาได้ = ผู้ใช้หาปุ่มเจอทุกครั้งโดยไม่ต้องกวาดสายตาทั้งจอ
 *
 * 🔴 **ลากแล้วต้องไม่นับเป็นการกด** — `click` ยิงหลัง `pointerup` เสมอ ⇒ ถ้าไม่กันไว้
 * ผู้ใช้จะย้ายปุ่มทีไรแชทเด้งเปิดทุกที · กันด้วยระยะขั้นต่ำ 4px ไม่ใช่ "ขยับหรือยัง"
 * เพราะนิ้ว/เมาส์สั่น 1–2px ระหว่างกดปกติเป็นเรื่องธรรมดา
 */
declare const FloatingButton: React.ForwardRefExoticComponent<FloatingButtonProps & React.RefAttributes<HTMLButtonElement>>;

interface MessageListProps {
    messages: ChatMessage[];
    labels: AiChatLabels;
    onWidgetAction: (reply: string) => void;
    busy?: boolean;
    /** Example questions shown on the empty state — tapping one sends it. */
    suggestions?: string[];
}
declare function MessageList({ messages, labels, onWidgetAction, busy, suggestions, }: MessageListProps): React.JSX.Element;

interface MessageBubbleProps {
    message: ChatMessage;
    labels: AiChatLabels;
    onWidgetAction: (reply: string) => void;
    /**
     * Are this turn's widget buttons unanswerable? True while a turn is in flight, and for every card that is
     * no longer the last thing that happened — a card whose change has been confirmed or cancelled still shows
     * what it was, but pressing it would answer for a proposal that is gone.
     */
    widgetsDisabled?: boolean;
}
declare function MessageBubble({ message, labels, onWidgetAction, widgetsDisabled }: MessageBubbleProps): React.JSX.Element;

interface ComposerProps {
    onSend: (text: string) => void;
    onCancel: () => void;
    /** A run is in flight — the send button becomes stop. */
    busy: boolean;
    disabled?: boolean;
    labels: AiChatLabels;
    /** Overrides the default hint (scheduling mode accepts different input). */
    placeholder?: string;
}
declare function Composer({ onSend, onCancel, busy, disabled, labels, placeholder, }: ComposerProps): React.JSX.Element;

interface ConversationPickerProps {
    load: () => Promise<ConversationListItem[]>;
    onPick: (conversationId: string) => void;
    activeId: string | null;
    labels: AiChatLabels;
}
/**
 * จอประวัติ — **เต็มแผง ไม่ใช่แผ่นซ้อน**
 *
 * ลิ้นชักกว้าง 26rem (416px) · ของเดิมเป็นรายการสูง `max-h-64` แทรกอยู่ใต้แถบหัวโดยที่บทสนทนายังอยู่ข้างล่าง
 * ⇒ เห็นได้ทีละ ~4 แถว หัวข้อถูกตัดกลางคำ และ "ตอนนี้ฉันอยู่โหมดไหน" ตอบได้ไม่ชัด
 * การกินพื้นที่ทั้งใบทำให้รายการได้ความกว้างเต็ม มีที่พอสำหรับข้อความตัวอย่างบรรทัดที่สอง และมีช่องค้นหาได้
 *
 * โหลดตอนเปิดเท่านั้น — ลิ้นชักที่ปิดอยู่จึงไม่กินคำขอสักครั้ง
 */
declare function ConversationPicker({ load, onPick, activeId, labels }: ConversationPickerProps): React.JSX.Element;

/**
 * Renders the frozen §3 widget payloads. The service owns the shapes; how they look is ours.
 *
 * Interaction contract (Wave 0): a widget's buttons answer by SENDING A NORMAL TURN — the agent
 * loop reads the reply like any other user message. When the real producers land (F-A.2 confirm /
 * F-A.4 rule_form) and carry a resume op, swap `onAction` for that call — the payloads already
 * carry `resumeToken` / `opRef` for it.
 */
interface WidgetRendererProps {
    widget: WidgetEnvelope;
    onAction: (reply: string) => void;
    disabled?: boolean;
}
declare function WidgetRenderer({ widget, onAction, disabled }: WidgetRendererProps): React.JSX.Element;

/**
 * RR-A.6 transparency trail — what the agent actually did this turn, in the service's own
 * Thai labels. Rendered above the answer so a long tool run never looks like a hang.
 */
declare function ToolTrail({ tools }: {
    tools: ToolCallEntry[];
}): React.JSX.Element | null;

interface ContextMeterProps {
    usage: ContextUsage | null;
    labels: AiChatLabels;
    className?: string;
}
declare function ContextMeter({ usage, labels, className }: ContextMeterProps): React.JSX.Element | null;

declare function Markdown({ text, className, labels, }: {
    text: string;
    className?: string;
    labels?: AiChatLabels;
}): React.JSX.Element;

/**
 * Scope resolved at hand-off, so scheduling mode doesn't have to re-ask which department/month.
 *
 * `subUnitName` is the one field here the service does NOT accept back — it exists so the greeting can
 * name the ward. Send with `seedScope()`, never the seed itself.
 */
type ScheduleSeed = Pick<ChatScope, "departmentId" | "subUnitId" | "departmentName" | "month" | "year"> & {
    subUnitName?: string;
};
/** The half of a seed the service takes. Drops the display-only name. */
declare function seedScope(seed: ScheduleSeed): ChatScope;
/** `[[ENTER_MODE:schedule|dept=7|deptName=ICU|subUnit=12|subUnitName=Ward%203|month=8|year=2026]]` → seed. */
declare function extractEnterMode(text: string): ScheduleSeed | null;
declare function hasExitMode(text: string): boolean;
declare function extractRedirect(text: string): string | null;
declare function stripSentinels(text: string): string;

/**
 * REST half of the ai-service contract (`/v2/ai/*`). Deliberately built on plain `fetch`
 * rather than the host app's HTTP client — Portal uses ky, Mediwork/Medimatch use their
 * own wrappers, and a shared widget must not care which.
 *
 * Auth is inverted: the widget never touches Keycloak. The host hands in `getToken`
 * (re-read per request, so a refreshed token is picked up without remounting).
 */
declare class AiChatApiError extends Error {
    readonly status: number;
    readonly body?: unknown | undefined;
    constructor(message: string, status: number, body?: unknown | undefined);
}
interface AiChatApiConfig {
    /** e.g. `https://ai.dev.mediact.biz` or `http://localhost:8086` — no trailing slash needed. */
    baseUrl: string;
    /** Returns the caller's current Keycloak access token. May be async (refresh-aware). */
    getToken: () => string | Promise<string>;
    /** Injectable for tests / non-browser runtimes. */
    fetchImpl?: typeof fetch;
}
interface AiChatApi {
    createConversation(title?: string, signal?: AbortSignal): Promise<Conversation>;
    listConversations(signal?: AbortSignal): Promise<ConversationListItem[]>;
    getMessages(conversationId: string, signal?: AbortSignal): Promise<TranscriptMessage[]>;
    connectInfo(conversationId: string, signal?: AbortSignal): Promise<ConnectInfo>;
    cancelRun(runId: string, signal?: AbortSignal): Promise<CancelResult>;
}
declare function createAiChatApi(config: AiChatApiConfig): AiChatApi;

interface SessionState {
    conversationId: string | null;
    messages: ChatMessage[];
    status: SessionStatus;
    transportStatus: TransportStatus;
    activeRunId: string | null;
    error: string | null;
    mode: ChatMode;
    scheduleSeed: ScheduleSeed | null;
    /**
     * Conversation context fill, as of the last `done`. Per conversation, so switching or starting one
     * clears it — and it stays null until the first turn answers, because only the service can measure it.
     */
    contextUsage: ContextUsage | null;
}
interface AiChatSession {
    state: SessionState;
    /** Open (or resume) a conversation and connect the socket. Safe to call repeatedly. */
    start: (conversationId?: string) => Promise<void>;
    send: (text: string) => Promise<void>;
    cancel: () => Promise<void>;
    /** Drop the current thread and start a fresh one on the next `start()`. */
    newConversation: () => void;
    setMode: (mode: ChatMode, seed?: ScheduleSeed) => void;
    listConversations: () => Promise<ConversationListItem[]>;
    api: AiChatApi;
}
/**
 * What the session runs on. `getToken` is REQUIRED here even though it is optional on the public props:
 * by this point the widget has resolved self-auth vs the host's token into one function, and the session
 * must never have to ask which of the two it is holding.
 */
type AiChatSessionConfig = AiChatConfig & {
    getToken: () => string | Promise<string>;
};
declare function useAiChatSession(config: AiChatSessionConfig): AiChatSession;

declare class SelfAuth {
    private readonly config;
    private readonly onError?;
    /** One init per widget instance, shared by every caller (`start`, each send, each reconnect). */
    private initialized;
    /** Set once init finally lands — a late success is still adopted by the NEXT call. */
    private adapter;
    /** The check already ran out of patience once; stop paying that wait on every send. */
    private gaveUp;
    constructor(config: AiChatAuthConfig, onError?: ((error: Error) => void) | undefined);
    /**
     * A fresh access token for the widget's own client, or `""` when there is no session to adopt — the
     * caller decides what to do with that, because only it knows whether a host token exists.
     */
    token(): Promise<string>;
    /** The adapter if it arrives in time, otherwise null — and from then on, null immediately. */
    private instanceOrTimeout;
    private createAndInit;
}
/**
 * The token function the rest of the widget calls, whichever way the host configured it.
 *
 * Order is deliberate: the widget's OWN token first (it is the one revise-api recognises for AI traffic),
 * the host's only as the fallback. That way an app keeps working exactly as before while the environment
 * catches up — the Keycloak client has to exist in the realm, with the same claim mappers as the app
 * clients, before self-auth can produce anything.
 */
declare function resolveTokenProvider(auth: AiChatAuthConfig | undefined, hostGetToken: (() => string | Promise<string>) | undefined, onError?: (error: Error) => void): () => Promise<string>;

declare function cn(...inputs: ClassValue[]): string;

export { AI_CHAT_OPEN_EVENT, type AiChatApi, type AiChatApiConfig, AiChatApiError, type AiChatAuthConfig, type AiChatConfig, type AiChatLabels, type AiChatLocale, type AiChatOpenDetail, type AiChatSession, type AiChatSessionConfig, AiChatWidget, type AiChatWidgetProps, type CancelResult, ChatDrawer, type ChatDrawerProps, type ChatEvent, type ChatEventName, type ChatMessage, type ChatMode, type ChatScope, type ChatSendParams, ChatTransport, type ChatTransportConfig, Composer, type ComposerProps, type ConfirmWidget, type ConnectInfo, ContextMeter, type ContextMeterProps, type ContextUsage, type Conversation, type ConversationListItem, ConversationPicker, type ConversationPickerProps, type DonePayload, type ErrorCardWidget, type ExtractionReviewWidget, FloatingButton, type FloatingButtonProps, Markdown, MessageBubble, type MessageBubbleProps, MessageList, type MessageListProps, type MessageRole, type ProposalPayload, type RuleFormWidget, type RunTicket, type ScheduleDiffWidget, type ScheduleSeed, SelfAuth, type SessionStatus, type StaffPickerWidget, type SummaryStatsWidget, type TaskStatePayload, type TokenPayload, type ToolCallEntry, type ToolCallPayload, ToolTrail, type TranscriptMessage, type TransportStatus, type UserTurnPayload, type WidgetEnvelope, type WidgetPayloadMap, WidgetRenderer, type WidgetRendererProps, type WidgetType, buildScheduleGreeting, cn, createAiChatApi, defaultLabels, enLabels, extractEnterMode, extractRedirect, hasExitMode, labelsByLocale, openAiChat, resolveLabels, resolveTokenProvider, seedScope, stripSentinels, thLabels, useAiChatSession };
