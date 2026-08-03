import type {
  ChatMode,
  ChatScope,
  DonePayload,
  MessageRole,
  ToolCallPayload,
  WidgetEnvelope,
} from "./api/types";

/** A tool call plus when the client first saw it — the elapsed counter is rendered from this. */
export interface ToolCallEntry extends ToolCallPayload {
  startedAt: number;
}

/** One rendered turn. Assistant turns accumulate their tool trail + widgets as events arrive. */
export interface ChatMessage {
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

export type SessionStatus =
  | "idle"
  | "starting"
  | "ready"
  | "sending"
  | "streaming"
  | "error";

/** Labels the host can override — Thai defaults, since every consuming app runs Thai-first. */
export interface AiChatLabels {
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
export interface AiChatAuthConfig {
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

export interface AiChatConfig {
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
