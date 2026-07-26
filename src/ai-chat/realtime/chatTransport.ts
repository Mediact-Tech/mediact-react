import { Centrifuge, State, type Subscription } from "centrifuge";
import type { ChatEvent, ChatSendParams, RunTicket } from "../api/types";

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

export type TransportStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

export interface ChatTransportConfig {
  wsUrl: string;
  getToken: () => string | Promise<string>;
  channels: { chat: string; task: string };
  onEvent: (event: ChatEvent, channel: "chat" | "task") => void;
  onStatusChange?: (status: TransportStatus) => void;
  onError?: (error: Error) => void;
  /** Forwarded to centrifuge — `localStorage.centrifuge.debug = true` also works at runtime. */
  debug?: boolean;
}

/** How long a turn waits for the socket before giving up and telling the user. */
const CONNECT_TIMEOUT_MS = 5000;

export class ChatTransport {
  private client: Centrifuge | null = null;
  private subs: Subscription[] = [];
  private status: TransportStatus = "idle";
  /** The token the current connection was opened with — what the service will forward downstream. */
  private pinnedToken: string | null = null;
  /** Suppresses the transient "disconnected" blip while we deliberately re-pin the token. */
  private repinning = false;

  constructor(private readonly config: ChatTransportConfig) {}

  get currentStatus(): TransportStatus {
    return this.status;
  }

  async connect(): Promise<void> {
    if (this.client) return;

    // Resolve the token once for the initial connect; `getData` covers centrifuge's own reconnects.
    const token = await this.config.getToken();
    this.pinnedToken = token;

    const client = new Centrifuge(this.config.wsUrl, {
      data: { token },
      getData: async () => {
        const fresh = await this.config.getToken();
        this.pinnedToken = fresh;
        return { token: fresh };
      },
      debug: this.config.debug ?? false,
    });

    client.on("state", (ctx) => this.setStatus(mapState(ctx.newState)));
    client.on("error", (ctx) => this.config.onError?.(toError(ctx.error)));

    this.subs = (["chat", "task"] as const).map((kind) => {
      const sub = client.newSubscription(this.config.channels[kind]);
      sub.on("publication", (ctx) => {
        const event = ctx.data as ChatEvent | undefined;
        // A malformed publication must not kill the stream — drop it and keep listening.
        if (event && typeof event === "object" && "event" in event) {
          this.config.onEvent(event, kind);
        }
      });
      sub.on("error", (ctx) => {
        this.config.onError?.(
          new Error(`subscription ${this.config.channels[kind]}: ${toError(ctx.error).message}`),
        );
      });
      sub.subscribe();
      return sub;
    });

    this.client = client;
    this.setStatus("connecting");
    client.connect();
  }

  /**
   * Re-open the socket if the host's token changed since it was pinned. Cheap in the common case
   * (a string compare), and the reconnect only happens on the ~5-minute cadence of a real refresh.
   */
  async ensureFreshConnection(): Promise<void> {
    if (!this.client) return;
    const token = await this.config.getToken();
    if (token === this.pinnedToken) return;

    this.repinning = true;
    try {
      this.teardown();
      await this.connect();
      await this.waitUntilConnected();
    } finally {
      this.repinning = false;
    }
  }

  /** Send one turn. Resolves with the run ticket the client tracks for streaming/cancel. */
  async send(params: ChatSendParams): Promise<RunTicket> {
    if (!this.client) throw new Error("ChatTransport.send called before connect()");

    await this.ensureFreshConnection();

    // No socket = no send (there is no HTTP fallback). Give centrifuge's own reconnect a moment
    // before failing the turn, instead of losing a message to a blip.
    if (!(await this.waitUntilConnected())) {
      throw new Error("ยังเชื่อมต่อกับเซิร์ฟเวอร์แบบเรียลไทม์ไม่ได้ จึงส่งข้อความไม่ได้ กรุณาลองใหม่");
    }

    try {
      const result = await this.client.rpc("chat.send", params);
      return result.data as RunTicket;
    } catch (error) {
      // centrifuge rejects with its own `{code, message}` — rethrowing it raw loses the reason
      // (4401 unauthenticated / 4403 forbidden / timeout) behind a generic "send failed".
      throw toError(error);
    }
  }

  /** Resolves true once connected, false on timeout. */
  waitUntilConnected(timeoutMs = CONNECT_TIMEOUT_MS): Promise<boolean> {
    if (this.status === "connected") return Promise.resolve(true);
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.status === "connected") finish(true);
      }, 100);
      const timeout = setTimeout(() => finish(false), timeoutMs);
      const finish = (ok: boolean) => {
        clearInterval(interval);
        clearTimeout(timeout);
        resolve(ok);
      };
    });
  }

  disconnect(): void {
    this.teardown();
    this.setStatus("disconnected");
  }

  private teardown(): void {
    for (const sub of this.subs) {
      sub.unsubscribe();
      this.client?.removeSubscription(sub);
    }
    this.subs = [];
    this.client?.disconnect();
    this.client = null;
  }

  private setStatus(status: TransportStatus): void {
    this.status = status;
    // While re-pinning, the socket really does drop — but reporting it would flash a scary
    // "connection lost" banner during what is, to the user, an uninterrupted conversation.
    if (this.repinning && status !== "connected") return;
    this.config.onStatusChange?.(status);
  }
}

/**
 * centrifuge reports failures as its own `{ code, message }` shape, not a JS Error — carry the
 * code into the message so a host logging `error.message` doesn't lose the only diagnostic bit.
 */
function toError(error: unknown): Error {
  if (error instanceof Error) return error;
  if (error && typeof error === "object" && "message" in error) {
    const { message, code } = error as { message: string; code?: number };
    return new Error(code ? `${message} (code ${code})` : message);
  }
  return new Error(String(error));
}

function mapState(state: State): TransportStatus {
  switch (state) {
    case State.Connected:
      return "connected";
    case State.Connecting:
      return "connecting";
    case State.Disconnected:
      return "disconnected";
    default:
      return "idle";
  }
}
