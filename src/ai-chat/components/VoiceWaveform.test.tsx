import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { VoiceWaveform } from "./VoiceWaveform";

/**
 * The strip is a second, read-only tap on the recorder's stream. What matters here is the lifecycle —
 * it opens an analyser when a stream arrives, and closes it (and the AudioContext) the moment the stream
 * goes away — and that a DOM without Web Audio degrades to a placeholder instead of a crash.
 */
const analyser = {
  fftSize: 2048,
  smoothingTimeConstant: 0.8,
  getByteTimeDomainData: vi.fn((samples: Uint8Array) => samples.fill(128)),
};
const source = { connect: vi.fn(), disconnect: vi.fn() };

class FakeAudioContext {
  static instances: FakeAudioContext[] = [];
  resume = vi.fn(async () => undefined);
  close = vi.fn(async () => undefined);
  createAnalyser = vi.fn(() => analyser);
  createMediaStreamSource = vi.fn(() => source);
  constructor() {
    FakeAudioContext.instances.push(this);
  }
}

const stream = { getTracks: () => [] } as unknown as MediaStream;

beforeEach(() => {
  FakeAudioContext.instances = [];
  source.connect.mockClear();
  source.disconnect.mockClear();
  vi.stubGlobal("AudioContext", FakeAudioContext);
  // Never let the paint loop run in the test DOM — one frame is scheduled, none executes.
  vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => vi.unstubAllGlobals());

const strip = () => document.querySelector('[data-slot="ai-chat-voice-waveform"]');

describe("VoiceWaveform", () => {
  it("taps the stream through an analyser while recording, and releases both on unmount", () => {
    const { unmount } = render(<VoiceWaveform stream={stream} />);

    expect(strip()?.getAttribute("data-state")).toBe("live");
    const context = FakeAudioContext.instances[0]!;
    expect(context.createMediaStreamSource).toHaveBeenCalledWith(stream);
    expect(source.connect).toHaveBeenCalledWith(analyser);

    unmount();
    expect(source.disconnect).toHaveBeenCalled();
    expect(context.close).toHaveBeenCalled();
  });

  it("closes the context when the stream goes away, not only on unmount", () => {
    const { rerender } = render(<VoiceWaveform stream={stream} />);
    const context = FakeAudioContext.instances[0]!;

    rerender(<VoiceWaveform stream={null} />);

    expect(context.close).toHaveBeenCalled();
    expect(strip()?.getAttribute("data-state")).toBe("idle");
  });

  it("degrades to a static placeholder where Web Audio does not exist — never a thrown render", () => {
    vi.stubGlobal("AudioContext", undefined);

    render(<VoiceWaveform stream={stream} />);

    expect(strip()?.getAttribute("data-state")).toBe("unsupported");
    expect(strip()?.querySelectorAll(".size-1")).toHaveLength(3);
  });

  it("draws nothing without a stream, keeping the strip's height so the row does not jump", () => {
    render(<VoiceWaveform stream={null} />);
    expect(strip()?.getAttribute("data-state")).toBe("idle");
    expect(FakeAudioContext.instances).toHaveLength(0);
  });
});
