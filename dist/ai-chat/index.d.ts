import * as react_jsx_runtime from 'react/jsx-runtime';
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
type ChatEventName = "token" | "tool_call" | "widget" | "proposal" | "task_state" | "done";
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
/** One message on `chat:{conversationId}` — the discriminated union of the §4 protocol. */
type ChatEvent = {
    event: "token";
    payload: TokenPayload;
} | {
    event: "tool_call";
    payload: ToolCallPayload;
} | {
    event: "widget";
    payload: WidgetEnvelope;
} | {
    event: "proposal";
    payload: ProposalPayload;
} | {
    event: "task_state";
    payload: TaskStatePayload;
} | {
    event: "done";
    payload: DonePayload;
};

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
    retry: string;
    close: string;
    committed: string;
    notCommitted: string;
    thinking: string;
    scheduleMode: string;
    assistantMode: string;
    /** Onboarding shown right after entering scheduling mode. `{context}` = the scoped/unscoped line. */
    scheduleGreeting: string;
    /** `{department}` + `{period}` — used when the hand-off already resolved the scope. */
    scheduleGreetingScoped: string;
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
    /** Show the assistant/schedule toggle in the drawer header. Default `false`. */
    showModeToggle?: boolean;
    /** Example questions on the empty state — tapping one sends it. Defaults to roster examples. */
    suggestions?: string[];
    /** Which corner the launcher sits in. Default `bottom-right`. */
    position?: "bottom-right" | "bottom-left";
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
declare function AiChatWidget({ open: controlledOpen, defaultOpen, onOpenChange, hideLauncher, className, ...config }: AiChatWidgetProps): react_jsx_runtime.JSX.Element;

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

/** Thai-first defaults — every consuming app runs Thai as its primary locale. */
declare const defaultLabels: AiChatLabels;
declare function resolveLabels(overrides?: Partial<AiChatLabels>): AiChatLabels;
/**
 * Onboarding message rendered right after entering scheduling mode. Without it the user lands in a
 * mode with no idea what it can do — the dead-end the playground client calls out explicitly.
 */
declare function buildScheduleGreeting(labels: AiChatLabels, seed: {
    departmentName?: string;
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
declare function ChatDrawer(props: ChatDrawerProps): react_jsx_runtime.JSX.Element;

interface FloatingButtonProps {
    open: boolean;
    onClick: () => void;
    label: string;
    position?: "bottom-right" | "bottom-left";
    className?: string;
}
/**
 * The always-mounted entry point. Sits in a viewport corner on top of the host app, so it
 * carries the widget's z-index var — a host that needs it lower overrides
 * `--mediact-ai-chat-z` rather than patching the component.
 *
 * It says what it is, in words. A bare chat bubble in the corner of a hospital admin app reads as
 * "support chat" — the thing you press when something is broken — and nobody presses that to ask who is on
 * the night shift. So the closed state is a labelled pill (sparkle + "ผู้ช่วย AI"): the sparkle carries the
 * AI convention for people who know it, the label carries it for everyone else. It collapses to a circle
 * only where the text genuinely does not fit (narrow screens) and while the drawer is open, where the
 * button's job changes to "close" and the panel beside it is already titled.
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
declare function MessageList({ messages, labels, onWidgetAction, busy, suggestions, }: MessageListProps): react_jsx_runtime.JSX.Element;

interface MessageBubbleProps {
    message: ChatMessage;
    labels: AiChatLabels;
    onWidgetAction: (reply: string) => void;
    busy?: boolean;
}
declare function MessageBubble({ message, labels, onWidgetAction, busy }: MessageBubbleProps): react_jsx_runtime.JSX.Element;

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
declare function Composer({ onSend, onCancel, busy, disabled, labels, placeholder, }: ComposerProps): react_jsx_runtime.JSX.Element;

interface ConversationPickerProps {
    load: () => Promise<ConversationListItem[]>;
    onPick: (conversationId: string) => void;
    activeId: string | null;
    labels: AiChatLabels;
}
/** Resume picker — loads on open, so a closed drawer never costs a request. */
declare function ConversationPicker({ load, onPick, activeId, labels }: ConversationPickerProps): react_jsx_runtime.JSX.Element;

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
declare function WidgetRenderer({ widget, onAction, disabled }: WidgetRendererProps): react_jsx_runtime.JSX.Element;

/**
 * RR-A.6 transparency trail — what the agent actually did this turn, in the service's own
 * Thai labels. Rendered above the answer so a long tool run never looks like a hang.
 */
declare function ToolTrail({ tools }: {
    tools: ToolCallEntry[];
}): react_jsx_runtime.JSX.Element | null;

interface ContextMeterProps {
    usage: ContextUsage | null;
    labels: AiChatLabels;
    className?: string;
}
declare function ContextMeter({ usage, labels, className }: ContextMeterProps): react_jsx_runtime.JSX.Element | null;

declare function Markdown({ text, className }: {
    text: string;
    className?: string;
}): react_jsx_runtime.JSX.Element;

/** Scope resolved at hand-off, so scheduling mode doesn't have to re-ask which department/month. */
type ScheduleSeed = Pick<ChatScope, "departmentId" | "departmentName" | "month" | "year">;
/** `[[ENTER_MODE:schedule|dept=7|deptName=ICU|month=8|year=2026]]` → seed, or null when absent. */
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

export { AI_CHAT_OPEN_EVENT, type AiChatApi, type AiChatApiConfig, AiChatApiError, type AiChatAuthConfig, type AiChatConfig, type AiChatLabels, type AiChatOpenDetail, type AiChatSession, type AiChatSessionConfig, AiChatWidget, type AiChatWidgetProps, type CancelResult, ChatDrawer, type ChatDrawerProps, type ChatEvent, type ChatEventName, type ChatMessage, type ChatMode, type ChatScope, type ChatSendParams, ChatTransport, type ChatTransportConfig, Composer, type ComposerProps, type ConfirmWidget, type ConnectInfo, ContextMeter, type ContextMeterProps, type ContextUsage, type Conversation, type ConversationListItem, ConversationPicker, type ConversationPickerProps, type DonePayload, type ErrorCardWidget, type ExtractionReviewWidget, FloatingButton, type FloatingButtonProps, Markdown, MessageBubble, type MessageBubbleProps, MessageList, type MessageListProps, type MessageRole, type ProposalPayload, type RuleFormWidget, type RunTicket, type ScheduleDiffWidget, type ScheduleSeed, SelfAuth, type SessionStatus, type StaffPickerWidget, type SummaryStatsWidget, type TaskStatePayload, type TokenPayload, type ToolCallEntry, type ToolCallPayload, ToolTrail, type TranscriptMessage, type TransportStatus, type WidgetEnvelope, type WidgetPayloadMap, WidgetRenderer, type WidgetRendererProps, type WidgetType, buildScheduleGreeting, cn, createAiChatApi, defaultLabels, extractEnterMode, extractRedirect, hasExitMode, openAiChat, resolveLabels, resolveTokenProvider, stripSentinels, useAiChatSession };
