import type {
  AudioClip,
  CancelResult,
  ConnectInfo,
  Conversation,
  ConversationListItem,
  TranscriptionResult,
  TranscriptMessage,
} from "./types";

/**
 * REST half of the ai-service contract (`/v2/ai/*`). Deliberately built on plain `fetch`
 * rather than the host app's HTTP client — Portal uses ky, Mediwork/Medimatch use their
 * own wrappers, and a shared widget must not care which.
 *
 * Auth is inverted: the widget never touches Keycloak. The host hands in `getToken`
 * (re-read per request, so a refreshed token is picked up without remounting).
 */

export class AiChatApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "AiChatApiError";
  }
}

export interface AiChatApiConfig {
  /** e.g. `https://ai.dev.mediact.biz` or `http://localhost:8086` — no trailing slash needed. */
  baseUrl: string;
  /** Returns the caller's current Keycloak access token. May be async (refresh-aware). */
  getToken: () => string | Promise<string>;
  /** Injectable for tests / non-browser runtimes. */
  fetchImpl?: typeof fetch;
}

export interface AiChatApi {
  createConversation(title?: string, signal?: AbortSignal): Promise<Conversation>;
  listConversations(signal?: AbortSignal): Promise<ConversationListItem[]>;
  getMessages(conversationId: string, signal?: AbortSignal): Promise<TranscriptMessage[]>;
  connectInfo(conversationId: string, signal?: AbortSignal): Promise<ConnectInfo>;
  cancelRun(runId: string, signal?: AbortSignal): Promise<CancelResult>;
  /**
   * Speech → text for the composer. NOT a way to send a turn: the reply comes back as text the user reads
   * and edits before pressing send, so a mis-heard word never reaches the assistant unseen.
   */
  transcribe(audio: AudioClip, signal?: AbortSignal): Promise<TranscriptionResult>;
}

export function createAiChatApi(config: AiChatApiConfig): AiChatApi {
  const base = config.baseUrl.replace(/\/+$/, "");
  const doFetch = config.fetchImpl ?? globalThis.fetch;

  async function request<T>(
    path: string,
    init: { method: "GET" | "POST"; body?: unknown; signal?: AbortSignal },
  ): Promise<T> {
    const token = await config.getToken();
    const response = await doFetch(`${base}${path}`, {
      method: init.method,
      signal: init.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });

    const body = response.status === 204 ? null : await response.text().then(safeJsonParse);

    if (!response.ok) {
      // ai-service reports business failures inside the envelope, not just via the status line —
      // surface that message, because "HTTP 400" tells a nurse nothing.
      throw new AiChatApiError(messageOf(body) ?? `ai-service ${init.method} ${path} → ${response.status}`, response.status, body);
    }

    return unwrap<T>(body);
  }

  return {
    createConversation: (title, signal) =>
      request<Conversation>("/v2/ai/conversations", {
        method: "POST",
        body: title ? { title } : {},
        signal,
      }),

    listConversations: (signal) =>
      request<ConversationListItem[]>("/v2/ai/conversations", { method: "GET", signal }),

    getMessages: (conversationId, signal) =>
      request<TranscriptMessage[]>(
        `/v2/ai/conversations/${encodeURIComponent(conversationId)}/messages`,
        { method: "GET", signal },
      ),

    connectInfo: (conversationId, signal) =>
      request<ConnectInfo>("/v2/ai/transport/subscribe", {
        method: "POST",
        body: { conversationId },
        signal,
      }),

    cancelRun: (runId, signal) =>
      request<CancelResult>(`/v2/ai/chat/runs/${encodeURIComponent(runId)}/cancel`, {
        method: "POST",
        signal,
      }),

    transcribe: (audio, signal) =>
      request<TranscriptionResult>("/v2/ai/stt", { method: "POST", body: { audio }, signal }),
  };
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * ai-service wraps every REST response in `{ status: '0000', message: 'Success', data }`
 * (nestjs-custom-module's global CustomResponseInterceptor). Reading the raw body instead of
 * `data` is why a widget can look wired-up and still get `undefined` for every field.
 * Falls through untouched if the envelope is ever removed.
 */
function unwrap<T>(body: unknown): T {
  if (body && typeof body === "object" && "data" in body && "status" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

function messageOf(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const envelope = body as { message?: unknown; data?: { message?: unknown } };
  if (typeof envelope.message === "string" && envelope.message) return envelope.message;
  if (typeof envelope.data?.message === "string" && envelope.data.message) return envelope.data.message;
  return null;
}
