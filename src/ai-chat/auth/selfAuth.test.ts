import { describe, expect, it, vi } from "vitest";
import { resolveTokenProvider } from "./selfAuth";

/**
 * The token the widget sends decides which Keycloak client revise-api thinks it is talking to, and its
 * scheduling routes admit `mediact-ai-assistant` but not `portal`. So this resolution order is the whole
 * feature — and its fallback is what keeps the chat alive in the environments where the silent check cannot
 * run (localhost, a realm that has not been given the client yet, a browser blocking the iframe).
 */

const auth = { url: "https://sso.example", realm: "mediact" };

/** Stand in for `keycloak-js`, which is a dynamic optional import inside SelfAuth. */
function mockKeycloak(behaviour: { init: () => Promise<boolean>; token?: string; authenticated?: boolean }) {
  vi.doMock("keycloak-js", () => ({
    default: class {
      authenticated = behaviour.authenticated;
      token = behaviour.token;
      init = behaviour.init;
      updateToken = async () => true;
    },
  }));
}

describe("resolveTokenProvider — without self-auth", () => {
  it("uses the host's token", async () => {
    const getToken = resolveTokenProvider(undefined, () => "host-token");
    await expect(getToken()).resolves.toBe("host-token");
  });

  it("refuses to be configured with no source of tokens at all", () => {
    expect(() => resolveTokenProvider(undefined, undefined)).toThrow(/auth.*getToken/);
  });
});

describe("resolveTokenProvider — with self-auth", () => {
  it("prefers its OWN token over the host's", async () => {
    vi.resetModules();
    mockKeycloak({ init: async () => true, authenticated: true, token: "ai-assistant-token" });
    const { resolveTokenProvider: resolve } = await import("./selfAuth");

    const getToken = resolve(auth, () => "host-token");

    await expect(getToken()).resolves.toBe("ai-assistant-token");
  });

  it("falls back to the host's token when there is no SSO session to adopt", async () => {
    vi.resetModules();
    mockKeycloak({ init: async () => false, authenticated: false });
    const { resolveTokenProvider: resolve } = await import("./selfAuth");

    const getToken = resolve(auth, () => "host-token");

    await expect(getToken()).resolves.toBe("host-token");
  });

  it("falls back when the adapter cannot be loaded or initialised at all", async () => {
    vi.resetModules();
    const onError = vi.fn();
    mockKeycloak({
      init: async () => {
        throw new Error("Client not found");
      },
    });
    const { resolveTokenProvider: resolve } = await import("./selfAuth");

    const getToken = resolve(auth, () => "host-token", onError);

    await expect(getToken()).resolves.toBe("host-token");
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: "Client not found" }));
  });

  // The failure this closes: a blocked silent check does not error, it HANGS — the drawer sat on
  // "กำลังเชื่อมต่อ…" for over 30 seconds because every token read waited on it.
  it("stops waiting on a check that hangs, and does not wait again afterwards", async () => {
    vi.resetModules();
    mockKeycloak({ init: () => new Promise<boolean>(() => {}) }); // never settles
    const { resolveTokenProvider: resolve } = await import("./selfAuth");

    const getToken = resolve({ ...auth, initTimeoutMs: 50 }, () => "host-token");

    const firstStart = Date.now();
    await expect(getToken()).resolves.toBe("host-token");
    expect(Date.now() - firstStart).toBeLessThan(500);

    const secondStart = Date.now();
    await expect(getToken()).resolves.toBe("host-token");
    expect(Date.now() - secondStart).toBeLessThan(20); // the verdict is remembered, not re-tested
  });

  it("returns an empty token rather than throwing when there is nothing to fall back to", async () => {
    vi.resetModules();
    mockKeycloak({ init: async () => false, authenticated: false });
    const { resolveTokenProvider: resolve } = await import("./selfAuth");

    await expect(resolve(auth, undefined)()).resolves.toBe("");
  });
});
