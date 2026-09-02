// src/ai-chat/AiChatWidget.tsx
import * as React12 from "react";

// src/ai-chat/api/aiChatApi.ts
var AiChatApiError = class extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
    this.name = "AiChatApiError";
  }
  status;
  body;
};
function createAiChatApi(config) {
  const base = config.baseUrl.replace(/\/+$/, "");
  const doFetch = config.fetchImpl ?? globalThis.fetch;
  async function request(path, init) {
    const token = await config.getToken();
    const response = await doFetch(`${base}${path}`, {
      method: init.method,
      signal: init.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        ...init.body !== void 0 ? { "Content-Type": "application/json" } : {}
      },
      body: init.body !== void 0 ? JSON.stringify(init.body) : void 0
    });
    const body = response.status === 204 ? null : await response.text().then(safeJsonParse);
    if (!response.ok) {
      throw new AiChatApiError(messageOf(body) ?? `ai-service ${init.method} ${path} \u2192 ${response.status}`, response.status, body);
    }
    return unwrap(body);
  }
  return {
    createConversation: (title, signal) => request("/v2/ai/conversations", {
      method: "POST",
      body: title ? { title } : {},
      signal
    }),
    listConversations: (signal) => request("/v2/ai/conversations", { method: "GET", signal }),
    getMessages: (conversationId, signal) => request(
      `/v2/ai/conversations/${encodeURIComponent(conversationId)}/messages`,
      { method: "GET", signal }
    ),
    connectInfo: (conversationId, signal) => request("/v2/ai/transport/subscribe", {
      method: "POST",
      body: { conversationId },
      signal
    }),
    cancelRun: (runId, signal) => request(`/v2/ai/chat/runs/${encodeURIComponent(runId)}/cancel`, {
      method: "POST",
      signal
    }),
    transcribe: (audio, signal) => request("/v2/ai/stt", { method: "POST", body: { audio }, signal })
  };
}
function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
function unwrap(body) {
  if (body && typeof body === "object" && "data" in body && "status" in body) {
    return body.data;
  }
  return body;
}
function messageOf(body) {
  if (!body || typeof body !== "object") return null;
  const envelope = body;
  if (typeof envelope.message === "string" && envelope.message) return envelope.message;
  if (typeof envelope.data?.message === "string" && envelope.data.message) return envelope.data.message;
  return null;
}

// src/ai-chat/auth/selfAuth.ts
var DEFAULT_CLIENT_ID = "mediact-ai-assistant";
var MIN_VALIDITY_SECONDS = 30;
var INIT_TIMEOUT_MS = 3e3;
var SelfAuth = class {
  constructor(config, onError) {
    this.config = config;
    this.onError = onError;
  }
  config;
  onError;
  /** One init per widget instance, shared by every caller (`start`, each send, each reconnect). */
  initialized = null;
  /** Set once init finally lands — a late success is still adopted by the NEXT call. */
  adapter = null;
  /** The check already ran out of patience once; stop paying that wait on every send. */
  gaveUp = false;
  /**
   * A fresh access token for the widget's own client, or `""` when there is no session to adopt — the
   * caller decides what to do with that, because only it knows whether a host token exists.
   */
  async token() {
    const keycloak = this.adapter ?? (this.gaveUp ? null : await this.instanceOrTimeout());
    if (!keycloak?.authenticated) return "";
    await keycloak.updateToken(MIN_VALIDITY_SECONDS).catch(() => false);
    return keycloak.token ?? "";
  }
  /** The adapter if it arrives in time, otherwise null — and from then on, null immediately. */
  instanceOrTimeout() {
    this.initialized ??= this.createAndInit().then((keycloak) => {
      this.adapter = keycloak;
      return keycloak;
    });
    return Promise.race([
      this.initialized,
      new Promise(
        (resolve) => setTimeout(() => {
          this.gaveUp = true;
          resolve(null);
        }, this.config.initTimeoutMs ?? INIT_TIMEOUT_MS)
      )
    ]);
  }
  async createAndInit() {
    if (typeof window === "undefined") return null;
    try {
      const module = await import("keycloak-js");
      const keycloak = new module.default({
        url: this.config.url,
        realm: this.config.realm,
        clientId: this.config.clientId ?? DEFAULT_CLIENT_ID
      });
      await keycloak.init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: this.config.silentCheckSsoRedirectUri ?? `${window.location.origin}/silent-check-sso.html`,
        pkceMethod: "S256",
        checkLoginIframe: false,
        // Bound the adapter's own wait too, so a refused iframe rejects here instead of hanging past the
        // race above and leaving a stray promise running for another ten seconds.
        messageReceiveTimeout: 2500
      });
      return keycloak;
    } catch (error) {
      this.onError?.(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  }
};
function resolveTokenProvider(auth, hostGetToken, onError) {
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

// src/ai-chat/components/ChatDrawer.tsx
import * as React9 from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import {
  CalendarDays,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  History,
  Plus,
  X
} from "lucide-react";

// src/ai-chat/lib/cn.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/ai-chat/components/Composer.tsx
import * as React3 from "react";
import { ArrowUp, Loader2, Mic, Square, Trash2 } from "lucide-react";

// src/ai-chat/state/useVoiceInput.ts
import * as React from "react";
var AUDIO_BITS_PER_SECOND = 32e3;
var CANDIDATE_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/wav"];
var MAX_SECONDS_CEILING = 120;
function useVoiceInput({
  transcribe,
  onText,
  onError,
  maxSeconds = MAX_SECONDS_CEILING
}) {
  const capSeconds = Math.min(Math.max(1, Math.floor(maxSeconds)), MAX_SECONDS_CEILING);
  const [status, setStatus] = React.useState("idle");
  const [seconds, setSeconds] = React.useState(0);
  const [error, setError] = React.useState(null);
  const [notice, setNotice] = React.useState(null);
  const [stream, setStream] = React.useState(null);
  const recorderRef = React.useRef(null);
  const chunksRef = React.useRef([]);
  const discardRef = React.useRef(false);
  const abortRef = React.useRef(null);
  const tickRef = React.useRef(null);
  const callbacksRef = React.useRef({ transcribe, onText, onError });
  callbacksRef.current = { transcribe, onText, onError };
  const supported = React.useMemo(
    () => Boolean(transcribe) && typeof window !== "undefined" && typeof MediaRecorder !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia),
    [transcribe]
  );
  const stopTicking = React.useCallback(() => {
    if (tickRef.current !== null) clearInterval(tickRef.current);
    tickRef.current = null;
  }, []);
  const teardown = React.useCallback(() => {
    stopTicking();
    setStream(null);
    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (!recorder) return;
    recorder.stream.getTracks().forEach((track) => track.stop());
  }, [stopTicking]);
  React.useEffect(
    () => () => {
      abortRef.current?.abort();
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        discardRef.current = true;
        recorder.stop();
      }
      teardown();
    },
    [teardown]
  );
  const finish = React.useCallback(async () => {
    const chunks = chunksRef.current;
    chunksRef.current = [];
    const mimeType = recorderRef.current?.mimeType ?? CANDIDATE_TYPES[0];
    teardown();
    if (discardRef.current) {
      setStatus("idle");
      setSeconds(0);
      return;
    }
    const blob = new Blob(chunks, { type: mimeType });
    if (blob.size < 1024) {
      setStatus("idle");
      setSeconds(0);
      return;
    }
    setStatus("transcribing");
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const result = await callbacksRef.current.transcribe?.(
        { data: await toBase64(blob), format: formatOf(mimeType) },
        controller.signal
      );
      const text = result?.text?.trim();
      if (!text) {
        setNotice("silent");
        setStatus("idle");
        return;
      }
      callbacksRef.current.onText(text);
      setStatus("idle");
    } catch (cause) {
      if (controller.signal.aborted) return;
      setError("failed");
      setStatus("idle");
      callbacksRef.current.onError?.(cause instanceof Error ? cause : new Error(String(cause)));
    } finally {
      abortRef.current = null;
      setSeconds(0);
    }
  }, [teardown]);
  const stopRecorder = React.useCallback((discard2) => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    discardRef.current = discard2;
    recorder.stop();
  }, []);
  const start = React.useCallback(() => {
    if (!supported || status !== "idle") return;
    setError(null);
    setNotice(null);
    void (async () => {
      let stream2;
      try {
        stream2 = await navigator.mediaDevices.getUserMedia({
          audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true }
        });
      } catch (cause) {
        setError("denied");
        callbacksRef.current.onError?.(cause instanceof Error ? cause : new Error(String(cause)));
        return;
      }
      const mimeType = CANDIDATE_TYPES.find((type) => MediaRecorder.isTypeSupported?.(type));
      let recorder;
      try {
        recorder = new MediaRecorder(stream2, {
          audioBitsPerSecond: AUDIO_BITS_PER_SECOND,
          ...mimeType ? { mimeType } : {}
        });
      } catch (cause) {
        stream2.getTracks().forEach((track) => track.stop());
        setError("failed");
        callbacksRef.current.onError?.(cause instanceof Error ? cause : new Error(String(cause)));
        return;
      }
      chunksRef.current = [];
      discardRef.current = false;
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => void finish();
      recorder.start(1e3);
      setStatus("recording");
      setStream(stream2);
      setSeconds(0);
      tickRef.current = setInterval(() => {
        setSeconds((current) => {
          const next = current + 1;
          if (next >= capSeconds) stopRecorder(false);
          return next;
        });
      }, 1e3);
    })();
  }, [capSeconds, finish, status, stopRecorder, supported]);
  const stop = React.useCallback(() => stopRecorder(false), [stopRecorder]);
  const discard = React.useCallback(() => stopRecorder(true), [stopRecorder]);
  return { status, seconds, limitSeconds: capSeconds, error, notice, supported, stream, start, stop, discard };
}
function formatOf(mimeType) {
  const subtype = mimeType.split(";")[0]?.split("/")[1]?.toLowerCase() ?? "";
  if (subtype === "mp4" || subtype === "m4a" || subtype === "x-m4a") return "mp4";
  if (subtype === "wav" || subtype === "wave" || subtype === "x-wav") return "wav";
  return "webm";
}
async function toBase64(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 32768) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
  }
  return btoa(binary);
}

// src/ai-chat/components/VoiceWaveform.tsx
import * as React2 from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function VoiceWaveform({ stream, className }) {
  const canvasRef = React2.useRef(null);
  const [state, setState] = React2.useState("idle");
  React2.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !stream) {
      setState("idle");
      return;
    }
    const AudioContextCtor = resolveAudioContext();
    if (!AudioContextCtor) {
      setState("unsupported");
      return;
    }
    let context;
    let source;
    let analyser;
    try {
      context = new AudioContextCtor();
      analyser = context.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.5;
      source = context.createMediaStreamSource(stream);
      source.connect(analyser);
    } catch {
      setState("unsupported");
      return;
    }
    void context.resume?.().catch(() => void 0);
    setState("live");
    const samples = new Uint8Array(analyser.fftSize);
    const levels = [];
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const sampleEveryMs = reduceMotion ? 250 : SAMPLE_EVERY_MS;
    let lastSampleAt = 0;
    let frame = 0;
    let disposed = false;
    const tick = (now) => {
      if (disposed) return;
      if (now - lastSampleAt >= sampleEveryMs) {
        lastSampleAt = now;
        analyser.getByteTimeDomainData(samples);
        levels.push(levelOf(samples));
        if (levels.length > MAX_BARS) levels.shift();
      }
      paint(canvas, levels);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      source.disconnect();
      void context.close().catch(() => void 0);
    };
  }, [stream]);
  return /* @__PURE__ */ jsxs(
    "span",
    {
      "data-slot": "ai-chat-voice-waveform",
      "data-state": state,
      className: cn("relative flex h-7 min-w-0 items-center", className),
      children: [
        /* @__PURE__ */ jsx(
          "canvas",
          {
            ref: canvasRef,
            "aria-hidden": true,
            className: cn("h-full w-full text-brand-active", state !== "live" && "invisible")
          }
        ),
        state === "unsupported" && /* Nothing to measure here — three quiet dots keep the strip's shape so the row does not collapse. */
        /* @__PURE__ */ jsxs("span", { "aria-hidden": true, className: "absolute inset-0 flex items-center justify-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "size-1 rounded-full bg-text-body" }),
          /* @__PURE__ */ jsx("span", { className: "size-1 rounded-full bg-text-body" }),
          /* @__PURE__ */ jsx("span", { className: "size-1 rounded-full bg-text-body" })
        ] })
      ]
    }
  );
}
var FFT_SIZE = 512;
var SAMPLE_EVERY_MS = 60;
var MAX_BARS = 160;
var BAR_WIDTH = 3;
var BAR_GAP = 2;
var MIN_BAR_HEIGHT = 2;
function resolveAudioContext() {
  if (typeof window === "undefined") return void 0;
  const global = globalThis;
  return global.AudioContext ?? global.webkitAudioContext;
}
function levelOf(samples) {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    const centred = ((samples[i] ?? 128) - 128) / 128;
    sum += centred * centred;
  }
  const rms = Math.sqrt(sum / samples.length);
  return Math.min(1, Math.pow(rms * 3.2, 0.8));
}
function paint(canvas, levels) {
  let context;
  try {
    context = canvas.getContext("2d");
  } catch {
    return;
  }
  if (!context) return;
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width === 0 || height === 0) return;
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  context.fillStyle = getComputedStyle(canvas).color;
  const step = BAR_WIDTH + BAR_GAP;
  const visible = Math.max(1, Math.floor(width / step));
  const recent = levels.slice(-visible);
  let x = width - recent.length * step + BAR_GAP / 2;
  for (const level of recent) {
    const barHeight = Math.max(MIN_BAR_HEIGHT, Math.round(level * height));
    const y = (height - barHeight) / 2;
    if (typeof context.roundRect === "function") {
      context.beginPath();
      context.roundRect(x, y, BAR_WIDTH, barHeight, BAR_WIDTH / 2);
      context.fill();
    } else {
      context.fillRect(x, y, BAR_WIDTH, barHeight);
    }
    x += step;
  }
}

// src/ai-chat/components/Composer.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function Composer({
  onSend,
  onCancel,
  busy,
  disabled,
  labels,
  placeholder = labels.placeholder,
  onTranscribe,
  onVoiceError,
  maxRecordingSeconds = 120
}) {
  const [value, setValue] = React3.useState("");
  const textareaRef = React3.useRef(null);
  const caretRef = React3.useRef(null);
  const submit = () => {
    const text = value.trim();
    if (!text || busy || disabled) return;
    onSend(text);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };
  const insertTranscript = React3.useCallback((text) => {
    const el = textareaRef.current;
    setValue((current) => {
      const start = el?.selectionStart ?? current.length;
      const end = el?.selectionEnd ?? current.length;
      const before = current.slice(0, start);
      const after = current.slice(end);
      const lead = before && !/\s$/.test(before) ? " " : "";
      const next = `${before}${lead}${text}${after}`;
      caretRef.current = before.length + lead.length + text.length;
      return next;
    });
  }, []);
  const voice = useVoiceInput({
    transcribe: onTranscribe,
    onText: insertTranscript,
    onError: onVoiceError,
    maxSeconds: maxRecordingSeconds
  });
  React3.useLayoutEffect(() => {
    const caret = caretRef.current;
    const el = textareaRef.current;
    if (caret === null || !el) return;
    caretRef.current = null;
    el.focus();
    el.setSelectionRange(caret, caret);
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };
  const autoGrow = (event) => {
    setValue(event.target.value);
    const el = event.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };
  const recording = voice.status === "recording";
  const transcribing = voice.status === "transcribing";
  const voiceMessage = voice.error === "denied" ? labels.voiceDenied : voice.error === "failed" ? labels.voiceFailed : null;
  const spokenOnly = transcribing ? labels.voiceTranscribing : voice.notice === "silent" ? labels.voiceSilent : null;
  const voiceLimitText = labels.voiceLimit.replace("{seconds}", String(voice.limitSeconds));
  const nearCap = recording && voice.limitSeconds - voice.seconds <= 10;
  return /* @__PURE__ */ jsxs2(
    "div",
    {
      "data-slot": "ai-chat-composer",
      className: "border-t border-border-subtle bg-bg-default px-3.5 py-3",
      children: [
        recording && /* @__PURE__ */ jsxs2(
          "div",
          {
            "data-slot": "ai-chat-voice-strip",
            className: "mb-2 flex items-center gap-2.5 rounded-xl bg-bg-subtle px-3 py-1.5",
            children: [
              /* @__PURE__ */ jsx2(
                "span",
                {
                  "aria-hidden": true,
                  className: "size-2 shrink-0 rounded-full bg-error-red-600 animate-pulse motion-reduce:animate-none"
                }
              ),
              /* @__PURE__ */ jsx2(
                "span",
                {
                  "aria-hidden": true,
                  title: voiceLimitText,
                  className: cn(
                    "shrink-0 text-caption tabular-nums",
                    /* body = 6.99:1 บนพื้นขาว — เวลาที่กำลังเดินต้องอ่านออกจริง ไม่ใช่คำใบ้ประดับ (tertiary ตก 4.5) */
                    nearCap ? "text-error-red-600" : "text-text-body"
                  ),
                  children: formatElapsed(voice.seconds)
                }
              ),
              /* @__PURE__ */ jsx2(VoiceWaveform, { stream: voice.stream, className: "flex-1" }),
              /* @__PURE__ */ jsx2("span", { "aria-hidden": true, className: "shrink-0 text-caption tabular-nums text-text-body", children: formatElapsed(voice.limitSeconds) }),
              /* @__PURE__ */ jsx2("span", { className: "sr-only", "aria-live": "polite", children: `${labels.voiceRecording} \xB7 ${formatElapsed(voice.seconds)} \xB7 ${voiceLimitText}` })
            ]
          }
        ),
        voiceMessage && /* @__PURE__ */ jsx2("p", { "aria-live": "polite", className: "mb-2 flex items-center gap-1.5 text-caption text-error-red-600", children: /* @__PURE__ */ jsx2("span", { className: "min-w-0 flex-1", children: voiceMessage }) }),
        spokenOnly && /* @__PURE__ */ jsx2("span", { className: "sr-only", "aria-live": "polite", children: spokenOnly }),
        /* @__PURE__ */ jsxs2(
          "div",
          {
            "data-slot": "ai-chat-composer-box",
            className: cn(
              "rounded-2xl border border-border-default bg-bg-subtle px-3.5 pt-3 pb-2.5 transition-colors",
              "focus-within:border-brand-active focus-within:bg-bg-default focus-within:ring-1 focus-within:ring-brand-active"
            ),
            children: [
              /* @__PURE__ */ jsx2(
                "textarea",
                {
                  ref: textareaRef,
                  rows: 2,
                  value,
                  onChange: autoGrow,
                  onKeyDown: handleKeyDown,
                  disabled,
                  placeholder,
                  "aria-label": placeholder,
                  className: cn(
                    /* ไม่มีขอบ ไม่มีพื้นของตัวเอง — กรอบข้างนอกเป็นเจ้าของรูปทรง ถ้าช่องนี้มีขอบด้วยจะกลายเป็นกล่องซ้อนกล่อง
                     * `field-sizing-content` ไม่ใช้: Safari ยังไม่รองรับ ⇒ ความสูงยังคุมด้วย scrollHeight ใน `autoGrow` */
                    "block max-h-40 w-full resize-none border-0 bg-transparent p-0 text-body-sm",
                    "outline-none placeholder:text-text-tertiary",
                    "disabled:text-text-tertiary"
                  )
                }
              ),
              /* @__PURE__ */ jsxs2("div", { className: "mt-1.5 flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-0.5", children: [
                  voice.supported && /* @__PURE__ */ jsx2(
                    "button",
                    {
                      type: "button",
                      onClick: recording ? voice.stop : voice.start,
                      disabled: disabled || transcribing,
                      "aria-label": recording ? labels.voiceStop : labels.voiceStart,
                      title: recording ? labels.voiceStop : labels.voiceStart,
                      className: cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer",
                        "disabled:pointer-events-none disabled:opacity-40",
                        recording ? "bg-error-red-50 text-error-red-600 hover:bg-error-red-100" : (
                          /* ไอคอนของ control ที่กดได้ต้องได้ 3:1 ตามเกณฑ์ non-text — tertiary วัดได้ 2.78 */
                          "text-text-body hover:bg-overlay-hover hover:text-text-body"
                        )
                      ),
                      children: transcribing ? /* @__PURE__ */ jsx2(Loader2, { className: "size-4 animate-spin" }) : recording ? /* @__PURE__ */ jsx2(Square, { className: "size-4 fill-current" }) : /* @__PURE__ */ jsx2(Mic, { className: "size-4" })
                    }
                  ),
                  recording && /* @__PURE__ */ jsx2(
                    "button",
                    {
                      type: "button",
                      onClick: voice.discard,
                      "aria-label": labels.voiceDiscard,
                      title: labels.voiceDiscard,
                      className: cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer",
                        "text-text-body hover:bg-overlay-hover hover:text-text-body"
                      ),
                      children: /* @__PURE__ */ jsx2(Trash2, { className: "size-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx2(
                  "button",
                  {
                    type: "button",
                    onClick: busy ? onCancel : submit,
                    disabled: disabled || !busy && !value.trim(),
                    "aria-label": busy ? labels.cancel : labels.send,
                    className: cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer",
                      "disabled:pointer-events-none disabled:opacity-40",
                      busy ? "bg-overlay-hover text-text-body hover:bg-overlay-press" : (
                        /* ไอคอนดำหมึกบนมิ้นต์ ไม่ใช่ขาว — เหตุผลเดียวกับฟองของผู้ใช้ (ขาวบนมิ้นต์ = 1.93:1)
                         * ไอคอนไม่ใช่ข้อความก็จริง แต่เกณฑ์ 3:1 ของ non-text ก็ยังไม่ผ่านอยู่ดี
                         * hover เป็น `brand-hover` ซึ่งเข้มพอให้กลับไปใช้ตัวขาวได้ */
                        "bg-brand text-text-black hover:bg-brand-hover hover:text-brand-foreground"
                      )
                    ),
                    children: busy ? /* @__PURE__ */ jsx2(Square, { className: "size-4 fill-current" }) : /* @__PURE__ */ jsx2(ArrowUp, { className: "size-4" })
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
function formatElapsed(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

// src/ai-chat/components/ContextMeter.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var WARN_AT = 0.8;
function ContextMeter({ usage, labels, className }) {
  if (!usage || usage.limit <= 0) return null;
  const ratio = usage.used / usage.limit;
  const percent = Math.round(ratio * 100);
  const state = usage.trimmed || ratio >= 1 ? "over" : ratio >= WARN_AT ? "warn" : "ok";
  const tooltip = [
    fill(labels.contextTooltip, { used: format(usage.used), limit: format(usage.limit) }),
    usage.trimmed ? labels.contextTrimmed : null
  ].filter(Boolean).join("\n");
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      "data-slot": "ai-chat-context-meter",
      title: tooltip,
      "aria-label": tooltip,
      className: cn("flex shrink-0 items-center gap-1.5", className),
      children: [
        /* @__PURE__ */ jsx3("div", { className: "h-1 w-10 overflow-hidden rounded-full bg-gray-200", children: /* @__PURE__ */ jsx3(
          "div",
          {
            style: { width: `${Math.min(100, Math.max(2, percent))}%` },
            className: cn(
              "h-full rounded-full transition-[width] duration-500",
              state === "over" ? "bg-error-red-600" : state === "warn" ? "bg-warning-yellow-400" : "bg-brand-active"
            )
          }
        ) }),
        /* @__PURE__ */ jsxs3(
          "span",
          {
            className: cn(
              "text-[11px] tabular-nums",
              state === "over" ? "text-error-red-600" : state === "warn" ? "text-warning-yellow-800" : "text-gray-500"
            ),
            children: [
              percent,
              "%"
            ]
          }
        )
      ]
    }
  );
}
function format(value) {
  return value.toLocaleString("en-US");
}
function fill(template, values) {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.split(`{${name}}`).join(value),
    template
  );
}

// src/ai-chat/components/ConversationPicker.tsx
import * as React4 from "react";
import { Loader2 as Loader22, MessageSquare, Search } from "lucide-react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var LIST_CAP = 100;
function relativeTime(iso, labels) {
  const date = new Date(iso);
  const seconds = (Date.now() - date.getTime()) / 1e3;
  if (seconds < 60) return labels.timeJustNow;
  if (seconds < 3600) return labels.timeMinutesAgo.replace("{count}", String(Math.floor(seconds / 60)));
  if (seconds < 86400) return labels.timeHoursAgo.replace("{count}", String(Math.floor(seconds / 3600)));
  return date.toLocaleDateString(labels.dateLocale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function startedToday(iso) {
  const date = new Date(iso);
  const now = /* @__PURE__ */ new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}
var displayTitle = (item, labels) => item.title || item.preview || labels.historyUntitled;
function ConversationPicker({ load, onPick, activeId, labels }) {
  const [items, setItems] = React4.useState(null);
  const [error, setError] = React4.useState(null);
  const [query, setQuery] = React4.useState("");
  React4.useEffect(() => {
    let cancelled = false;
    load().then((result) => {
      if (!cancelled) setItems(result);
    }).catch((err) => {
      if (!cancelled) setError(err instanceof Error ? err.message : String(err));
    });
    return () => {
      cancelled = true;
    };
  }, [load]);
  const matched = React4.useMemo(() => {
    if (!items) return null;
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (item) => `${item.title ?? ""} ${item.preview ?? ""}`.toLowerCase().includes(needle)
    );
  }, [items, query]);
  const groups = React4.useMemo(() => {
    if (!matched) return null;
    return {
      today: matched.filter((item) => startedToday(item.createdAt)),
      earlier: matched.filter((item) => !startedToday(item.createdAt))
    };
  }, [matched]);
  return /* @__PURE__ */ jsxs4("div", { "data-slot": "ai-chat-history", className: "flex min-h-0 flex-1 flex-col bg-bg-default", children: [
    /* @__PURE__ */ jsx4("div", { className: "px-4 pt-3 pb-2", children: /* @__PURE__ */ jsxs4("label", { className: "flex items-center gap-2 rounded-xl border border-border-default bg-bg-subtle px-3 py-2 focus-within:border-brand-active focus-within:bg-bg-default", children: [
      /* @__PURE__ */ jsx4(Search, { className: "size-4 shrink-0 text-text-tertiary", "aria-hidden": true }),
      /* @__PURE__ */ jsx4(
        "input",
        {
          type: "search",
          value: query,
          onChange: (event) => setQuery(event.target.value),
          placeholder: labels.historySearch,
          "aria-label": labels.historySearch,
          className: "min-w-0 flex-1 bg-transparent text-body-sm outline-none placeholder:text-text-tertiary"
        }
      )
    ] }) }),
    error ? /* @__PURE__ */ jsx4("p", { className: "px-4 py-3 text-caption text-error-red-600", children: error }) : !groups ? /* @__PURE__ */ jsx4("div", { className: "flex flex-1 items-center justify-center", children: /* @__PURE__ */ jsx4(Loader22, { className: "size-4 animate-spin text-text-tertiary" }) }) : items && items.length === 0 ? /* @__PURE__ */ jsx4("p", { className: "px-4 py-3 text-caption text-text-body", children: labels.emptyHint }) : groups.today.length + groups.earlier.length === 0 ? /* @__PURE__ */ jsx4("p", { className: "px-4 py-3 text-caption text-text-body", children: labels.historyNoMatch }) : /* @__PURE__ */ jsxs4("ul", { className: "min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2.5 pb-3", children: [
      groups.today.length > 0 && /* @__PURE__ */ jsx4(GroupHeading, { children: labels.historyToday }),
      groups.today.map((item) => /* @__PURE__ */ jsx4(Row, { item, activeId, labels, onPick }, item.id)),
      groups.earlier.length > 0 && /* @__PURE__ */ jsx4(GroupHeading, { children: labels.historyEarlier }),
      groups.earlier.map((item) => /* @__PURE__ */ jsx4(Row, { item, activeId, labels, onPick }, item.id))
    ] }),
    items && items.length >= LIST_CAP && /* @__PURE__ */ jsx4("p", { className: "border-t border-border-subtle px-4 py-2 text-[11px] text-text-tertiary", children: labels.historyCapped.replace("{count}", String(items.length)) })
  ] });
}
function GroupHeading({ children }) {
  return /* @__PURE__ */ jsx4(
    "li",
    {
      role: "presentation",
      className: "px-2 pt-3 pb-1.5 text-[11px] font-semibold tracking-wide text-text-tertiary uppercase",
      children
    }
  );
}
function Row({
  item,
  activeId,
  labels,
  onPick
}) {
  const active = item.id === activeId;
  return /* @__PURE__ */ jsx4("li", { children: /* @__PURE__ */ jsxs4(
    "button",
    {
      type: "button",
      onClick: () => onPick(item.id),
      "aria-current": active ? "true" : void 0,
      className: cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-xl p-2.5 text-left transition-colors",
        active ? "bg-brand-subtle" : "hover:bg-bg-subtle"
      ),
      children: [
        /* @__PURE__ */ jsx4(
          "span",
          {
            className: cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl",
              active ? "bg-brand text-text-black" : "bg-bg-subtle text-text-body"
            ),
            children: /* @__PURE__ */ jsx4(MessageSquare, { className: "size-4", "aria-hidden": true })
          }
        ),
        /* @__PURE__ */ jsxs4("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx4("span", { className: "block truncate text-body-sm font-medium text-text-black", children: displayTitle(item, labels) }),
          item.preview && item.title && /* @__PURE__ */ jsx4("span", { className: "block truncate text-[12px] text-text-tertiary", children: item.preview })
        ] }),
        /* @__PURE__ */ jsx4("span", { className: "shrink-0 text-[11px] text-text-tertiary", children: relativeTime(item.createdAt, labels) })
      ]
    }
  ) });
}

// src/ai-chat/components/MessageList.tsx
import * as React8 from "react";
import { Sparkles } from "lucide-react";

// src/ai-chat/components/MessageBubble.tsx
import { CircleCheck, CircleSlash } from "lucide-react";

// src/ai-chat/components/Markdown.tsx
import * as React5 from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { ExternalLink, CornerDownRight } from "lucide-react";
import { Fragment, jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var hooked = false;
function ensureLinkHardening() {
  if (hooked || typeof window === "undefined") return;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.nodeName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
  hooked = true;
}
var ALIAS_TOKEN = /<(user|facility|department|subUnit):(\d+)>/g;
var POPOVER_WIDTH = 208;
var POPOVER_HEIGHT = 92;
var EDGE_GAP = 8;
function Markdown({
  text,
  className,
  labels
}) {
  const [choice, setChoice] = React5.useState(null);
  const html = React5.useMemo(() => {
    if (typeof window === "undefined") return null;
    ensureLinkHardening();
    try {
      const safeText = text.replace(ALIAS_TOKEN, "&lt;$1:$2&gt;");
      return DOMPurify.sanitize(marked(safeText, { async: false, breaks: true, gfm: true }));
    } catch {
      return null;
    }
  }, [text]);
  const onClick = (event) => {
    if (!labels) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest?.("a[href]");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    event.preventDefault();
    const rect = anchor.getBoundingClientRect();
    const originX = event.detail === 0 ? rect.left : event.clientX;
    const originY = event.detail === 0 ? rect.bottom : event.clientY;
    setChoice({
      href: anchor.href,
      x: Math.min(originX, window.innerWidth - POPOVER_WIDTH - EDGE_GAP),
      y: Math.min(originY + EDGE_GAP, window.innerHeight - POPOVER_HEIGHT - EDGE_GAP)
    });
  };
  if (html === null) return /* @__PURE__ */ jsx5(Fragment, { children: text });
  return /* @__PURE__ */ jsxs5(Fragment, { children: [
    /* @__PURE__ */ jsx5(
      "div",
      {
        onClick,
        className: cn(
          "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          "[&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5",
          "[&_li]:my-0.5",
          "[&_h1]:my-2 [&_h1]:text-body-md [&_h1]:font-semibold",
          "[&_h2]:my-2 [&_h2]:text-body-sm [&_h2]:font-semibold",
          "[&_h3]:my-1.5 [&_h3]:text-body-sm [&_h3]:font-semibold",
          "[&_a]:text-brand-active [&_a]:underline",
          "[&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em]",
          "[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-gray-100 [&_pre]:p-2",
          "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-border-default [&_blockquote]:pl-2 [&_blockquote]:text-gray-600",
          // Tables scroll inside the bubble instead of stretching the drawer.
          "[&_table]:my-2 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-caption",
          "[&_th]:border [&_th]:border-border-default [&_th]:bg-gray-50 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:whitespace-nowrap",
          "[&_td]:border [&_td]:border-border-default [&_td]:px-2 [&_td]:py-1 [&_td]:whitespace-nowrap",
          className
        ),
        dangerouslySetInnerHTML: { __html: html }
      }
    ),
    choice && labels ? /* @__PURE__ */ jsx5(LinkChoicePopover, { choice, labels, onClose: () => setChoice(null) }) : null
  ] });
}
function LinkChoicePopover({
  choice,
  labels,
  onClose
}) {
  const ref = React5.useRef(null);
  React5.useEffect(() => {
    ref.current?.querySelector("button")?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const onPointerDown = (event) => {
      if (!ref.current?.contains(event.target)) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onClose]);
  const open = (newTab) => {
    if (newTab) window.open(choice.href, "_blank", "noopener,noreferrer");
    else window.location.assign(choice.href);
    onClose();
  };
  return /* @__PURE__ */ jsxs5(
    "div",
    {
      ref,
      role: "menu",
      "aria-label": labels.linkOpenTitle,
      "data-slot": "ai-chat-link-choice",
      style: { left: choice.x, top: choice.y, width: POPOVER_WIDTH },
      className: "fixed z-10 overflow-hidden rounded-lg border border-border-default bg-bg-default py-1 shadow-lg",
      children: [
        /* @__PURE__ */ jsx5("p", { className: "truncate px-3 pb-1 text-caption text-text-body", children: hostOf(choice.href) }),
        /* @__PURE__ */ jsx5(
          LinkChoiceItem,
          {
            icon: /* @__PURE__ */ jsx5(CornerDownRight, { className: "size-3.5 shrink-0" }),
            label: labels.linkOpenHere,
            onClick: () => open(false)
          }
        ),
        /* @__PURE__ */ jsx5(
          LinkChoiceItem,
          {
            icon: /* @__PURE__ */ jsx5(ExternalLink, { className: "size-3.5 shrink-0" }),
            label: labels.linkOpenNewTab,
            onClick: () => open(true)
          }
        )
      ]
    }
  );
}
function LinkChoiceItem({
  icon,
  label,
  onClick
}) {
  return /* @__PURE__ */ jsxs5(
    "button",
    {
      type: "button",
      role: "menuitem",
      onClick,
      className: "flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-caption text-text-black hover:bg-brand-subtle hover:text-brand-hover",
      children: [
        icon,
        /* @__PURE__ */ jsx5("span", { className: "truncate", children: label })
      ]
    }
  );
}
function hostOf(href) {
  try {
    return new URL(href, window.location.href).host;
  } catch {
    return href;
  }
}

// src/ai-chat/components/ToolTrail.tsx
import * as React6 from "react";
import { Check, Loader2 as Loader23, TriangleAlert } from "lucide-react";
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
function ToolTrail({ tools }) {
  if (tools.length === 0) return null;
  return /* @__PURE__ */ jsx6("ul", { className: "mb-2 flex flex-col gap-1", "data-slot": "ai-chat-tool-trail", children: tools.map((tool, index) => /* @__PURE__ */ jsxs6(
    "li",
    {
      className: cn(
        "flex items-center gap-1.5 text-caption",
        tool.status === "error" ? "text-error-red-600" : "text-gray-500"
      ),
      children: [
        /* @__PURE__ */ jsx6(ToolIcon, { status: tool.status }),
        /* @__PURE__ */ jsx6("span", { className: cn(tool.status === "done" && "line-through decoration-gray-300"), children: tool.label_th }),
        tool.status === "start" && /* @__PURE__ */ jsx6(Elapsed, { since: tool.startedAt })
      ]
    },
    `${tool.label_th}-${index}`
  )) });
}
function Elapsed({ since }) {
  const [seconds, setSeconds] = React6.useState(() => elapsedSeconds(since));
  React6.useEffect(() => {
    const timer = setInterval(() => setSeconds(elapsedSeconds(since)), 1e3);
    return () => clearInterval(timer);
  }, [since]);
  if (seconds < 3) return null;
  return /* @__PURE__ */ jsxs6("span", { className: "tabular-nums opacity-60", children: [
    "(",
    seconds,
    " \u0E27\u0E34)"
  ] });
}
var elapsedSeconds = (since) => Math.floor((Date.now() - since) / 1e3);
function ToolIcon({ status }) {
  if (status === "start") return /* @__PURE__ */ jsx6(Loader23, { className: "size-3.5 shrink-0 animate-spin" });
  if (status === "error") return /* @__PURE__ */ jsx6(TriangleAlert, { className: "size-3.5 shrink-0" });
  return /* @__PURE__ */ jsx6(Check, { className: "size-3.5 shrink-0 text-success-green-600" });
}

// src/ai-chat/components/WidgetRenderer.tsx
import * as React7 from "react";
import { CircleAlert, Loader2 as Loader24, TriangleAlert as TriangleAlert2 } from "lucide-react";
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
function WidgetRenderer({
  widget,
  onAction,
  disabled,
  superseded,
  supersededNote,
  waitingNote
}) {
  switch (widget.type) {
    case "confirm":
      return /* @__PURE__ */ jsx7(
        ConfirmCard,
        {
          payload: widget.payload,
          onAction,
          disabled,
          superseded,
          supersededNote,
          waitingNote
        }
      );
    case "error_card":
      return /* @__PURE__ */ jsx7(
        ErrorCard,
        {
          payload: widget.payload,
          onAction,
          disabled,
          waitingNote
        }
      );
    case "staff_picker":
      return /* @__PURE__ */ jsx7(
        StaffPicker,
        {
          payload: widget.payload,
          onAction,
          disabled,
          waitingNote
        }
      );
    case "summary_stats":
      return /* @__PURE__ */ jsx7(SummaryStats, { payload: widget.payload });
    case "schedule_diff":
      return /* @__PURE__ */ jsx7(ScheduleDiff, { payload: widget.payload });
    default:
      return /* @__PURE__ */ jsx7(Frame, { children: /* @__PURE__ */ jsxs7("p", { className: "text-caption text-gray-500", children: [
        "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A (",
        widget.type,
        ")"
      ] }) });
  }
}
function Frame({ children, className }) {
  return /* @__PURE__ */ jsx7(
    "div",
    {
      "data-slot": "ai-chat-widget",
      className: cn("mt-2 rounded-md border border-border-default bg-white p-3", className),
      children
    }
  );
}
function ActionButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  loading
}) {
  return /* @__PURE__ */ jsxs7(
    "button",
    {
      type: "button",
      onClick,
      disabled: disabled || loading,
      "aria-busy": loading || void 0,
      className: cn(
        "inline-flex h-8 items-center gap-1.5 rounded-sm px-3 text-body-sm font-semibold transition-colors cursor-pointer",
        "disabled:pointer-events-none disabled:opacity-40",
        /* ปุ่มที่กำลังทำงานต้อง **ไม่จาง** — จางแล้วอ่านว่า "กดไม่ได้" ซึ่งเป็นคนละเรื่องกับ "กำลังทำให้อยู่"
         * `disabled:opacity-100` ชนะกฎบนได้เพราะเป็น variant เดียวกันแต่มาทีหลัง */
        loading && "disabled:opacity-100 disabled:cursor-progress",
        variant === "primary" ? "bg-brand text-brand-foreground hover:bg-brand-hover" : "border border-brand bg-white text-brand hover:bg-brand-subtle"
      ),
      children: [
        loading && /* @__PURE__ */ jsx7(Loader24, { "aria-hidden": true, className: "size-3.5 animate-spin" }),
        children
      ]
    }
  );
}
function WaitingRow({ note }) {
  return /* @__PURE__ */ jsxs7(
    "p",
    {
      "data-slot": "ai-chat-widget-waiting",
      "aria-live": "polite",
      className: "mt-3 flex items-center gap-1.5 text-caption text-text-body",
      children: [
        /* @__PURE__ */ jsx7(Loader24, { "aria-hidden": true, className: "size-3.5 shrink-0 animate-spin" }),
        note
      ]
    }
  );
}
function usePressed(disabled) {
  const [pressed, setPressed] = React7.useState(null);
  React7.useEffect(() => {
    if (!disabled) setPressed(null);
  }, [disabled]);
  return [pressed, setPressed];
}
function ConfirmCard({
  payload,
  onAction,
  disabled,
  superseded,
  supersededNote,
  waitingNote
}) {
  const [pressed, setPressed] = usePressed(disabled);
  const waiting = Boolean(disabled) && pressed === null && Boolean(waitingNote);
  const answer = (label) => {
    setPressed(label);
    onAction(label);
  };
  return /* @__PURE__ */ jsxs7(Frame, { className: superseded ? "opacity-70" : void 0, children: [
    /* @__PURE__ */ jsx7("p", { className: "text-body-sm font-semibold text-black", children: payload.title_th }),
    /* @__PURE__ */ jsx7("p", { className: "mt-1 whitespace-pre-wrap text-body-sm text-gray-600", children: payload.summary_th }),
    superseded ? /* @__PURE__ */ jsx7("p", { className: "mt-2 text-caption text-text-tertiary", "data-slot": "ai-chat-superseded", children: supersededNote }) : waiting ? /* @__PURE__ */ jsx7(WaitingRow, { note: waitingNote }) : /* @__PURE__ */ jsxs7("div", { className: "mt-3 flex gap-2", children: [
      /* @__PURE__ */ jsx7(
        ActionButton,
        {
          onClick: () => answer(payload.confirmLabel),
          disabled,
          loading: Boolean(disabled) && pressed === payload.confirmLabel,
          children: payload.confirmLabel
        }
      ),
      /* @__PURE__ */ jsx7(
        ActionButton,
        {
          variant: "secondary",
          onClick: () => answer(payload.cancelLabel),
          disabled,
          loading: Boolean(disabled) && pressed === payload.cancelLabel,
          children: payload.cancelLabel
        }
      )
    ] })
  ] });
}
function ErrorCard({
  payload,
  onAction,
  disabled,
  waitingNote
}) {
  const [pressed, setPressed] = usePressed(disabled);
  const waiting = Boolean(disabled) && pressed === null && Boolean(waitingNote);
  const isError = payload.severity === "error";
  return /* @__PURE__ */ jsx7(
    Frame,
    {
      className: isError ? "border-error-red-100 bg-error-red-50" : "border-warning-yellow-200 bg-warning-yellow-50",
      children: /* @__PURE__ */ jsxs7("div", { className: "flex items-start gap-2", children: [
        isError ? /* @__PURE__ */ jsx7(CircleAlert, { className: "mt-0.5 size-4 shrink-0 text-error-red-600" }) : /* @__PURE__ */ jsx7(TriangleAlert2, { className: "mt-0.5 size-4 shrink-0 text-warning-normal" }),
        /* @__PURE__ */ jsxs7("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxs7("p", { className: "text-body-sm font-semibold text-black", children: [
            payload.code,
            " \u2014 ",
            payload.message_th
          ] }),
          payload.location && /* @__PURE__ */ jsxs7("p", { className: "mt-1 text-caption text-gray-600", children: [
            payload.location.date,
            " \xB7 \u0E40\u0E27\u0E23 ",
            payload.location.shiftType
          ] }),
          payload.fixActions.length > 0 && waiting && /* @__PURE__ */ jsx7(WaitingRow, { note: waitingNote }),
          payload.fixActions.length > 0 && !waiting && /* @__PURE__ */ jsx7("div", { className: "mt-2 flex flex-wrap gap-2", children: payload.fixActions.map((fix) => /* @__PURE__ */ jsx7(
            ActionButton,
            {
              variant: "secondary",
              onClick: () => {
                setPressed(fix.label_th);
                onAction(fix.label_th);
              },
              disabled,
              loading: Boolean(disabled) && pressed === fix.label_th,
              children: fix.label_th
            },
            fix.opRef
          )) })
        ] })
      ] })
    }
  );
}
function StaffPicker({
  payload,
  onAction,
  disabled,
  waitingNote
}) {
  const [pressed, setPressed] = usePressed(disabled);
  const waiting = Boolean(disabled) && pressed === null && Boolean(waitingNote);
  return /* @__PURE__ */ jsxs7(Frame, { children: [
    /* @__PURE__ */ jsx7("p", { className: "text-body-sm text-gray-700", children: payload.prompt_th }),
    /* @__PURE__ */ jsx7("div", { className: "mt-2 flex flex-col gap-1", children: payload.candidates.map((candidate) => {
      const busy = Boolean(disabled) && pressed === candidate.displayName;
      return /* @__PURE__ */ jsxs7(
        "button",
        {
          type: "button",
          disabled,
          "aria-busy": busy || void 0,
          onClick: () => {
            setPressed(candidate.displayName);
            onAction(candidate.displayName);
          },
          className: cn(
            "flex items-baseline gap-2 rounded-sm border border-border-subtle px-2 py-1.5 text-left",
            "hover:bg-brand-subtle disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
            busy && "disabled:opacity-100 border-brand bg-brand-subtle"
          ),
          children: [
            busy && /* @__PURE__ */ jsx7(Loader24, { "aria-hidden": true, className: "size-3.5 shrink-0 animate-spin text-brand" }),
            /* @__PURE__ */ jsx7("span", { className: "text-body-sm font-medium text-black", children: candidate.displayName }),
            candidate.subUnit && /* @__PURE__ */ jsx7("span", { className: "text-caption text-gray-500", children: candidate.subUnit }),
            candidate.hint && /* @__PURE__ */ jsx7("span", { className: "text-caption text-gray-400", children: candidate.hint })
          ]
        },
        candidate.userId
      );
    }) }),
    waiting && /* @__PURE__ */ jsx7(WaitingRow, { note: waitingNote })
  ] });
}
function SummaryStats({ payload }) {
  return /* @__PURE__ */ jsxs7(Frame, { children: [
    /* @__PURE__ */ jsx7("dl", { className: "grid grid-cols-2 gap-2", children: payload.stats.map((stat) => /* @__PURE__ */ jsxs7("div", { className: "rounded-sm bg-gray-50 px-2 py-1.5", children: [
      /* @__PURE__ */ jsx7("dt", { className: "text-caption text-gray-500", children: stat.label_th }),
      /* @__PURE__ */ jsx7(
        "dd",
        {
          className: cn(
            "text-body-sm font-semibold",
            stat.flag === "high" && "text-error-red-600",
            stat.flag === "low" && "text-warning-normal",
            !stat.flag && "text-black"
          ),
          children: stat.value
        }
      )
    ] }, stat.label_th)) }),
    payload.warnings_th.length > 0 && /* @__PURE__ */ jsx7("ul", { className: "mt-2 flex flex-col gap-1", children: payload.warnings_th.map((warning) => /* @__PURE__ */ jsxs7("li", { className: "text-caption text-warning-normal", children: [
      "\u2022 ",
      warning
    ] }, warning)) })
  ] });
}
function ScheduleDiff({ payload }) {
  return /* @__PURE__ */ jsxs7(Frame, { className: "overflow-x-auto", children: [
    /* @__PURE__ */ jsxs7("p", { className: "mb-2 text-caption text-gray-500", children: [
      "\u0E15\u0E32\u0E23\u0E32\u0E07\u0E40\u0E27\u0E23 #",
      payload.scheduleId,
      " \xB7 \u0E40\u0E27\u0E2D\u0E23\u0E4C\u0E0A\u0E31\u0E19 ",
      payload.version,
      " \xB7 ",
      payload.changes.length,
      " \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"
    ] }),
    /* @__PURE__ */ jsx7("table", { className: "w-full border-collapse text-body-sm", children: /* @__PURE__ */ jsx7("tbody", { children: payload.changes.map((change, index) => /* @__PURE__ */ jsxs7("tr", { className: "border-b border-border-subtle", children: [
      /* @__PURE__ */ jsx7("td", { className: "py-1 pr-2 whitespace-nowrap text-gray-600", children: change.date }),
      /* @__PURE__ */ jsx7("td", { className: "py-1 pr-2 text-gray-400 line-through", children: change.before ?? "\u2014" }),
      /* @__PURE__ */ jsx7("td", { className: "py-1 font-medium text-black", children: change.after ?? "\u2014" })
    ] }, `${change.date}-${change.userId}-${index}`)) }) })
  ] });
}

// src/ai-chat/components/MessageBubble.tsx
import { jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
function MessageBubble({ message, labels, onWidgetAction, widgetsDisabled }) {
  if (message.role === "system") {
    return /* @__PURE__ */ jsxs8("div", { className: "my-2 flex items-center gap-2", "data-slot": "ai-chat-divider", children: [
      /* @__PURE__ */ jsx8("span", { className: "h-px flex-1 bg-border-subtle" }),
      /* @__PURE__ */ jsx8("span", { className: "text-[11px] text-text-tertiary", children: message.content }),
      /* @__PURE__ */ jsx8("span", { className: "h-px flex-1 bg-border-subtle" })
    ] });
  }
  const isUser = message.role === "user";
  const lastConfirm = lastConfirmIndex(message.widgets ?? []);
  return /* @__PURE__ */ jsx8(
    "div",
    {
      "data-slot": "ai-chat-message",
      "data-role": message.role,
      className: cn("flex w-full", isUser ? "justify-end" : "justify-start"),
      children: /* @__PURE__ */ jsxs8("div", { className: cn(isUser ? "flex max-w-[85%] flex-col items-end" : "w-full min-w-0"), children: [
        /* @__PURE__ */ jsx8(
          "span",
          {
            className: cn(
              "mb-1 block text-[11px] font-semibold tracking-wide",
              isUser ? "text-text-tertiary" : "text-brand-hover"
            ),
            children: isUser ? labels.you : labels.assistant
          }
        ),
        !isUser && message.tools && /* @__PURE__ */ jsx8(ToolTrail, { tools: message.tools }),
        (message.content || !isUser) && /* @__PURE__ */ jsx8(
          "div",
          {
            className: cn(
              "text-body-sm break-words",
              isUser ? (
                /* 🔴 `text-brand-foreground` ⛔ **ห้ามฮาร์ดโค้ดสีตายตัว** — พื้นเป็นสีแบรนด์ซึ่ง
                 * ต่างกัน 4 แอป และไม่มีสีตัวอักษรสีไหนถูกทั้งสี่ (วัดแล้ว):
                 *
                 *   Mediwork  #26d1b3   ขาว 1.93 ❌   เข้ม 8.77 ✅
                 *   Medimatch #0395d8   ขาว 3.34 ❌   เข้ม 5.09 ✅
                 *   Portal    #43596e   ขาว 7.26 ✅   เข้ม 2.42 ❌
                 *   MediHR    #0611ac   ขาว 12.47 ✅  เข้ม 1.41 ❌
                 *
                 * เคยฮาร์ดโค้ด `text-text-black` ไว้เพราะแก้เคสมิ้นต์ — ซึ่งทำให้ฟองบน MediHR
                 * ได้ **1.41:1** อ่านแทบไม่ออก · ตอนนี้แต่ละธีมตั้ง `--color-brand-foreground`
                 * ของตัวเองแล้ว ⇒ ที่นี่อ่าน token อย่างเดียว
                 *
                 * มุมล่างฝั่งที่ชิดขอบเหลือ 4 ⇒ ฟองชี้กลับไปหาคนพูด อ่านออกแม้เป็นขาวดำ */
                "whitespace-pre-wrap rounded-xl rounded-br-sm bg-brand px-3.5 py-2.5 text-brand-foreground"
              ) : message.failed ? "rounded-xl rounded-bl-sm border border-error-red-100 bg-error-red-50 px-3.5 py-2.5 text-error-red-800" : (
                /* ผู้ช่วยไม่มีกล่อง — พูดบนพื้นแผงตรง ๆ · ของเดิมเป็นการ์ดขาวมีขอบ `#0000000f`
                 * วางบนพื้น `#fbfbfd` ซึ่งเป็นขาวบนเกือบขาว: ขอบเขตอ่านไม่ออก แต่กินที่ทั้งสองข้าง */
                "text-text-black"
              )
            ),
            children: isUser ? message.content : message.content ? /* @__PURE__ */ jsx8(Markdown, { text: message.content, labels }) : message.streaming ? /* @__PURE__ */ jsx8(TypingDots, { label: labels.thinking }) : null
          }
        ),
        message.widgets?.map((widget, index) => /* @__PURE__ */ jsx8(
          WidgetRenderer,
          {
            widget,
            onAction: onWidgetAction,
            disabled: widgetsDisabled,
            superseded: widget.type === "confirm" && index !== lastConfirm,
            supersededNote: labels.cardSuperseded,
            waitingNote: labels.cardWaiting
          },
          `${widget.type}-${index}`
        )),
        message.outcome && /* @__PURE__ */ jsx8(OutcomeBadge, { outcome: message.outcome, labels })
      ] })
    }
  );
}
function OutcomeBadge({
  outcome,
  labels
}) {
  if (outcome.committed === void 0) return null;
  return /* @__PURE__ */ jsxs8(
    "span",
    {
      className: cn(
        "mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        outcome.committed ? "bg-success-green-background-50 text-success-green-800" : "bg-overlay-hover text-text-body"
      ),
      children: [
        outcome.committed ? /* @__PURE__ */ jsx8(CircleCheck, { className: "size-3" }) : /* @__PURE__ */ jsx8(CircleSlash, { className: "size-3" }),
        outcome.committed ? labels.committed : labels.notCommitted
      ]
    }
  );
}
function TypingDots({ label }) {
  return /* @__PURE__ */ jsxs8("span", { className: "flex items-center gap-1 text-text-tertiary", "aria-label": label, children: [
    /* @__PURE__ */ jsx8(Dot, { delay: "0ms" }),
    /* @__PURE__ */ jsx8(Dot, { delay: "150ms" }),
    /* @__PURE__ */ jsx8(Dot, { delay: "300ms" })
  ] });
}
function Dot({ delay }) {
  return /* @__PURE__ */ jsx8(
    "span",
    {
      className: "inline-block size-1.5 animate-bounce rounded-full bg-current",
      style: { animationDelay: delay }
    }
  );
}
function lastConfirmIndex(widgets) {
  for (let index = widgets.length - 1; index >= 0; index -= 1) {
    if (widgets[index]?.type === "confirm") return index;
  }
  return -1;
}

// src/ai-chat/components/MessageList.tsx
import { jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
function MessageList({
  messages,
  labels,
  onWidgetAction,
  busy,
  suggestions
}) {
  const endRef = React8.useRef(null);
  React8.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);
  if (messages.length === 0) {
    return /* @__PURE__ */ jsxs9("div", { className: "flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center", children: [
      /* @__PURE__ */ jsx9(Sparkles, { className: "size-8 text-brand-active" }),
      /* @__PURE__ */ jsx9("p", { className: "text-body-sm font-semibold text-text-black", children: labels.emptyTitle }),
      /* @__PURE__ */ jsx9("p", { className: "text-caption text-text-body", children: labels.emptyHint }),
      suggestions && suggestions.length > 0 && /* @__PURE__ */ jsx9("div", { className: "mt-4 flex w-full flex-col gap-2", children: suggestions.map((suggestion) => /* @__PURE__ */ jsx9(
        "button",
        {
          type: "button",
          disabled: busy,
          onClick: () => onWidgetAction(suggestion),
          className: cn(
            "rounded-lg border border-border-default bg-bg-default px-3 py-2 text-left text-body-sm text-text-black",
            "transition-colors hover:border-brand-active hover:bg-brand-subtle cursor-pointer",
            "disabled:pointer-events-none disabled:opacity-40"
          ),
          children: suggestion
        },
        suggestion
      )) })
    ] });
  }
  return /* @__PURE__ */ jsxs9(
    "div",
    {
      "data-slot": "ai-chat-messages",
      className: "flex flex-1 flex-col gap-3.5 overflow-y-auto px-4 py-4",
      children: [
        messages.map((message, index) => /* @__PURE__ */ jsx9(
          MessageBubble,
          {
            message,
            labels,
            onWidgetAction,
            widgetsDisabled: busy || index !== messages.length - 1
          },
          message.id
        )),
        /* @__PURE__ */ jsx9("div", { ref: endRef })
      ]
    }
  );
}

// src/ai-chat/components/ChatDrawer.tsx
import { Fragment as Fragment2, jsx as jsx10, jsxs as jsxs10 } from "react/jsx-runtime";
function ChatDrawer(props) {
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
    onTranscribe,
    onVoiceError,
    onNewChat,
    onPickConversation,
    onRetry,
    loadConversations,
    activeConversationId,
    mode,
    contextUsage,
    suggestions
  } = props;
  const [historyOpen, setHistoryOpen] = React9.useState(false);
  const busy = status === "sending" || status === "streaming";
  const starting = status === "starting";
  return /* @__PURE__ */ jsx10(RadixDialog.Root, { open, onOpenChange, modal: false, children: /* @__PURE__ */ jsx10(RadixDialog.Portal, { children: /* @__PURE__ */ jsxs10(
    RadixDialog.Content,
    {
      "data-slot": "ai-chat-drawer",
      "aria-describedby": void 0,
      onInteractOutside: (event) => event.preventDefault(),
      onPointerDownOutside: (event) => event.preventDefault(),
      style: { zIndex: "var(--mediact-ai-chat-z, 1310)" },
      className: cn(
        /* พื้นแผงเป็น **ขาว** ไม่ใช่ `bg-bg-subtle` — คำตอบของผู้ช่วยเลิกอยู่ในการ์ดแล้ว (`MessageBubble`)
           ถ้าพื้นยังเป็นเทา ข้อความจะลอยอยู่บนเทาโดยไม่มีอะไรรองรับ · ที่เคยต้องเป็นเทาเพราะมีการ์ดขาววางทับ */
        "fixed inset-y-0 flex w-full flex-col bg-bg-default shadow-2xl outline-none",
        "sm:w-[var(--mediact-ai-chat-drawer-width,26rem)]",
        position === "bottom-left" ? "left-0 border-r border-border-default" : "right-0 border-l border-border-default",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        position === "bottom-left" ? "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left" : "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
      ),
      children: [
        /* @__PURE__ */ jsxs10("header", { className: "flex items-center gap-2 border-b border-border-subtle bg-bg-default px-4 py-3", children: [
          historyOpen && /* @__PURE__ */ jsx10(IconButton, { label: labels.historyBack, onClick: () => setHistoryOpen(false), children: /* @__PURE__ */ jsx10(ChevronLeft, { className: "size-4" }) }),
          /* @__PURE__ */ jsxs10("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx10(RadixDialog.Title, { className: "truncate text-body-sm font-semibold text-text-black", children: historyOpen ? labels.historyTitle : labels.title }),
            !historyOpen && mode === "schedule" ? /* @__PURE__ */ jsxs10("p", { className: "mt-0.5 flex min-w-0 items-center gap-1 truncate text-caption font-medium text-brand", children: [
              /* @__PURE__ */ jsx10(CalendarDays, { className: "size-3 shrink-0", "aria-hidden": true }),
              labels.scheduleMode
            ] }) : !historyOpen ? (
              /* คำบรรยายมีเฉพาะหน้าแชท — ในหน้าประวัติ หัวข้อบอกตัวเองครบแล้ว
                 และแถวรายการต้องการความสูงมากกว่าคำอธิบายซ้ำ */
              /* @__PURE__ */ jsx10("p", { className: "truncate text-caption text-text-body", children: labels.subtitle })
            ) : null
          ] }),
          !historyOpen && /* @__PURE__ */ jsx10(ContextMeter, { usage: contextUsage ?? null, labels, className: "mr-1" }),
          !historyOpen && /* @__PURE__ */ jsx10(IconButton, { label: labels.history, onClick: () => setHistoryOpen(true), children: /* @__PURE__ */ jsx10(History, { className: "size-4" }) }),
          /* @__PURE__ */ jsx10(IconButton, { label: labels.newChat, onClick: onNewChat, children: /* @__PURE__ */ jsx10(Plus, { className: "size-4" }) }),
          historyOpen && /* @__PURE__ */ jsx10(IconButton, { label: labels.historyClose, onClick: () => setHistoryOpen(false), children: /* @__PURE__ */ jsx10(X, { className: "size-4" }) }),
          !historyOpen && /* @__PURE__ */ jsx10(RadixDialog.Close, { asChild: true, children: /* @__PURE__ */ jsx10(IconButton, { label: labels.minimize, children: position === "bottom-left" ? /* @__PURE__ */ jsx10(ChevronsLeft, { className: "size-4" }) : /* @__PURE__ */ jsx10(ChevronsRight, { className: "size-4" }) }) })
        ] }),
        historyOpen ? /* @__PURE__ */ jsx10(
          ConversationPicker,
          {
            load: loadConversations,
            activeId: activeConversationId,
            labels,
            onPick: (id) => {
              setHistoryOpen(false);
              onPickConversation(id);
            }
          }
        ) : /* @__PURE__ */ jsxs10(Fragment2, { children: [
          /* @__PURE__ */ jsx10(
            StatusBar,
            {
              status,
              transportStatus,
              error,
              labels,
              onRetry
            }
          ),
          /* @__PURE__ */ jsx10(
            MessageList,
            {
              messages,
              labels,
              busy,
              suggestions,
              onWidgetAction: onSend
            }
          ),
          /* @__PURE__ */ jsx10(
            Composer,
            {
              onSend,
              onCancel,
              busy,
              disabled: starting || status === "error",
              labels,
              placeholder: mode === "schedule" ? labels.placeholderSchedule : labels.placeholder,
              onTranscribe,
              onVoiceError
            }
          )
        ] })
      ]
    }
  ) }) });
}
function StatusBar({
  status,
  transportStatus,
  error,
  labels,
  onRetry
}) {
  if (status === "error") {
    return /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2 bg-error-red-50 px-4 py-2 text-caption text-error-red-800", children: [
      /* @__PURE__ */ jsxs10("span", { className: "min-w-0 flex-1", children: [
        error,
        transportStatus === "connecting" && /* @__PURE__ */ jsx10("span", { className: "mt-0.5 block text-error-red-800/70", children: labels.reconnecting })
      ] }),
      /* @__PURE__ */ jsx10(
        "button",
        {
          type: "button",
          onClick: onRetry,
          className: "shrink-0 font-semibold underline cursor-pointer",
          children: labels.retry
        }
      )
    ] });
  }
  if (status === "starting" || transportStatus === "connecting") {
    return /* @__PURE__ */ jsx10("div", { className: "bg-brand-subtle px-4 py-1.5 text-caption text-brand", children: labels.connecting });
  }
  if (transportStatus === "disconnected") {
    return /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2 bg-overlay-hover px-4 py-1.5 text-caption text-text-body", children: [
      /* @__PURE__ */ jsx10("span", { className: "min-w-0 flex-1 truncate", children: labels.disconnected }),
      /* @__PURE__ */ jsx10(
        "button",
        {
          type: "button",
          onClick: onRetry,
          className: "shrink-0 font-semibold underline cursor-pointer",
          children: labels.retry
        }
      )
    ] });
  }
  return null;
}
var IconButton = React9.forwardRef(function IconButton2({ label, onClick, active, children, ...props }, ref) {
  return /* @__PURE__ */ jsx10(
    "button",
    {
      ref,
      type: "button",
      onClick,
      "aria-label": label,
      title: label,
      className: cn(
        /* มุม 10 (`rounded-[10px]`) ไม่ใช่ 6 — ปุ่มไอคอนสี่ตัวเรียงกันในแถบหัวที่กว้าง 416
           มุมที่คมกว่ากล่องอื่นในแผงทำให้แถบนี้อ่านเป็นแถบเครื่องมือแยกจากเนื้อหา
           hover เป็นพื้นจางของแบรนด์ ไม่ใช่เทา — ปุ่มพวกนี้เป็นทางลัดของผู้ช่วย ไม่ใช่ปุ่มกลางของระบบ */
        "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-text-body transition-colors",
        "hover:bg-brand-subtle hover:text-brand-hover",
        active && "bg-brand-subtle text-brand-hover"
      ),
      ...props,
      children
    }
  );
});

// src/ai-chat/components/FloatingButton.tsx
import * as React10 from "react";
import { ChevronsLeft as ChevronsLeft2, ChevronsRight as ChevronsRight2, Sparkles as Sparkles2 } from "lucide-react";
import { jsx as jsx11 } from "react/jsx-runtime";
var EDGE_MARGIN = 8;
var BUTTON_SIZE = 56;
var DRAG_THRESHOLD = 4;
var FALLBACK_EDGE_GAP = 24;
var STORAGE_KEY = "mediact-ai-chat-launcher-y";
var clamp = (value, viewport) => Math.min(Math.max(value, EDGE_MARGIN), Math.max(viewport - BUTTON_SIZE - EDGE_MARGIN, EDGE_MARGIN));
var readStoredY = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const y = Number(raw);
    return Number.isFinite(y) ? clamp(y, window.innerHeight) : null;
  } catch {
    return null;
  }
};
var FloatingButton = React10.forwardRef(
  function FloatingButton2({ open, onClick, label, position = "bottom-right", draggable = true, className }, ref) {
    const [top, setTop] = React10.useState(null);
    const [dragPoint, setDragPoint] = React10.useState(null);
    const [viewportWidth, setViewportWidth] = React10.useState(null);
    const [edgeGap, setEdgeGap] = React10.useState(FALLBACK_EDGE_GAP);
    const node = React10.useRef(null);
    const grab = React10.useRef({ x: 0, y: 0 });
    const moved = React10.useRef(false);
    const attachRef = React10.useCallback(
      (element) => {
        node.current = element;
        if (typeof ref === "function") ref(element);
        else if (ref) ref.current = element;
      },
      [ref]
    );
    React10.useEffect(() => {
      if (!draggable) return;
      setViewportWidth(window.innerWidth);
      const rect = node.current?.getBoundingClientRect();
      if (rect) {
        const gap = position === "bottom-left" ? rect.left : window.innerWidth - rect.right;
        if (Number.isFinite(gap) && gap >= 0) setEdgeGap(gap);
      }
      setTop(readStoredY());
    }, [draggable, position]);
    React10.useEffect(() => {
      if (!draggable) return;
      const onResize = () => {
        setViewportWidth(window.innerWidth);
        setTop((current) => current === null ? current : clamp(current, window.innerHeight));
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, [draggable]);
    const handlePointerDown = (event) => {
      if (!draggable || event.button !== 0) return;
      const rect = event.currentTarget.getBoundingClientRect();
      grab.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      moved.current = false;
      event.currentTarget.setPointerCapture(event.pointerId);
    };
    const handlePointerMove = (event) => {
      if (!draggable || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
      const next = { x: event.clientX - grab.current.x, y: event.clientY - grab.current.y };
      if (!moved.current) {
        const rect = event.currentTarget.getBoundingClientRect();
        if (Math.abs(next.x - rect.left) < DRAG_THRESHOLD && Math.abs(next.y - rect.top) < DRAG_THRESHOLD)
          return;
        moved.current = true;
      }
      setDragPoint({ x: clamp(next.x, window.innerWidth), y: clamp(next.y, window.innerHeight) });
    };
    const handlePointerUp = (event) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
      event.currentTarget.releasePointerCapture(event.pointerId);
      const droppedY = dragPoint?.y ?? null;
      setDragPoint(null);
      if (!moved.current || droppedY === null) return;
      setTop(droppedY);
      try {
        window.localStorage.setItem(STORAGE_KEY, String(droppedY));
      } catch {
      }
    };
    const restingLeft = viewportWidth === null ? null : clamp(position === "bottom-left" ? edgeGap : viewportWidth - BUTTON_SIZE - edgeGap, viewportWidth);
    const offset = "var(--mediact-ai-chat-launcher-offset, 1.5rem)";
    const placement = dragPoint ? { left: dragPoint.x, top: dragPoint.y } : top !== null && restingLeft !== null ? { left: restingLeft, top } : {
      insetInlineEnd: position === "bottom-right" ? offset : void 0,
      insetInlineStart: position === "bottom-left" ? offset : void 0,
      insetBlockEnd: offset
    };
    return /* @__PURE__ */ jsx11(
      "button",
      {
        ref: attachRef,
        type: "button",
        onClick: () => {
          if (moved.current) {
            moved.current = false;
            return;
          }
          onClick();
        },
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerCancel: handlePointerUp,
        "aria-label": label,
        title: label,
        "aria-expanded": open,
        "data-slot": "ai-chat-launcher",
        style: {
          zIndex: "var(--mediact-ai-chat-z, 1310)",
          // กันเบราว์เซอร์แย่งไปเลื่อนหน้าจอตอนลากด้วยนิ้ว
          touchAction: draggable ? "none" : void 0,
          ...placement
        },
        className: cn(
          "group fixed flex size-14 items-center justify-center rounded-full",
          "bg-brand text-brand-foreground shadow-lg",
          "hover:bg-brand-hover hover:shadow-xl",
          "outline-none focus-visible:ring-2 focus-visible:ring-brand-active focus-visible:ring-offset-2",
          draggable && "touch-none select-none",
          /* ⛔ ไม่มี `transition` ตอนลาก — ปุ่มจะไล่ตามนิ้วช้ากว่าความจริงทันที
             และ `active:scale-95` ทำให้ปุ่มหดระหว่างลาก ซึ่งอ่านว่ากำลังกดอยู่
             ตอนปล่อย: เส้นโค้งแบบ back-out เลยขอบไปนิดแล้วดีดกลับ = "เด้ง" ที่ตาเห็นจริง
             ไม่ใช่แค่ไถลกลับ · 300ms — นานกว่านี้กลายเป็นการรอ */
          dragPoint ? "scale-105 cursor-grabbing shadow-xl" : "cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] active:scale-95",
          className
        ),
        children: open ? (
          // Matches the drawer's own header button: the same collapse chevron, pointing at the same edge.
          // Two different glyphs for one action taught two different meanings — and an ✕ taught the wrong one.
          position === "bottom-left" ? /* @__PURE__ */ jsx11(ChevronsLeft2, { className: "size-6" }) : /* @__PURE__ */ jsx11(ChevronsRight2, { className: "size-6" })
        ) : /* @__PURE__ */ jsx11(Sparkles2, { className: "size-6 shrink-0 transition-transform group-hover:scale-110" })
      }
    );
  }
);

// src/ai-chat/labels.ts
var thLabels = {
  launcher: "\u0E1C\u0E39\u0E49\u0E0A\u0E48\u0E27\u0E22 AI",
  title: "\u0E1C\u0E39\u0E49\u0E0A\u0E48\u0E27\u0E22 AI",
  subtitle: "\u0E16\u0E32\u0E21\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E15\u0E32\u0E23\u0E32\u0E07\u0E40\u0E27\u0E23 \u0E04\u0E33\u0E02\u0E2D \u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22",
  placeholder: "\u0E16\u0E32\u0E21\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E15\u0E32\u0E23\u0E32\u0E07\u0E40\u0E27\u0E23 \u0E40\u0E0A\u0E48\u0E19 \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 6 \u0E43\u0E04\u0E23\u0E40\u0E27\u0E23\u0E40\u0E0A\u0E49\u0E32\u2026",
  placeholderSchedule: '\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E42\u0E2B\u0E21\u0E14\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23 \u2014 \u0E1E\u0E34\u0E21\u0E1E\u0E4C "\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23\u0E40\u0E25\u0E22" \u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E30\u0E1A\u0E38\u0E41\u0E1C\u0E19\u0E01/\u0E40\u0E14\u0E37\u0E2D\u0E19\u2026',
  send: "\u0E2A\u0E48\u0E07",
  cancel: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01",
  voiceStart: "\u0E1E\u0E39\u0E14\u0E41\u0E17\u0E19\u0E1E\u0E34\u0E21\u0E1E\u0E4C",
  voiceStop: "\u0E2B\u0E22\u0E38\u0E14\u0E2D\u0E31\u0E14\u0E40\u0E2A\u0E35\u0E22\u0E07",
  voiceDiscard: "\u0E17\u0E34\u0E49\u0E07\u0E40\u0E2A\u0E35\u0E22\u0E07\u0E17\u0E35\u0E48\u0E2D\u0E31\u0E14\u0E44\u0E27\u0E49",
  voiceRecording: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E2D\u0E31\u0E14\u0E40\u0E2A\u0E35\u0E22\u0E07",
  voiceTranscribing: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E41\u0E1B\u0E25\u0E07\u0E40\u0E2A\u0E35\u0E22\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u2026",
  voiceDenied: "\u0E40\u0E1B\u0E34\u0E14\u0E44\u0E21\u0E42\u0E04\u0E23\u0E42\u0E1F\u0E19\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 \u2014 \u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E44\u0E21\u0E42\u0E04\u0E23\u0E42\u0E1F\u0E19\u0E43\u0E19\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E01\u0E48\u0E2D\u0E19",
  /* ต้องชี้ทางออกเป็น "พิมพ์แทน" เสมอ — เสียงเป็นแค่ทางลัด คนที่ติดอยู่กับปุ่มไมค์คือคนที่ลืมไปว่ามีช่องพิมพ์อยู่แล้ว */
  voiceFailed: "\u0E41\u0E1B\u0E25\u0E07\u0E40\u0E2A\u0E35\u0E22\u0E07\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u0E25\u0E2D\u0E07\u0E2D\u0E31\u0E14\u0E43\u0E2B\u0E21\u0E48\u0E2B\u0E23\u0E37\u0E2D\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E41\u0E17\u0E19\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22",
  voiceSilent: "\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E22\u0E34\u0E19\u0E40\u0E2A\u0E35\u0E22\u0E07\u0E1E\u0E39\u0E14\u0E43\u0E19\u0E04\u0E25\u0E34\u0E1B\u0E19\u0E35\u0E49 \u0E25\u0E2D\u0E07\u0E1E\u0E39\u0E14\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22",
  voiceLimit: "\u0E2D\u0E31\u0E14\u0E44\u0E14\u0E49\u0E04\u0E23\u0E31\u0E49\u0E07\u0E25\u0E30\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 {seconds} \u0E27\u0E34\u0E19\u0E32\u0E17\u0E35",
  newChat: "\u0E41\u0E0A\u0E17\u0E43\u0E2B\u0E21\u0E48",
  history: "\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E41\u0E0A\u0E17",
  emptyTitle: "\u0E40\u0E23\u0E34\u0E48\u0E21\u0E16\u0E32\u0E21\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22",
  emptyHint: "\u0E40\u0E0A\u0E48\u0E19 \u201C\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E19\u0E35\u0E49\u0E40\u0E27\u0E23\u0E14\u0E36\u0E01\u0E43\u0E04\u0E23\u0E22\u0E31\u0E07\u0E02\u0E32\u0E14\u0E1A\u0E49\u0E32\u0E07\u201D",
  connecting: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u2026",
  disconnected: "\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E2B\u0E25\u0E38\u0E14",
  reconnecting: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34\u2026",
  retry: "\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48",
  minimize: "\u0E22\u0E48\u0E2D\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07\u0E41\u0E0A\u0E17 (\u0E1A\u0E17\u0E2A\u0E19\u0E17\u0E19\u0E32\u0E22\u0E31\u0E07\u0E2D\u0E22\u0E39\u0E48)",
  committed: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E41\u0E25\u0E49\u0E27",
  notCommitted: "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01",
  cardSuperseded: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49\u0E16\u0E39\u0E01\u0E41\u0E17\u0E19\u0E17\u0E35\u0E48\u0E14\u0E49\u0E27\u0E22\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E43\u0E2B\u0E21\u0E48\u0E01\u0E27\u0E48\u0E32\u0E41\u0E25\u0E49\u0E27",
  cardWaiting: "\u0E23\u0E2D\u0E43\u0E2B\u0E49\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E01\u0E48\u0E2D\u0E19\u2026",
  thinking: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E04\u0E34\u0E14\u2026",
  scheduleMode: "\u0E42\u0E2B\u0E21\u0E14\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23",
  assistantMode: "\u0E42\u0E2B\u0E21\u0E14\u0E1C\u0E39\u0E49\u0E0A\u0E48\u0E27\u0E22",
  linkOpenTitle: "\u0E40\u0E1B\u0E34\u0E14\u0E25\u0E34\u0E07\u0E01\u0E4C\u0E19\u0E35\u0E49\u0E22\u0E31\u0E07\u0E44\u0E07",
  linkOpenHere: "\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49",
  linkOpenNewTab: "\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E19\u0E41\u0E17\u0E47\u0E1A\u0E43\u0E2B\u0E21\u0E48",
  you: "\u0E04\u0E38\u0E13",
  assistant: "\u0E1C\u0E39\u0E49\u0E0A\u0E48\u0E27\u0E22",
  historyTitle: "\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E2A\u0E19\u0E17\u0E19\u0E32",
  historySearch: "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E43\u0E19\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34",
  historyBack: "\u0E01\u0E25\u0E31\u0E1A\u0E44\u0E1B\u0E17\u0E35\u0E48\u0E1A\u0E17\u0E2A\u0E19\u0E17\u0E19\u0E32",
  historyClose: "\u0E1B\u0E34\u0E14\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34",
  /* "เริ่มวันนี้" ไม่ใช่ "วันนี้" — จัดกลุ่มด้วย `createdAt` ซึ่งคือตอนเริ่มบทสนทนา
     บทที่กลับไปคุยต่อจะยังอยู่ในกลุ่มของวันที่เริ่ม ไม่ใช่วันที่พิมพ์ล่าสุด */
  historyToday: "\u0E40\u0E23\u0E34\u0E48\u0E21\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49",
  historyEarlier: "\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49",
  historyNoMatch: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1A\u0E17\u0E2A\u0E19\u0E17\u0E19\u0E32\u0E17\u0E35\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E04\u0E33\u0E04\u0E49\u0E19",
  historyCapped: "\u0E41\u0E2A\u0E14\u0E07 {count} \u0E1A\u0E17\u0E2A\u0E19\u0E17\u0E19\u0E32\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14 \u2014 \u0E40\u0E01\u0E48\u0E32\u0E01\u0E27\u0E48\u0E32\u0E19\u0E35\u0E49\u0E04\u0E49\u0E19\u0E44\u0E21\u0E48\u0E40\u0E08\u0E2D",
  historyUntitled: "(\u0E44\u0E21\u0E48\u0E21\u0E35\u0E0A\u0E37\u0E48\u0E2D)",
  timeJustNow: "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E2A\u0E31\u0E01\u0E04\u0E23\u0E39\u0E48",
  timeMinutesAgo: "{count} \u0E19\u0E32\u0E17\u0E35\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27",
  timeHoursAgo: "{count} \u0E0A\u0E21.\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27",
  dateLocale: "th-TH",
  // `{context}` ถูกแทนด้วยแผนก/เดือนที่ hand-off ระบุมา (หรือคำชวนให้ระบุ เมื่อยังไม่รู้)
  scheduleGreeting: [
    "**\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E42\u0E2B\u0E21\u0E14\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23\u0E41\u0E25\u0E49\u0E27\u0E04\u0E23\u0E31\u0E1A**",
    "{context}",
    "",
    "\u0E1A\u0E2D\u0E01\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22\u0E27\u0E48\u0E32\u0E08\u0E30\u0E17\u0E33\u0E2D\u0E30\u0E44\u0E23\u0E15\u0E48\u0E2D \u0E40\u0E0A\u0E48\u0E19",
    '\u2022 **\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34** \u2014 \u0E1E\u0E34\u0E21\u0E1E\u0E4C *"\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23\u0E40\u0E25\u0E22"* \u0E43\u0E2B\u0E49\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E31\u0E14\u0E43\u0E2B\u0E49\u0E17\u0E31\u0E49\u0E07\u0E40\u0E14\u0E37\u0E2D\u0E19',
    "\u2022 **\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E01\u0E48\u0E2D\u0E19** \u2014 \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E1C\u0E39\u0E49\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E07\u0E32\u0E19 \xB7 \u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E40\u0E27\u0E23 \xB7 \u0E40\u0E27\u0E25\u0E32\u0E17\u0E33\u0E01\u0E32\u0E23 \xB7 \u0E01\u0E0E\u0E01\u0E32\u0E23\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23",
    '\u2022 **\u0E25\u0E07\u0E40\u0E27\u0E23\u0E40\u0E2D\u0E07** \u2014 \u0E40\u0E0A\u0E48\u0E19 *"\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 5 \u0E43\u0E2B\u0E49\u0E2A\u0E21\u0E2B\u0E0D\u0E34\u0E07 \u0E40\u0E27\u0E23 D"*',
    "",
    '\u0E1E\u0E34\u0E21\u0E1E\u0E4C *"\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"* \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E42\u0E2B\u0E21\u0E14\u0E44\u0E14\u0E49\u0E17\u0E38\u0E01\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E04\u0E23\u0E31\u0E1A'
  ].join("\n"),
  scheduleGreetingScoped: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23 **\u0E41\u0E1C\u0E19\u0E01 {department}**{subUnit}{period}",
  scheduleGreetingSubUnit: " \xB7 **\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E07\u0E32\u0E19 {subUnit}**",
  scheduleGreetingPeriod: " \u0E40\u0E14\u0E37\u0E2D\u0E19 {month}/{year}",
  scheduleGreetingUnscoped: '\u0E40\u0E23\u0E34\u0E48\u0E21\u0E44\u0E14\u0E49\u0E42\u0E14\u0E22\u0E1A\u0E2D\u0E01\u0E41\u0E1C\u0E19\u0E01\u0E41\u0E25\u0E30\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E08\u0E30\u0E08\u0E31\u0E14\u0E01\u0E48\u0E2D\u0E19 \u0E40\u0E0A\u0E48\u0E19 *"\u0E41\u0E1C\u0E19\u0E01 ICU \u0E40\u0E14\u0E37\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32"*',
  contextTooltip: "\u0E04\u0E27\u0E32\u0E21\u0E08\u0E33\u0E02\u0E2D\u0E07\u0E41\u0E0A\u0E17\u0E19\u0E35\u0E49 \u2014 \u0E43\u0E0A\u0E49\u0E44\u0E1B\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 {used} \u0E08\u0E32\u0E01 {limit} \u0E42\u0E17\u0E40\u0E04\u0E19\n\u0E40\u0E01\u0E34\u0E19\u0E01\u0E27\u0E48\u0E32\u0E19\u0E35\u0E49 \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E40\u0E01\u0E48\u0E32\u0E2A\u0E38\u0E14\u0E08\u0E30\u0E16\u0E39\u0E01\u0E15\u0E31\u0E14\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48 AI \u0E08\u0E33\u0E44\u0E14\u0E49",
  contextTrimmed: "\u0E15\u0E2D\u0E19\u0E19\u0E35\u0E49\u0E15\u0E31\u0E14\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E40\u0E01\u0E48\u0E32\u0E1A\u0E32\u0E07\u0E2A\u0E48\u0E27\u0E19\u0E2D\u0E2D\u0E01\u0E44\u0E1B\u0E41\u0E25\u0E49\u0E27 \u2014 \u0E16\u0E49\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E2B\u0E21\u0E48\u0E43\u0E2B\u0E49\u0E01\u0E14 \u201C\u0E41\u0E0A\u0E17\u0E43\u0E2B\u0E21\u0E48\u201D"
};
var enLabels = {
  launcher: "AI assistant",
  title: "AI assistant",
  subtitle: "Ask about rosters, requests and settings",
  placeholder: "Ask about the roster \u2014 e.g. who is on the morning shift on the 6th\u2026",
  placeholderSchedule: 'Scheduling mode \u2014 type "generate the roster", or name a department/month\u2026',
  send: "Send",
  cancel: "Cancel",
  voiceStart: "Speak instead of typing",
  voiceStop: "Stop recording",
  voiceDiscard: "Discard this recording",
  voiceRecording: "Recording",
  voiceTranscribing: "Turning speech into text\u2026",
  voiceDenied: "Cannot open the microphone \u2014 allow microphone access in your browser first",
  voiceFailed: "Could not turn that into text. Record again, or just type it.",
  voiceSilent: "No speech was heard in that recording \u2014 try again.",
  voiceLimit: "Recordings stop at {seconds} seconds",
  newChat: "New chat",
  history: "Chat history",
  emptyTitle: "Ask away",
  emptyHint: "For example, \u201Cwho is still missing from night shifts this month?\u201D",
  connecting: "Connecting\u2026",
  disconnected: "Connection lost",
  reconnecting: "Reconnecting automatically\u2026",
  retry: "Try again",
  minimize: "Minimise the chat (the conversation is kept)",
  committed: "Saved",
  notCommitted: "Not saved yet",
  cardSuperseded: "Replaced by a newer item",
  cardWaiting: "Waiting for the current request to finish\u2026",
  thinking: "Thinking\u2026",
  scheduleMode: "Scheduling mode",
  assistantMode: "Assistant mode",
  linkOpenTitle: "How should this link open?",
  linkOpenHere: "Open here",
  linkOpenNewTab: "Open in a new tab",
  you: "You",
  assistant: "Assistant",
  historyTitle: "Conversation history",
  historySearch: "Search history",
  historyBack: "Back to the conversation",
  historyClose: "Close history",
  /* "Started today", not "Today" — grouped by `createdAt`, i.e. when the thread began. Coming back to
     yesterday's thread keeps it in "Earlier", so the heading has to say which date it means. */
  historyToday: "Started today",
  historyEarlier: "Earlier",
  historyNoMatch: "No conversation matches that search",
  historyCapped: "Showing the {count} most recent conversations \u2014 older ones are not searchable",
  historyUntitled: "(untitled)",
  timeJustNow: "just now",
  timeMinutesAgo: "{count} min ago",
  timeHoursAgo: "{count} hr ago",
  dateLocale: "en-GB",
  scheduleGreeting: [
    "**Scheduling mode is on.**",
    "{context}",
    "",
    "Tell me what to do next, for example:",
    '\u2022 **Generate the roster** \u2014 type *"generate the roster"* and I will fill the whole month',
    "\u2022 **Set things up first** \u2014 add staff \xB7 shift types \xB7 operating hours \xB7 scheduling rules",
    '\u2022 **Assign by hand** \u2014 e.g. *"put Somying on shift D on the 5th"*',
    "",
    'Type *"cancel"* to leave this mode at any time.'
  ].join("\n"),
  scheduleGreetingScoped: "Getting ready to schedule **{department}**{subUnit}{period}",
  scheduleGreetingSubUnit: " \xB7 **{subUnit}**",
  scheduleGreetingPeriod: " for {month}/{year}",
  scheduleGreetingUnscoped: 'Start by naming the department and month \u2014 e.g. *"ICU next month"*',
  contextTooltip: "This chat's memory \u2014 about {used} of {limit} tokens used\nPast that, the oldest messages drop out of what the AI remembers",
  contextTrimmed: "Some older messages have been dropped \u2014 press \u201CNew chat\u201D to start clean"
};
var labelsByLocale = {
  th: thLabels,
  en: enLabels
};
var defaultLabels = thLabels;
function resolveLabels(overrides, locale = "th") {
  const base = labelsByLocale[locale] ?? thLabels;
  return overrides ? { ...base, ...overrides } : base;
}
function buildScheduleGreeting(labels, seed) {
  const period = seed?.month ? labels.scheduleGreetingPeriod.replace("{month}", String(seed.month)).replace("{year}", String(seed.year ?? "")).trimEnd() : "";
  const subUnit = seed?.subUnitName ? labels.scheduleGreetingSubUnit.replace("{subUnit}", seed.subUnitName) : "";
  const context = seed?.departmentName ? labels.scheduleGreetingScoped.replace("{department}", seed.departmentName).replace("{subUnit}", subUnit).replace("{period}", period) : labels.scheduleGreetingUnscoped;
  return labels.scheduleGreeting.replace("{context}", context);
}

// src/ai-chat/lib/hostBridge.ts
var AI_CHAT_OPEN_EVENT = "mediact-ai-chat:open";
function openAiChat(detail = {}) {
  if (typeof window === "undefined") return false;
  const event = new CustomEvent(AI_CHAT_OPEN_EVENT, {
    detail,
    cancelable: true
  });
  window.dispatchEvent(event);
  return event.defaultPrevented;
}

// src/ai-chat/state/useAiChatSession.ts
import * as React11 from "react";

// src/ai-chat/lib/sentinels.ts
var ENTER_MODE = /\[\[ENTER_MODE:([^\]]+)\]\]/;
var REDIRECT = /\[\[REDIRECT:([^\]]+)\]\]/;
var EXIT_MODE = /\[\[EXIT_MODE\]\]/;
var ANY_SENTINEL = /\[\[(?:ENTER_MODE:[^\]]+|REDIRECT:[^\]]+|EXIT_MODE)\]\]/g;
function seedScope(seed) {
  const { subUnitName: _subUnitName, ...scope } = seed;
  return scope;
}
function extractEnterMode(text) {
  const match = ENTER_MODE.exec(text);
  if (!match?.[1]) return null;
  const seed = {};
  for (const part of match[1].split("|")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const key = part.slice(0, eq);
    const value = part.slice(eq + 1);
    if (key === "dept") seed.departmentId = Number(value);
    else if (key === "deptName") seed.departmentName = safeDecode(value);
    else if (key === "subUnit") seed.subUnitId = Number(value);
    else if (key === "subUnitName") seed.subUnitName = safeDecode(value);
    else if (key === "month") seed.month = Number(value);
    else if (key === "year") seed.year = Number(value);
  }
  return seed;
}
function hasExitMode(text) {
  return EXIT_MODE.test(text);
}
function extractRedirect(text) {
  return REDIRECT.exec(text)?.[1] ?? null;
}
function stripSentinels(text) {
  return text.replace(ANY_SENTINEL, "").trim();
}
function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// src/ai-chat/realtime/chatTransport.ts
import { Centrifuge, State } from "centrifuge";
var CONNECT_TIMEOUT_MS = 5e3;
var COMMAND_TIMEOUT_MS = 3e4;
var ChatSendTimeoutError = class extends Error {
  constructor() {
    super("\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E25\u0E49\u0E27 \u0E41\u0E15\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E15\u0E2D\u0E1A\u0E23\u0E31\u0E1A \u2014 \u0E01\u0E33\u0E25\u0E31\u0E07\u0E23\u0E2D\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E2D\u0E22\u0E39\u0E48\u0E04\u0E48\u0E30");
    this.name = "ChatSendTimeoutError";
  }
};
var CENTRIFUGE_TIMEOUT_CODE = 1;
var ChatTransport = class {
  constructor(config) {
    this.config = config;
  }
  config;
  client = null;
  subs = [];
  status = "idle";
  /** The token the current connection was opened with — what the service will forward downstream. */
  pinnedToken = null;
  /** Suppresses the transient "disconnected" blip while we deliberately re-pin the token. */
  repinning = false;
  get currentStatus() {
    return this.status;
  }
  async connect() {
    if (this.client) return;
    const token = await this.config.getToken();
    this.pinnedToken = token;
    const client = new Centrifuge(this.config.wsUrl, {
      data: { token },
      getData: async () => {
        const fresh = await this.config.getToken();
        this.pinnedToken = fresh;
        return { token: fresh };
      },
      timeout: COMMAND_TIMEOUT_MS,
      debug: this.config.debug ?? false
    });
    client.on("state", (ctx) => this.setStatus(mapState(ctx.newState)));
    client.on("error", (ctx) => this.config.onError?.(toError(ctx.error)));
    this.subs = ["chat", "task"].map((kind) => {
      const sub = client.newSubscription(this.config.channels[kind]);
      sub.on("publication", (ctx) => {
        const event = ctx.data;
        if (event && typeof event === "object" && "event" in event) {
          this.config.onEvent(event, kind);
        }
      });
      sub.on("error", (ctx) => {
        this.config.onError?.(
          new Error(`subscription ${this.config.channels[kind]}: ${toError(ctx.error).message}`)
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
  async ensureFreshConnection() {
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
  async send(params) {
    if (!this.client) throw new Error("ChatTransport.send called before connect()");
    await this.ensureFreshConnection();
    if (!await this.waitUntilConnected()) {
      this.client.disconnect();
      this.client.connect();
      if (!await this.waitUntilConnected()) {
        throw new Error("\u0E22\u0E31\u0E07\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E01\u0E31\u0E1A\u0E40\u0E0B\u0E34\u0E23\u0E4C\u0E1F\u0E40\u0E27\u0E2D\u0E23\u0E4C\u0E41\u0E1A\u0E1A\u0E40\u0E23\u0E35\u0E22\u0E25\u0E44\u0E17\u0E21\u0E4C\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 \u0E08\u0E36\u0E07\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48");
      }
    }
    try {
      const result = await this.client.rpc("chat.send", params);
      return result.data;
    } catch (error) {
      if (isTimeout(error)) throw new ChatSendTimeoutError();
      throw toError(error);
    }
  }
  /** Resolves true once connected, false on timeout. */
  waitUntilConnected(timeoutMs = CONNECT_TIMEOUT_MS) {
    if (this.status === "connected") return Promise.resolve(true);
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.status === "connected") finish(true);
      }, 100);
      const timeout = setTimeout(() => finish(false), timeoutMs);
      const finish = (ok) => {
        clearInterval(interval);
        clearTimeout(timeout);
        resolve(ok);
      };
    });
  }
  disconnect() {
    this.teardown();
    this.setStatus("disconnected");
  }
  teardown() {
    for (const sub of this.subs) {
      sub.unsubscribe();
      this.client?.removeSubscription(sub);
    }
    this.subs = [];
    this.client?.disconnect();
    this.client = null;
  }
  setStatus(status) {
    this.status = status;
    if (this.repinning && status !== "connected") return;
    this.config.onStatusChange?.(status);
  }
};
var CONNECTION_FAILURE = /timeout|connection|closed|unavailable|transport/i;
function isTimeout(error) {
  return typeof error === "object" && error !== null && "code" in error && error.code === CENTRIFUGE_TIMEOUT_CODE;
}
function toError(error) {
  if (error instanceof Error) return error;
  if (error && typeof error === "object" && "message" in error) {
    const { message, code } = error;
    if (CONNECTION_FAILURE.test(message)) {
      return new Error(
        "\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E02\u0E31\u0E14\u0E02\u0E49\u0E2D\u0E07\u0E0A\u0E31\u0E48\u0E27\u0E04\u0E23\u0E32\u0E27 \u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E43\u0E2B\u0E21\u0E48\u0E43\u0E2B\u0E49\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34 \u2014 \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E07\u0E44\u0E1B\u0E2D\u0E32\u0E08\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25\u0E2D\u0E22\u0E39\u0E48 \u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E30\u0E41\u0E2A\u0E14\u0E07\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E01\u0E25\u0E31\u0E1A\u0E21\u0E32\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E44\u0E14\u0E49"
      );
    }
    return new Error(code ? `${message} (code ${code})` : message);
  }
  return new Error(String(error));
}
function mapState(state) {
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

// src/ai-chat/state/useAiChatSession.ts
var MODE_ENTER_TEXT = "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E42\u0E2B\u0E21\u0E14\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23";
var MODE_EXIT_TEXT = "\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E42\u0E2B\u0E21\u0E14\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23";
var NO_ANSWER_TEXT = "(\u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E33\u0E15\u0E2D\u0E1A)";
var UNACKED_GRACE_MS = 15e4;
var UNACKED_EXPIRED_TEXT = "\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E32\u0E01\u0E23\u0E30\u0E1A\u0E1A\u0E04\u0E48\u0E30 \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E2D\u0E32\u0E08\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E16\u0E39\u0E01\u0E2A\u0E48\u0E07\u0E16\u0E36\u0E07 \u0E25\u0E2D\u0E07\u0E2A\u0E48\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E19\u0E30\u0E04\u0E30";
var initialState = {
  conversationId: null,
  messages: [],
  status: "idle",
  transportStatus: "idle",
  activeRunId: null,
  error: null,
  mode: "assistant",
  scheduleSeed: null,
  contextUsage: null
};
function reducer(state, action) {
  switch (action.type) {
    case "starting":
      return { ...state, status: "starting", error: null };
    case "started":
      return {
        ...state,
        conversationId: action.conversationId,
        messages: action.history,
        status: "ready",
        error: null,
        mode: action.mode,
        scheduleSeed: action.seed,
        // A replayed transcript carries no `done` events, so the meter has nothing to show until the
        // next turn answers. Better blank than a stale number from another conversation.
        contextUsage: null
      };
    case "transport": {
      if (action.status === "connected" && state.status === "error") {
        return { ...state, transportStatus: action.status, status: "ready", error: null };
      }
      return { ...state, transportStatus: action.status };
    }
    case "user_turn":
      return {
        ...state,
        messages: [...state.messages, action.message, action.placeholder],
        status: "sending",
        error: null
      };
    case "run_accepted":
      return { ...state, activeRunId: action.runId };
    case "event":
      return applyEvent(state, action.event);
    case "done":
      return applyDone(state, action);
    case "set_mode": {
      if (action.mode === state.mode) return state;
      const entering = action.mode === "schedule";
      const messages = [...state.messages];
      if (messages.length) messages.push(divider(entering ? MODE_ENTER_TEXT : MODE_EXIT_TEXT));
      if (entering) messages.push(assistantNote(action.greeting));
      return {
        ...state,
        mode: action.mode,
        // Re-entering scheduling by hand keeps whatever scope a previous hand-off resolved.
        scheduleSeed: entering ? action.seed ?? state.scheduleSeed : null,
        messages
      };
    }
    // The user is talking to this conversation from another tab. Both tabs are subscribed to
    // `chat:{conversationId}` and both receive every publication — but until now only the tab that called
    // `send` had a bubble to fold them into, so the other one dropped the whole turn on the floor and sat
    // there looking like an empty chat. Give the turn a bubble here and the existing fold logic just works.
    case "follow_start":
      return {
        ...state,
        // Anything still open belongs to a turn that is over as far as this screen can tell; leaving it
        // `streaming` would spin a placeholder forever. (Two turns genuinely overlapping means both tabs
        // hit send inside the same instant — rare, and this closes the first one honestly rather than
        // garbling the two answers into one bubble.)
        messages: [...closeOpenTurns(state.messages), remoteTurn()],
        status: "streaming",
        // Adopt the run so Cancel works from here too: it is the same person and the same conversation,
        // just a different window.
        activeRunId: action.turnId,
        error: null
      };
    // The question of a turn this tab did not type. It arrives before the answer's first token, so it lands
    // above the bubble `follow_start` is about to create, in the order a reader expects.
    case "remote_question":
      return {
        ...state,
        messages: [...state.messages, { id: nextId(), role: "user", content: action.content }]
      };
    case "error":
      return {
        ...state,
        status: "error",
        error: action.message,
        // Put the reason INSIDE the turn that failed. Closing the placeholder silently leaves an
        // empty bubble on screen, and a status banner alone gets overwritten by whatever event
        // arrives next — the user is then left with a blank reply and no explanation.
        messages: failStreamingTurn(state.messages, action.message),
        activeRunId: null
      };
    // The send RPC timed out. Unlike `error`, this says nothing about whether the turn is running,
    // so the placeholder stays STREAMING: the answer arrives as publications on a channel keyed by
    // conversation, not by run, and it lands with or without the runId the RPC never returned.
    // Closing the turn here is what threw real answers away — `applyDone` folds `done` into the
    // last streaming message, so with none left it dropped the reply and rendered nothing. The
    // note goes in `error` for the banner only; the composer stays locked (status "sending")
    // because a turn IS in flight. The caller arms a grace timer so this cannot hang forever —
    // if no publication arrives it dispatches a real `error`, which is the way out (S11-F2).
    case "send_unacked":
      return { ...state, error: action.message };
    case "reset":
      return { ...initialState };
  }
}
function applyEvent(state, event) {
  const index = lastStreamingIndex(state.messages);
  if (index < 0) return state;
  const messages = [...state.messages];
  const turn = messages[index];
  switch (event.event) {
    case "token":
      messages[index] = { ...turn, content: turn.content + event.payload.delta };
      return { ...state, messages, status: "streaming" };
    case "tool_call": {
      const tools = [...turn.tools ?? []];
      const open = tools.findIndex(
        (t) => t.label_th === event.payload.label_th && t.status === "start"
      );
      if (open >= 0 && event.payload.status !== "start") {
        tools[open] = { ...event.payload, startedAt: tools[open].startedAt };
      } else {
        tools.push({ ...event.payload, startedAt: Date.now() });
      }
      messages[index] = { ...turn, tools };
      return { ...state, messages, status: "streaming" };
    }
    case "widget":
      messages[index] = { ...turn, widgets: [...turn.widgets ?? [], event.payload] };
      return { ...state, messages, status: "streaming" };
    case "proposal":
      messages[index] = {
        ...turn,
        content: turn.content ? `${turn.content}

${event.payload.summary_th}` : event.payload.summary_th
      };
      return { ...state, messages, status: "streaming" };
    case "task_state":
      return state;
    // Forward compatibility, deliberately at the cost of exhaustiveness checking. These events come off a
    // wire from a service that deploys on its own schedule, so a name this build has never heard of is a
    // NORMAL event, not a bug — and falling off the end of this switch returned `undefined`, which the
    // reducer then made the whole session state. That is a white screen, not a dropped event.
    default:
      return state;
  }
}
function applyDone(state, action) {
  const index = lastStreamingIndex(state.messages);
  if (index < 0) return { ...state, status: "ready", activeRunId: null };
  const messages = [...state.messages];
  messages[index] = {
    ...messages[index],
    content: action.content || NO_ANSWER_TEXT,
    streaming: false,
    outcome: action.payload
  };
  const enteringSchedule = Boolean(action.seed) && state.mode !== "schedule";
  const leavingSchedule = action.exit && state.mode === "schedule";
  if (enteringSchedule) {
    messages.push(divider(MODE_ENTER_TEXT), assistantNote(action.greeting));
  }
  if (leavingSchedule) messages.push(divider(MODE_EXIT_TEXT));
  return {
    ...state,
    messages,
    status: "ready",
    activeRunId: null,
    mode: action.seed ? "schedule" : action.exit ? "assistant" : state.mode,
    scheduleSeed: action.seed ?? (action.exit ? null : state.scheduleSeed),
    contextUsage: action.payload.context ?? state.contextUsage
  };
}
function lastStreamingIndex(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]?.streaming) return i;
  }
  return -1;
}
var remoteTurn = () => ({
  id: nextId(),
  role: "assistant",
  content: "",
  streaming: true
});
function closeOpenTurns(messages) {
  return messages.map(
    (message) => message.streaming ? { ...message, streaming: false, content: message.content || NO_ANSWER_TEXT } : message
  );
}
function failStreamingTurn(messages, reason) {
  const index = lastStreamingIndex(messages);
  if (index < 0) return messages;
  const next = [...messages];
  const turn = next[index];
  next[index] = {
    ...turn,
    streaming: false,
    failed: true,
    // Keep whatever streamed in before the failure; append the reason rather than losing it.
    content: turn.content ? `${turn.content}

${reason}` : reason
  };
  return next;
}
var messageSeq = 0;
var nextId = () => `m${++messageSeq}-${Date.now().toString(36)}`;
var divider = (text) => ({ id: nextId(), role: "system", content: text });
var assistantNote = (text) => ({
  id: nextId(),
  role: "assistant",
  content: text
});
function useAiChatSession(config) {
  const [state, dispatch] = React11.useReducer(reducer, initialState);
  const configRef = React11.useRef(config);
  configRef.current = config;
  const api = React11.useMemo(
    () => createAiChatApi({
      baseUrl: config.baseUrl,
      getToken: () => configRef.current.getToken(),
      fetchImpl: config.fetchImpl
    }),
    [config.baseUrl, config.fetchImpl]
  );
  const labels = React11.useMemo(() => resolveLabels(config.labels), [config.labels]);
  const labelsRef = React11.useRef(labels);
  labelsRef.current = labels;
  const transportRef = React11.useRef(null);
  const startingRef = React11.useRef(null);
  const startRef = React11.useRef(null);
  const stateRef = React11.useRef(state);
  stateRef.current = state;
  const streamRef = React11.useRef("");
  const storageKey = `mediact-ai-chat:conversation:${config.baseUrl}`;
  const reportError = React11.useCallback((error, fallback) => {
    const err = error instanceof Error ? error : new Error(fallback);
    turnRef.current = null;
    configRef.current.onError?.(err);
    dispatch({ type: "error", message: err.message || fallback });
  }, []);
  const unackedTimerRef = React11.useRef(null);
  const clearUnackedGrace = React11.useCallback(() => {
    if (!unackedTimerRef.current) return;
    clearTimeout(unackedTimerRef.current);
    unackedTimerRef.current = null;
  }, []);
  const armUnackedGrace = React11.useCallback(() => {
    clearUnackedGrace();
    unackedTimerRef.current = setTimeout(() => {
      unackedTimerRef.current = null;
      turnRef.current = null;
      dispatch({ type: "error", message: UNACKED_EXPIRED_TEXT });
    }, UNACKED_GRACE_MS);
  }, [clearUnackedGrace]);
  React11.useEffect(() => clearUnackedGrace, [clearUnackedGrace]);
  const turnRef = React11.useRef(null);
  const adoptTurn = React11.useCallback(
    (turnId) => {
      const current = turnRef.current;
      if (current && (!turnId || current.id === null || current.id === turnId)) {
        if (current.id === null && turnId) current.id = turnId;
        return current.own;
      }
      turnRef.current = { id: turnId ?? null, own: false };
      dispatch({ type: "follow_start", turnId: turnId ?? null });
      return false;
    },
    []
  );
  const isOwnTurn = React11.useCallback((turnId) => {
    const current = turnRef.current;
    if (!current?.own) return false;
    return !turnId || current.id === null || current.id === turnId;
  }, []);
  const handleEvent = React11.useCallback(
    (event) => {
      if (event.event === "user_turn") {
        if (!isOwnTurn(event.turnId)) {
          dispatch({ type: "remote_question", content: event.payload.message });
        }
        return;
      }
      const own = adoptTurn(event.turnId);
      if (own) clearUnackedGrace();
      if (event.event !== "done") {
        if (event.event === "token") streamRef.current += event.payload.delta;
        dispatch({ type: "event", event });
        return;
      }
      const raw = streamRef.current;
      streamRef.current = "";
      turnRef.current = null;
      const redirect = extractRedirect(raw);
      if (own && redirect && typeof window !== "undefined") {
        window.open(redirect, "_blank", "noopener,noreferrer");
      }
      const seed = extractEnterMode(raw);
      dispatch({
        type: "done",
        payload: event.payload,
        content: stripSentinels(raw),
        seed,
        exit: hasExitMode(raw),
        greeting: buildScheduleGreeting(labelsRef.current, seed)
      });
    },
    [adoptTurn, isOwnTurn, clearUnackedGrace]
  );
  const start = React11.useCallback(
    async (conversationId) => {
      if (transportRef.current && !conversationId) return;
      if (startingRef.current) return startingRef.current;
      const run = (async () => {
        dispatch({ type: "starting" });
        try {
          transportRef.current?.disconnect();
          transportRef.current = null;
          turnRef.current = null;
          const remembered = conversationId ?? readStored(storageKey);
          let id;
          let transcript = [];
          if (remembered) {
            try {
              transcript = await api.getMessages(remembered);
              id = remembered;
            } catch {
              id = (await api.createConversation()).id;
            }
          } else {
            id = (await api.createConversation()).id;
          }
          writeStored(storageKey, id);
          const { messages, mode, seed } = replayTranscript(transcript);
          const info = await api.connectInfo(id);
          if (!info.wsUrl) {
            throw new Error(
              "ai-service \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32 transport (\u0E44\u0E21\u0E48\u0E21\u0E35 wsUrl) \u2014 \u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E14\u0E39\u0E41\u0E25\u0E23\u0E30\u0E1A\u0E1A"
            );
          }
          const transport = new ChatTransport({
            wsUrl: info.wsUrl,
            channels: info.channels,
            getToken: () => configRef.current.getToken(),
            debug: configRef.current.debug,
            onEvent: handleEvent,
            onStatusChange: (status) => {
              dispatch({ type: "transport", status });
              if (status === "connected" && stateRef.current.status === "error") {
                const current = stateRef.current.conversationId;
                if (current) void startRef.current?.(current);
              }
            },
            onError: (error) => configRef.current.onError?.(error)
          });
          await transport.connect();
          transportRef.current = transport;
          dispatch({ type: "started", conversationId: id, history: messages, mode, seed });
        } catch (error) {
          reportError(error, "\u0E40\u0E1B\u0E34\u0E14\u0E2B\u0E49\u0E2D\u0E07\u0E2A\u0E19\u0E17\u0E19\u0E32\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08");
        } finally {
          startingRef.current = null;
        }
      })();
      startingRef.current = run;
      return run;
    },
    [api, handleEvent, reportError, storageKey]
  );
  startRef.current = start;
  const send = React11.useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const transport = transportRef.current;
      const conversationId = state.conversationId;
      if (!transport || !conversationId) {
        reportError(new Error("\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E2B\u0E49\u0E2D\u0E07\u0E2A\u0E19\u0E17\u0E19\u0E32"), "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D");
        return;
      }
      if (stateRef.current.status === "sending" || stateRef.current.status === "streaming") return;
      streamRef.current = "";
      turnRef.current = { id: null, own: true };
      dispatch({
        type: "user_turn",
        message: { id: nextId(), role: "user", content: trimmed },
        placeholder: { id: nextId(), role: "assistant", content: "", streaming: true }
      });
      try {
        const { scope } = configRef.current;
        const ticket = await transport.send({
          conversationId,
          message: trimmed,
          mode: state.mode,
          ...scope,
          // A scheduling hand-off already resolved dept/ward/month — carry it so the agent doesn't re-ask.
          // Through `seedScope`, because the seed also holds the ward NAME, which is ours to display
          // and not a field the service takes.
          ...state.mode === "schedule" && state.scheduleSeed ? seedScope(state.scheduleSeed) : null
        });
        if (turnRef.current?.own) turnRef.current.id = ticket.runId;
        dispatch({ type: "run_accepted", runId: ticket.runId });
      } catch (error) {
        if (error instanceof ChatSendTimeoutError) {
          dispatch({ type: "send_unacked", message: error.message });
          armUnackedGrace();
          return;
        }
        reportError(error, "\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08");
      }
    },
    [state.conversationId, state.mode, state.scheduleSeed, reportError, armUnackedGrace]
  );
  const cancel = React11.useCallback(async () => {
    const runId = state.activeRunId;
    if (!runId) return;
    try {
      await api.cancelRun(runId);
    } catch (error) {
      configRef.current.onError?.(
        error instanceof Error ? error : new Error("\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08")
      );
    }
  }, [api, state.activeRunId]);
  const newConversation = React11.useCallback(() => {
    transportRef.current?.disconnect();
    transportRef.current = null;
    streamRef.current = "";
    turnRef.current = null;
    writeStored(storageKey, null);
    dispatch({ type: "reset" });
  }, [storageKey]);
  const setMode = React11.useCallback((mode, seed) => {
    const effectiveSeed = seed ?? stateRef.current.scheduleSeed;
    dispatch({
      type: "set_mode",
      mode,
      seed: seed ?? null,
      greeting: buildScheduleGreeting(labelsRef.current, effectiveSeed)
    });
  }, []);
  const listConversations = React11.useCallback(() => api.listConversations(), [api]);
  React11.useEffect(() => {
    return () => {
      transportRef.current?.disconnect();
      transportRef.current = null;
    };
  }, []);
  return {
    state,
    start,
    send,
    cancel,
    newConversation,
    setMode,
    listConversations,
    api
  };
}
function replayTranscript(transcript) {
  let seed = null;
  const messages = transcript.map((message) => {
    if (message.role === "assistant") {
      const entered = extractEnterMode(message.content);
      if (entered) seed = entered;
      if (hasExitMode(message.content)) seed = null;
    }
    return {
      id: nextId(),
      role: message.role,
      // Sentinels are directives, never text — and replay must not re-trigger them either.
      content: message.role === "assistant" ? stripSentinels(message.content) : message.content,
      // A pending change outlives the socket, so its confirm card has to as well: without this, reloading
      // mid-handshake left the reply's "กดยืนยันได้เลย" pointing at buttons that no longer existed. The
      // service only sends back a card that can still be answered, so anything here is safe to render.
      widgets: message.widget ? [message.widget] : void 0
    };
  });
  return { messages, mode: seed ? "schedule" : "assistant", seed };
}
function readStored(key) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key) || null;
  } catch {
    return null;
  }
}
function writeStored(key, value) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
  }
}

// src/ai-chat/AiChatWidget.tsx
import { Fragment as Fragment3, jsx as jsx12, jsxs as jsxs11 } from "react/jsx-runtime";
var SUGGESTIONS_BY_LOCALE = {
  th: [
    "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 6 \u0E43\u0E04\u0E23\u0E02\u0E36\u0E49\u0E19\u0E40\u0E27\u0E23\u0E40\u0E0A\u0E49\u0E32\u0E1A\u0E49\u0E32\u0E07",
    "\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E19\u0E35\u0E49\u0E21\u0E35\u0E40\u0E27\u0E23\u0E44\u0E2B\u0E19\u0E04\u0E19\u0E44\u0E21\u0E48\u0E1E\u0E2D",
    "\u0E15\u0E2D\u0E19\u0E19\u0E35\u0E49\u0E41\u0E1C\u0E19\u0E01\u0E40\u0E1B\u0E34\u0E14\u0E01\u0E0E\u0E2D\u0E30\u0E44\u0E23\u0E2D\u0E22\u0E39\u0E48\u0E1A\u0E49\u0E32\u0E07"
  ],
  en: [
    "Who is on the morning shift on the 6th?",
    "Which shifts are short-staffed this month?",
    "Which rules is this department running?"
  ]
};
function AiChatWidget({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  hideLauncher,
  className,
  ...config
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React12.useState(defaultOpen);
  const isControlled = controlledOpen !== void 0;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = React12.useCallback(
    (next) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );
  const getToken = React12.useMemo(
    () => resolveTokenProvider(config.auth, config.getToken, config.onError),
    [config.auth, config.getToken, config.onError]
  );
  const session = useAiChatSession(React12.useMemo(() => ({ ...config, getToken }), [config, getToken]));
  const locale = config.locale ?? "th";
  const labels = React12.useMemo(() => resolveLabels(config.labels, locale), [config.labels, locale]);
  const position = config.position ?? "bottom-right";
  const suggestions = config.suggestions ?? SUGGESTIONS_BY_LOCALE[locale] ?? SUGGESTIONS_BY_LOCALE.th;
  const { setMode } = session;
  React12.useEffect(() => {
    if (config.mode) setMode(config.mode);
  }, [config.mode, setMode]);
  const [sttMissing, setSttMissing] = React12.useState(false);
  const { api } = session;
  const transcribe = React12.useCallback(
    async (audio, signal) => {
      try {
        return await api.transcribe(audio, signal);
      } catch (cause) {
        if (cause instanceof AiChatApiError && (cause.status === 404 || cause.status === 501)) {
          setSttMissing(true);
        }
        throw cause;
      }
    },
    [api]
  );
  const voiceEnabled = (config.voiceInput ?? true) && !sttMissing;
  React12.useEffect(() => {
    if (open) void session.start();
  }, [open, session.start]);
  const [hostRequest, setHostRequest] = React12.useState(null);
  React12.useEffect(() => {
    const onOpen = (event) => {
      event.preventDefault();
      const detail = event.detail ?? {};
      if (detail.message?.trim()) setHostRequest(detail);
      setOpen(true);
    };
    window.addEventListener(AI_CHAT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(AI_CHAT_OPEN_EVENT, onOpen);
  }, [setOpen]);
  const { status: sessionStatus, mode: sessionMode } = session.state;
  const { setMode: sessionSetMode, send: sessionSend } = session;
  React12.useEffect(() => {
    if (!hostRequest?.message) return;
    if (sessionStatus === "error") {
      setHostRequest(null);
      return;
    }
    if (sessionStatus !== "ready") return;
    if (hostRequest.mode && sessionMode !== hostRequest.mode) {
      sessionSetMode(hostRequest.mode);
      return;
    }
    setHostRequest(null);
    void sessionSend(hostRequest.message);
  }, [hostRequest, sessionStatus, sessionMode, sessionSetMode, sessionSend]);
  const handleSend = React12.useCallback(
    (text) => {
      void session.send(text);
    },
    [session.send]
  );
  const handlePickConversation = React12.useCallback(
    (conversationId) => {
      void session.start(conversationId);
    },
    [session.start]
  );
  const handleNewChat = React12.useCallback(() => {
    session.newConversation();
    void session.start();
  }, [session.newConversation, session.start]);
  const handleRetry = React12.useCallback(() => {
    const current = session.state.conversationId;
    if (current) {
      void session.start(current);
      return;
    }
    session.newConversation();
    void session.start();
  }, [session.state.conversationId, session.newConversation, session.start]);
  return /* @__PURE__ */ jsxs11(Fragment3, { children: [
    !hideLauncher && /* @__PURE__ */ jsx12(
      FloatingButton,
      {
        open,
        onClick: () => setOpen(!open),
        label: open ? labels.minimize : labels.launcher,
        position,
        className
      }
    ),
    /* @__PURE__ */ jsx12(
      ChatDrawer,
      {
        open,
        onOpenChange: setOpen,
        messages: session.state.messages,
        status: session.state.status,
        transportStatus: session.state.transportStatus,
        error: session.state.error,
        activeConversationId: session.state.conversationId,
        labels,
        position,
        mode: session.state.mode,
        contextUsage: session.state.contextUsage,
        suggestions,
        onSend: handleSend,
        onCancel: () => void session.cancel(),
        onTranscribe: voiceEnabled ? transcribe : void 0,
        onVoiceError: config.onError,
        onNewChat: handleNewChat,
        onPickConversation: handlePickConversation,
        onRetry: handleRetry,
        loadConversations: session.listConversations
      }
    )
  ] });
}
export {
  AI_CHAT_OPEN_EVENT,
  AiChatApiError,
  AiChatWidget,
  ChatDrawer,
  ChatTransport,
  Composer,
  ContextMeter,
  ConversationPicker,
  FloatingButton,
  Markdown,
  MessageBubble,
  MessageList,
  SelfAuth,
  ToolTrail,
  WidgetRenderer,
  buildScheduleGreeting,
  cn,
  createAiChatApi,
  defaultLabels,
  enLabels,
  extractEnterMode,
  extractRedirect,
  hasExitMode,
  labelsByLocale,
  openAiChat,
  resolveLabels,
  resolveTokenProvider,
  seedScope,
  stripSentinels,
  thLabels,
  useAiChatSession,
  useVoiceInput
};
//# sourceMappingURL=index.js.map