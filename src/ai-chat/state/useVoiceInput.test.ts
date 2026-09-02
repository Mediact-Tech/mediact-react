import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useVoiceInput } from "./useVoiceInput";
import type { AudioClip } from "../api/types";

/**
 * happy-dom ships no `MediaRecorder` and no `getUserMedia`, so the whole recording path is stubbed here.
 * That is the point of the test: the hook's contract is what it does with the recorder's callbacks
 * (`ondataavailable`, `onstop`) and with the microphone stream — none of which a browser test could
 * assert without a real microphone.
 */

class FakeMediaRecorder {
  static supported: string[] = ["audio/webm;codecs=opus", "audio/webm"];
  static last: FakeMediaRecorder | null = null;
  static isTypeSupported = (type: string) => FakeMediaRecorder.supported.includes(type);

  state: "inactive" | "recording" = "inactive";
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  readonly mimeType: string;

  constructor(
    readonly stream: MediaStream,
    options?: { mimeType?: string },
  ) {
    this.mimeType = options?.mimeType ?? "audio/webm";
    FakeMediaRecorder.last = this;
  }

  start() {
    this.state = "recording";
  }

  /** Emits one chunk then stops, the order a real recorder uses when `stop()` flushes its buffer. */
  stop() {
    this.state = "inactive";
    this.ondataavailable?.({ data: new Blob([new Uint8Array(4096)], { type: this.mimeType }) });
    this.onstop?.();
  }
}

const tracks = { stop: vi.fn() };
const fakeStream = { getTracks: () => [tracks] } as unknown as MediaStream;
const getUserMedia = vi.fn(async () => fakeStream);

beforeEach(() => {
  vi.stubGlobal("MediaRecorder", FakeMediaRecorder);
  vi.stubGlobal("navigator", { ...globalThis.navigator, mediaDevices: { getUserMedia } });
  FakeMediaRecorder.supported = ["audio/webm;codecs=opus", "audio/webm"];
  FakeMediaRecorder.last = null;
  getUserMedia.mockClear();
  tracks.stop.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const transcribeOk = (text = "วันที่ 6 ใครเวรเช้า") =>
  vi.fn(async (_audio: AudioClip) => ({ text, seconds: 3 }));

describe("useVoiceInput — เสียงเข้า ข้อความออก", () => {
  it("ปิดตัวเองเมื่อไม่มีขาถอดเสียง — ปุ่มที่กดแล้วล้มแน่นอนไม่ควรมี", () => {
    const { result } = renderHook(() => useVoiceInput({ onText: vi.fn() }));
    expect(result.current.supported).toBe(false);
  });

  it("ปิดตัวเองเมื่อเบราว์เซอร์อัดไม่ได้ (http ธรรมดา = ไม่มี mediaDevices)", () => {
    vi.stubGlobal("navigator", { ...globalThis.navigator, mediaDevices: undefined });
    const { result } = renderHook(() =>
      useVoiceInput({ transcribe: transcribeOk(), onText: vi.fn() }),
    );
    expect(result.current.supported).toBe(false);
  });

  it("อัด → หยุด → ส่งถอดเสียง → คืนข้อความให้ผู้เรียก", async () => {
    const transcribe = transcribeOk("ขอตารางเวรเดือนหน้า");
    const onText = vi.fn();
    const { result } = renderHook(() => useVoiceInput({ transcribe, onText }));

    await act(async () => result.current.start());
    expect(result.current.status).toBe("recording");

    await act(async () => result.current.stop());
    await waitFor(() => expect(onText).toHaveBeenCalledWith("ขอตารางเวรเดือนหน้า"));

    const [clip] = transcribe.mock.calls[0]!;
    expect(clip.format).toBe("webm");
    expect(clip.data.length).toBeGreaterThan(0);
    expect(clip.data.startsWith("data:")).toBe(false); // base64 ล้วน ไม่ใช่ data URL
    expect(result.current.status).toBe("idle");
  });

  it("คืนไมโครโฟนทุกครั้งที่จบ — ไม่งั้นไฟไมค์ค้างทั้งแท็บ", async () => {
    const { result } = renderHook(() =>
      useVoiceInput({ transcribe: transcribeOk(), onText: vi.fn() }),
    );
    await act(async () => result.current.start());
    await act(async () => result.current.stop());
    await waitFor(() => expect(tracks.stop).toHaveBeenCalled());
  });

  it("กดทิ้ง = ไม่อัปโหลดอะไรเลย", async () => {
    const transcribe = transcribeOk();
    const onText = vi.fn();
    const { result } = renderHook(() => useVoiceInput({ transcribe, onText }));

    await act(async () => result.current.start());
    await act(async () => result.current.discard());

    await waitFor(() => expect(result.current.status).toBe("idle"));
    expect(transcribe).not.toHaveBeenCalled();
    expect(onText).not.toHaveBeenCalled();
  });

  it("ไม่ได้สิทธิ์ไมค์ → error 'denied' และไม่มีการอัด", async () => {
    getUserMedia.mockRejectedValueOnce(new Error("NotAllowedError"));
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useVoiceInput({ transcribe: transcribeOk(), onText: vi.fn(), onError }),
    );

    await act(async () => result.current.start());
    await waitFor(() => expect(result.current.error).toBe("denied"));
    expect(result.current.status).toBe("idle");
    expect(onError).toHaveBeenCalled();
  });

  it("ถอดเสียงล้ม → error 'failed' ไม่ใช่ข้อความว่างเงียบ ๆ", async () => {
    const transcribe = vi.fn(async () => {
      throw new Error("ai-service POST /v2/ai/stt → 500");
    });
    const onText = vi.fn();
    const { result } = renderHook(() => useVoiceInput({ transcribe, onText }));

    await act(async () => result.current.start());
    await act(async () => result.current.stop());

    await waitFor(() => expect(result.current.error).toBe("failed"));
    expect(onText).not.toHaveBeenCalled();
  });

  /* 🔴 ด่านที่ทำให้ `maxSeconds` เป็นงบขนาดจริง ไม่ใช่ตัวเลขประดับ — bodyLimit ของ ai-service คือ 1 MB
     และ base64 บวม 33% ⇒ ถ้าตัวจับเวลาไม่หยุดให้ ผู้ใช้จะพูดจนจบแล้วเพิ่งรู้ว่าคำขอถูกปฏิเสธ */
  it("ถึงเพดานเวลาแล้วหยุดอัดให้เอง", async () => {
    vi.useFakeTimers();
    const transcribe = transcribeOk();
    const { result } = renderHook(() =>
      useVoiceInput({ transcribe, onText: vi.fn(), maxSeconds: 3 }),
    );

    await act(async () => {
      result.current.start();
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.status).toBe("recording");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    expect(FakeMediaRecorder.last?.state).toBe("inactive");
    expect(transcribe).toHaveBeenCalled();
  });

  /* 🔴 เพดาน 2 นาทีเป็นงบขนาด ไม่ใช่ค่าที่ host เลื่อนได้ — ปล่อยให้ตั้ง 300 = ผู้ใช้พูดจนจบ
     แล้วคำขอถูก `bodyLimit: 1 MB` ปฏิเสธ ซึ่งเป็นจังหวะที่ล้มแล้วแพงที่สุด */
  it("host ตั้งเกิน 2 นาที ถูกบีบลงมาที่ 120 วินาที", async () => {
    const { result } = renderHook(() =>
      useVoiceInput({ transcribe: transcribeOk(), onText: vi.fn(), maxSeconds: 300 }),
    );
    expect(result.current.limitSeconds).toBe(120);
  });

  it("ค่าเริ่มต้นคือ 2 นาที", () => {
    const { result } = renderHook(() =>
      useVoiceInput({ transcribe: transcribeOk(), onText: vi.fn() }),
    );
    expect(result.current.limitSeconds).toBe(120);
  });

  it("Safari ที่มีแต่ mp4 → ส่ง format 'mp4' ไม่ใช่ webm ตายตัว", async () => {
    FakeMediaRecorder.supported = ["audio/mp4"];
    const transcribe = transcribeOk();
    const { result } = renderHook(() => useVoiceInput({ transcribe, onText: vi.fn() }));

    await act(async () => result.current.start());
    await act(async () => result.current.stop());

    await waitFor(() => expect(transcribe).toHaveBeenCalled());
    expect(transcribe.mock.calls[0]![0].format).toBe("mp4");
  });
});
