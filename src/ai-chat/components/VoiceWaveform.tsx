import * as React from "react";
import { cn } from "../lib/cn";

export interface VoiceWaveformProps {
  /** The microphone stream being recorded. `null` draws nothing (the strip keeps its height). */
  stream: MediaStream | null;
  className?: string;
}

/**
 * The live "you are being heard" strip for the composer: a scrolling row of bars, one per ~60 ms of
 * microphone input, tall when the user speaks and flat when the room is quiet.
 *
 * It replaced a line of text ("กำลังอัดเสียง · 0:03") for a reason that is not fashion: a timer proves
 * the clock is running, a waveform proves the MICROPHONE is — a muted headset, the wrong input device,
 * or a browser that granted permission to a mic with no signal all show a happily counting timer and a
 * dead-flat strip. The user sees the difference before wasting a whole recording on it.
 *
 * Drawn on a canvas, not with N `<div>`s: the strip repaints every animation frame while recording, and
 * re-rendering forty elements at 60 fps through React is the kind of cost that shows up as a stuttering
 * caret in the textarea next to it. The analyser is a second, read-only tap on the same `MediaStream`
 * the recorder consumes — it never touches what gets uploaded.
 *
 * Colour comes from `currentColor` (a token class on the element), so the lint that bans hex in
 * components still holds and the strip follows the theme like everything else. No `AudioContext`
 * (very old WebViews, and the test DOM) degrades to a static placeholder instead of a broken control.
 */
export function VoiceWaveform({ stream, className }: VoiceWaveformProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [state, setState] = React.useState<"idle" | "live" | "unsupported">("idle");

  React.useEffect(() => {
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

    let context: AudioContext;
    let source: MediaStreamAudioSourceNode;
    let analyser: AnalyserNode;
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
    // A context created outside a user gesture starts suspended in some browsers; recording starts from
    // a click so this normally resolves at once, and a rejection only means the strip stays flat.
    void context.resume?.().catch(() => undefined);
    setState("live");

    const samples = new Uint8Array(analyser.fftSize);
    const levels: number[] = [];
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    // Reduced motion keeps the meter (it is information, not decoration) but slows the scroll to a crawl.
    const sampleEveryMs = reduceMotion ? 250 : SAMPLE_EVERY_MS;
    let lastSampleAt = 0;
    let frame = 0;
    let disposed = false;

    const tick = (now: number) => {
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
      void context.close().catch(() => undefined);
    };
  }, [stream]);

  return (
    <span
      data-slot="ai-chat-voice-waveform"
      data-state={state}
      className={cn("relative flex h-7 min-w-0 items-center", className)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn("h-full w-full text-brand-active", state !== "live" && "invisible")}
      />
      {state === "unsupported" && (
        /* Nothing to measure here — three quiet dots keep the strip's shape so the row does not collapse. */
        <span aria-hidden className="absolute inset-0 flex items-center justify-center gap-1">
          <span className="size-1 rounded-full bg-text-body" />
          <span className="size-1 rounded-full bg-text-body" />
          <span className="size-1 rounded-full bg-text-body" />
        </span>
      )}
    </span>
  );
}

/** Window the analyser reads per sample — 512 frames ≈ 11 ms at 48 kHz, enough for an RMS. */
const FFT_SIZE = 512;
/** A new bar every ~60 ms: fast enough to follow a syllable, slow enough that the strip reads as a wave. */
const SAMPLE_EVERY_MS = 60;
/** Ring-buffer ceiling; what is DRAWN is however many bars fit the width. */
const MAX_BARS = 160;
const BAR_WIDTH = 3;
const BAR_GAP = 2;
/** A silent bar is still a bar — the strip must never look empty while the mic is open. */
const MIN_BAR_HEIGHT = 2;

function resolveAudioContext(): typeof AudioContext | undefined {
  if (typeof window === "undefined") return undefined;
  const global = globalThis as typeof globalThis & { webkitAudioContext?: typeof AudioContext };
  return global.AudioContext ?? global.webkitAudioContext;
}

/**
 * Loudness of one window as 0..1. RMS of the centred samples, then lifted: normal speech into a laptop
 * mic sits around 0.05–0.25 RMS, which would draw as a barely-moving strip if used raw.
 */
function levelOf(samples: Uint8Array): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    const centred = ((samples[i] ?? 128) - 128) / 128;
    sum += centred * centred;
  }
  const rms = Math.sqrt(sum / samples.length);
  return Math.min(1, Math.pow(rms * 3.2, 0.8));
}

function paint(canvas: HTMLCanvasElement, levels: number[]): void {
  let context: CanvasRenderingContext2D | null;
  try {
    context = canvas.getContext("2d");
  } catch {
    return; // a DOM without canvas (tests, some WebViews) — the strip stays blank rather than throwing
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
  // Right-aligned: the newest bar sits at the right edge and the strip grows leftwards, the way every
  // voice-memo UI the user already knows does it.
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
