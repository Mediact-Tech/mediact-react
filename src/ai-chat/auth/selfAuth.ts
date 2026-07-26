import type { AiChatAuthConfig } from "../types";

/**
 * The widget's own Keycloak session (see `AiChatAuthConfig` for why it wants one).
 *
 * Two things make this safe to drop into an app that already runs Keycloak:
 *
 *  - `keycloak-js` is imported DYNAMICALLY, so an app that never passes `auth` neither bundles nor loads it.
 *  - the adapter runs with `checkLoginIframe: false`. The host app already owns that watcher; a second one
 *    polling the same session races the first and produces spurious logouts in the app around us.
 *
 * Adoption is silent or it does not happen: `check-sso` reuses the SSO session the user already has and
 * never redirects. When the browser refuses the check (localhost is cross-site to the SSO host, so its
 * cookies are third-party there), this reports "no token" and the caller falls back to the host's.
 */

/** The slice of `Keycloak` we use — typed here so `keycloak-js` stays an optional dependency. */
interface KeycloakLike {
  init(options: Record<string, unknown>): Promise<boolean>;
  updateToken(minValidity: number): Promise<boolean>;
  authenticated?: boolean;
  token?: string;
}

const DEFAULT_CLIENT_ID = "mediact-ai-assistant";
/** Refresh when the token has less than this long to live — matches what the host apps use. */
const MIN_VALIDITY_SECONDS = 30;
/**
 * How long the silent check may take before the widget stops waiting for it.
 *
 * This is the difference between a nicety and an outage. A blocked check does not fail fast: the iframe is
 * refused (CSP, cookie policy, a client missing from the realm) and `keycloak-js` simply waits out its own
 * receive timeout. Measured on localhost against a realm without the client, the drawer sat on
 * "กำลังเชื่อมต่อ…" for over 30 seconds. Self-auth is an upgrade, never a gate — so it gets a short leash and
 * the host token takes over the moment it expires.
 */
const INIT_TIMEOUT_MS = 3000;

export class SelfAuth {
  /** One init per widget instance, shared by every caller (`start`, each send, each reconnect). */
  private initialized: Promise<KeycloakLike | null> | null = null;
  /** Set once init finally lands — a late success is still adopted by the NEXT call. */
  private adapter: KeycloakLike | null = null;
  /** The check already ran out of patience once; stop paying that wait on every send. */
  private gaveUp = false;

  constructor(
    private readonly config: AiChatAuthConfig,
    private readonly onError?: (error: Error) => void,
  ) {}

  /**
   * A fresh access token for the widget's own client, or `""` when there is no session to adopt — the
   * caller decides what to do with that, because only it knows whether a host token exists.
   */
  async token(): Promise<string> {
    const keycloak = this.adapter ?? (this.gaveUp ? null : await this.instanceOrTimeout());
    if (!keycloak?.authenticated) return "";
    // Refresh failures are not fatal here: an unexpired token still works, and a truly dead session
    // surfaces as a 401 that the session layer already reports.
    await keycloak.updateToken(MIN_VALIDITY_SECONDS).catch(() => false);
    return keycloak.token ?? "";
  }

  /** The adapter if it arrives in time, otherwise null — and from then on, null immediately. */
  private instanceOrTimeout(): Promise<KeycloakLike | null> {
    this.initialized ??= this.createAndInit().then((keycloak) => {
      this.adapter = keycloak;
      return keycloak;
    });
    return Promise.race([
      this.initialized,
      new Promise<null>((resolve) =>
        setTimeout(() => {
          this.gaveUp = true;
          resolve(null);
        }, this.config.initTimeoutMs ?? INIT_TIMEOUT_MS),
      ),
    ]);
  }

  private async createAndInit(): Promise<KeycloakLike | null> {
    if (typeof window === "undefined") return null;
    try {
      const module = (await import("keycloak-js")) as unknown as {
        default: new (options: Record<string, unknown>) => KeycloakLike;
      };
      const keycloak = new module.default({
        url: this.config.url,
        realm: this.config.realm,
        clientId: this.config.clientId ?? DEFAULT_CLIENT_ID,
      });
      await keycloak.init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri:
          this.config.silentCheckSsoRedirectUri ?? `${window.location.origin}/silent-check-sso.html`,
        pkceMethod: "S256",
        checkLoginIframe: false,
        // Bound the adapter's own wait too, so a refused iframe rejects here instead of hanging past the
        // race above and leaving a stray promise running for another ten seconds.
        messageReceiveTimeout: 2500,
      });
      return keycloak;
    } catch (error) {
      // A missing client, an unregistered redirect URI or a blocked iframe all land here. None of them
      // should take the chat down while a host token is available, so report and let the caller fall back.
      this.onError?.(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  }
}

/**
 * The token function the rest of the widget calls, whichever way the host configured it.
 *
 * Order is deliberate: the widget's OWN token first (it is the one revise-api recognises for AI traffic),
 * the host's only as the fallback. That way an app keeps working exactly as before while the environment
 * catches up — the Keycloak client has to exist in the realm, with the same claim mappers as the app
 * clients, before self-auth can produce anything.
 */
export function resolveTokenProvider(
  auth: AiChatAuthConfig | undefined,
  hostGetToken: (() => string | Promise<string>) | undefined,
  onError?: (error: Error) => void,
): () => Promise<string> {
  if (!auth) {
    if (!hostGetToken) throw new Error("AiChatWidget needs either `auth` or `getToken`.");
    return async () => hostGetToken();
  }
  const selfAuth = new SelfAuth(auth, onError);
  return async () => {
    const own = await selfAuth.token();
    if (own) return own;
    return hostGetToken ? hostGetToken() : "";
  };
}
