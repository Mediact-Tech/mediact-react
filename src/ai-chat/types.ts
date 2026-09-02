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

/**
 * Locales the widget ships copy for.
 *
 * Deliberately a closed set of two: the apps run Thai and English, and a third would need a whole
 * label set written by someone who speaks it. A host with another language injects `labels` instead —
 * that path stays open and needs no change here.
 */
export type AiChatLocale = "th" | "en";

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
  /** Tooltip of the microphone button — says what it does, not what it is. */
  voiceStart: string;
  voiceStop: string;
  /** Throw the recording away without uploading it. */
  voiceDiscard: string;
  /** Status line while the mic is live. Sits next to the running timer. */
  voiceRecording: string;
  voiceTranscribing: string;
  /** The browser prompt was denied, or there is no microphone. */
  voiceDenied: string;
  /**
   * Recording worked, the transcript did not arrive. Must point at typing as the way out — voice is an
   * accelerator, and a user stuck retrying a mic has lost the composer they already had.
   */
  voiceFailed: string;
  /** `{seconds}` = the duration cap, so a user who is cut off knows it was a limit, not a crash. */
  voiceLimit: string;
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
  /**
   * Caption on a confirm card that a NEWER confirm card in the same turn has replaced. The service keeps
   * exactly one pending proposal per conversation (staging supersedes), so only the newest card can be
   * answered — the older ones keep their summary as a record, with this line where their buttons were.
   */
  cardSuperseded: string;
  /**
   * แทนที่ปุ่มของการ์ดข้อเสนอ ระหว่างที่เทิร์นอื่นกำลังทำงานอยู่ (การ์ดนี้ยังไม่ถูกกด)
   *
   * 🔴 ต้องบอกว่า *ต้องรอ* ไม่ใช่แค่ปิดปุ่มไว้เฉย ๆ — ปุ่มจาง ๆ ที่ไม่มีคำอธิบายอ่านได้ว่า "พัง" พอ ๆ กับ
   * "รอสักครู่" และผู้ใช้จะกดซ้ำเพื่อทดสอบว่ามันตายจริงไหม
   */
  cardWaiting: string;
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
  /**
   * Microphone → text in the composer. Default true.
   *
   * Turning it off is a host decision (a kiosk with no mic, a policy about recording); the widget hides
   * the button on its own when the browser cannot record — plain http, no `MediaRecorder` — or when the
   * service has no `/v2/ai/stt`.
   */
  voiceInput?: boolean;
  labels?: Partial<AiChatLabels>;
  /** Surfaced for host-side logging/monitoring — the widget renders its own error state regardless. */
  onError?: (error: Error) => void;
  fetchImpl?: typeof fetch;
  debug?: boolean;
}
