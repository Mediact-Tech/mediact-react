import * as React from "react";
import type { AudioClip, AudioFormat, TranscriptionResult } from "../api/types";

/**
 * Microphone → text for the composer.
 *
 * The hook owns the whole recording lifecycle (permission, MediaRecorder, the duration cap, releasing the
 * mic) and hands the caller ONE string. It deliberately does not send anything: transcription of Thai
 * mangles domain words — measured on the real endpoint, "worktree" came back as "เวิร์กทรี" at 16 kHz WAV
 * and as "Web3" at 24 kbps opus — so the text must land in the textarea for the user to fix, never in a
 * turn. See `Composer` for the surface that enforces that.
 *
 * 🔴 `supported` is false on plain http (except localhost): `navigator.mediaDevices` is undefined outside a
 * secure context, with no error and no prompt. Rendering a mic button there gives a control that can only
 * fail, so the caller hides it instead.
 */

export type VoiceInputStatus = "idle" | "recording" | "transcribing";

/** Why the last attempt failed — the caller maps this onto its own copy, the hook holds no strings. */
export type VoiceInputErrorReason =
  /** The browser prompt was denied, or the OS has no microphone to grant. */
  | "denied"
  /** Recording worked; the service did not answer, or answered with nothing usable. */
  | "failed";

/** A non-error outcome the caller may want to mention — cleared when the next recording starts. */
export type VoiceInputNotice =
  /** The clip transcribed to nothing: silence, a muted input. The user did nothing wrong. */
  "silent";

export interface UseVoiceInputOptions {
  /** Usually `session.api.transcribe`. Omit to disable voice entirely (`supported` stays false). */
  transcribe?: (audio: AudioClip, signal?: AbortSignal) => Promise<TranscriptionResult>;
  /** Receives the transcript. Called once per successful recording, with non-empty text. */
  onText: (text: string) => void;
  /** Mirrors failures to the host for logging — the UI shows its own message regardless. */
  onError?: (error: Error) => void;
  /**
   * Hard stop, in seconds. Default AND ceiling 120 (2 minutes) — a larger value is clamped down, not
   * honoured.
   *
   * Not a UX preference, a size budget: ai-service runs on Fastify with `bodyLimit: 1 MB` and the clip
   * travels as base64 (+33%), so at the 32 kbps below, 120 s ≈ 640 KB encoded. A host that passes 300
   * would get a recording the service refuses AFTER the user has finished speaking — the one moment
   * where failing is most expensive. The clamp is here rather than in the component because every
   * caller of the hook needs it, and a rule that lives in one caller is a rule that gets forgotten.
   */
  maxSeconds?: number;
}

export interface VoiceInput {
  status: VoiceInputStatus;
  /** Elapsed seconds of the current recording — 0 when not recording. */
  seconds: number;
  /** The cap actually in force, after clamping. Show THIS, never the requested `maxSeconds`. */
  limitSeconds: number;
  /** Reason of the most recent failure, cleared when a new recording starts. */
  error: VoiceInputErrorReason | null;
  /** A non-error outcome of the last recording (nothing was said). Never both this and `error`. */
  notice: VoiceInputNotice | null;
  /** False when the browser cannot record here, or no `transcribe` was given. Hide the control. */
  supported: boolean;
  /**
   * The microphone stream while `status === "recording"`, `null` otherwise. Exposed so the composer can
   * draw a level meter off it (a second, read-only tap) — the recorder still owns it, and the hook still
   * releases it. Never keep a reference past `status` changing.
   */
  stream: MediaStream | null;
  /** Begins recording (asks for permission the first time). No-op unless idle. */
  start: () => void;
  /** Ends recording and transcribes what was captured. */
  stop: () => void;
  /** Ends recording and throws the audio away — nothing is uploaded. */
  discard: () => void;
}

/**
 * 32 kbps, not the browser default.
 *
 * Measured against the real transcription endpoint on the same Thai sentence: 24 kbps opus turned
 * "worktree" into "Web3", 32 kbps did not. Above ~48 kbps the accuracy stops improving and only the
 * upload grows.
 */
const AUDIO_BITS_PER_SECOND = 32_000;

/** Opus in WebM everywhere it exists; Safari only offers MP4. Ordered by what the service handles best. */
const CANDIDATE_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/wav"] as const;

/** 2 นาที — เพดานแข็ง ไม่ใช่ค่าเริ่มต้นที่ host เลื่อนขึ้นได้ (ดู `maxSeconds`) */
const MAX_SECONDS_CEILING = 120;

export function useVoiceInput({
  transcribe,
  onText,
  onError,
  maxSeconds = MAX_SECONDS_CEILING,
}: UseVoiceInputOptions): VoiceInput {
  const capSeconds = Math.min(Math.max(1, Math.floor(maxSeconds)), MAX_SECONDS_CEILING);
  const [status, setStatus] = React.useState<VoiceInputStatus>("idle");
  const [seconds, setSeconds] = React.useState(0);
  const [error, setError] = React.useState<VoiceInputErrorReason | null>(null);
  const [notice, setNotice] = React.useState<VoiceInputNotice | null>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);

  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const discardRef = React.useRef(false);
  const abortRef = React.useRef<AbortController | null>(null);
  const tickRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Callbacks are read through refs so a re-rendered parent never leaves the recorder holding a stale
  // `onText` — the recording outlives many renders.
  const callbacksRef = React.useRef({ transcribe, onText, onError });
  callbacksRef.current = { transcribe, onText, onError };

  const supported = React.useMemo(
    () =>
      Boolean(transcribe) &&
      typeof window !== "undefined" &&
      typeof MediaRecorder !== "undefined" &&
      Boolean(navigator.mediaDevices?.getUserMedia),
    [transcribe],
  );

  const stopTicking = React.useCallback(() => {
    if (tickRef.current !== null) clearInterval(tickRef.current);
    tickRef.current = null;
  }, []);

  /** Stops the tracks as well as the recorder — leaving them open keeps the browser's mic indicator lit. */
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
    [teardown],
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
    // Under ~1 KB the user tapped rather than spoke. Uploading it costs money and returns noise.
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
        controller.signal,
      );
      const text = result?.text?.trim();
      if (!text) {
        // Silence is an outcome, not a failure: the service answered, there was just nothing in the clip.
        // Shown as plain information — red here told a user who had not spoken that something broke.
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

  const stopRecorder = React.useCallback((discard: boolean) => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    discardRef.current = discard;
    recorder.stop();
  }, []);

  const start = React.useCallback(() => {
    if (!supported || status !== "idle") return;
    setError(null);
    setNotice(null);
    void (async () => {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
        });
      } catch (cause) {
        setError("denied");
        callbacksRef.current.onError?.(cause instanceof Error ? cause : new Error(String(cause)));
        return;
      }

      const mimeType = CANDIDATE_TYPES.find((type) => MediaRecorder.isTypeSupported?.(type));
      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, {
          audioBitsPerSecond: AUDIO_BITS_PER_SECOND,
          ...(mimeType ? { mimeType } : {}),
        });
      } catch (cause) {
        stream.getTracks().forEach((track) => track.stop());
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
      // A timeslice means a crash or an abrupt unmount still leaves whole chunks behind, instead of one
      // buffer the recorder never got to flush.
      recorder.start(1000);
      setStatus("recording");
      setStream(stream);
      setSeconds(0);

      tickRef.current = setInterval(() => {
        setSeconds((current) => {
          const next = current + 1;
          if (next >= capSeconds) stopRecorder(false);
          return next;
        });
      }, 1000);
    })();
  }, [capSeconds, finish, status, stopRecorder, supported]);

  const stop = React.useCallback(() => stopRecorder(false), [stopRecorder]);
  const discard = React.useCallback(() => stopRecorder(true), [stopRecorder]);

  return { status, seconds, limitSeconds: capSeconds, error, notice, supported, stream, start, stop, discard };
}

/** `audio/webm;codecs=opus` → `webm`. Anything unrecognised is sent as webm, the majority container. */
function formatOf(mimeType: string): AudioFormat {
  const subtype = mimeType.split(";")[0]?.split("/")[1]?.toLowerCase() ?? "";
  if (subtype === "mp4" || subtype === "m4a" || subtype === "x-m4a") return "mp4";
  if (subtype === "wav" || subtype === "wave" || subtype === "x-wav") return "wav";
  return "webm";
}

/**
 * Blob → base64 in 32 KB slices.
 *
 * `String.fromCharCode(...bytes)` on a whole minute of audio blows the argument limit and throws
 * `RangeError: Maximum call stack size exceeded` — on a long recording only, which is exactly the one
 * nobody tries by hand.
 */
async function toBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}
