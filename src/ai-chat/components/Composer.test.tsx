import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Composer, type ComposerProps } from "./Composer";
import { defaultLabels } from "../labels";

/**
 * The rule this file exists to hold: **speech lands in the textarea, never in a turn.**
 *
 * Thai transcription reliably mangles domain words — measured against the real endpoint, "worktree" came
 * back as "เวิร์กทรี". Auto-sending would put a mis-heard instruction in front of the assistant with
 * nobody having read it, and the user would be arguing with an answer to a question they never asked.
 */

class FakeMediaRecorder {
  static isTypeSupported = () => true;
  state: "inactive" | "recording" = "inactive";
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  readonly mimeType = "audio/webm";
  constructor(readonly stream: MediaStream) {}
  start() {
    this.state = "recording";
  }
  stop() {
    this.state = "inactive";
    this.ondataavailable?.({ data: new Blob([new Uint8Array(4096)]) });
    this.onstop?.();
  }
}

const stream = { getTracks: () => [{ stop: vi.fn() }] } as unknown as MediaStream;

beforeEach(() => {
  vi.stubGlobal("MediaRecorder", FakeMediaRecorder);
  vi.stubGlobal("navigator", {
    ...globalThis.navigator,
    mediaDevices: { getUserMedia: vi.fn(async () => stream) },
  });
});

afterEach(() => vi.unstubAllGlobals());

const props = (over: Partial<ComposerProps> = {}): ComposerProps => ({
  onSend: vi.fn(),
  onCancel: vi.fn(),
  busy: false,
  labels: defaultLabels,
  ...over,
});

const micButton = () => screen.getByRole("button", { name: defaultLabels.voiceStart });

describe("Composer — ปุ่มไมโครโฟน", () => {
  it("ไม่มีปุ่มไมค์เลยเมื่อ host ไม่ได้ส่งขาถอดเสียงมา", () => {
    render(<Composer {...props()} />);
    expect(screen.queryByRole("button", { name: defaultLabels.voiceStart })).toBeNull();
  });

  it("มีปุ่มไมค์เมื่อมีขาถอดเสียง", () => {
    render(<Composer {...props({ onTranscribe: vi.fn() })} />);
    expect(micButton()).toBeTruthy();
  });

  it("กำลังอัด → ขึ้นสถานะ + ปุ่มหยุด + ปุ่มทิ้ง", async () => {
    render(<Composer {...props({ onTranscribe: vi.fn() })} />);
    await act(async () => micButton().click());

    expect(screen.getByRole("button", { name: defaultLabels.voiceStop })).toBeTruthy();
    expect(screen.getByRole("button", { name: defaultLabels.voiceDiscard })).toBeTruthy();
    expect(screen.getByText(new RegExp(defaultLabels.voiceRecording))).toBeTruthy();
  });

  it("🔴 ข้อความที่ถอดได้ลงช่องพิมพ์ — ไม่ถูกส่งเป็นเทิร์นเอง", async () => {
    const onSend = vi.fn();
    const onTranscribe = vi.fn(async () => ({ text: "วันที่ 6 ใครเวรเช้า" }));
    render(<Composer {...props({ onSend, onTranscribe })} />);

    await act(async () => micButton().click());
    await act(async () => screen.getByRole("button", { name: defaultLabels.voiceStop }).click());

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    await waitFor(() => expect(textarea.value).toBe("วันที่ 6 ใครเวรเช้า"));
    expect(onSend).not.toHaveBeenCalled();
  });

  it("ถอดเสียงล้ม → บอกทางออกเป็นการพิมพ์ ไม่ปล่อยเงียบ", async () => {
    const onTranscribe = vi.fn(async () => {
      throw new Error("500");
    });
    render(<Composer {...props({ onTranscribe })} />);

    await act(async () => micButton().click());
    await act(async () => screen.getByRole("button", { name: defaultLabels.voiceStop }).click());

    await waitFor(() => expect(screen.getByText(defaultLabels.voiceFailed)).toBeTruthy());
  });
});
