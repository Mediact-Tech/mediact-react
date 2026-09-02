import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Composer } from "./Composer";
import { defaultLabels } from "../labels";
import type { AudioClip } from "../api/types";

/**
 * The chat composer, including voice input.
 *
 * 🔴 Storybook is the only place the microphone states can be SEEN — a unit test in happy-dom proves the
 * structure and can prove nothing about layout, and the real widget needs a live ai-service plus a
 * Keycloak session. The stub below stands in for `session.api.transcribe`.
 */
const meta = {
  title: "AI Chat/Composer",
  component: Composer,
  parameters: { layout: "padded" },
  args: {
    onSend: () => {},
    onCancel: () => {},
    busy: false,
    labels: defaultLabels,
  },
} satisfies Meta<typeof Composer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Answers after a beat, like the real endpoint (~2-3 s for a short clip). */
const stubTranscribe = async (_audio: AudioClip) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { text: "วันที่ 6 ใครขึ้นเวรเช้าบ้าง", seconds: 8 };
};

export const Default: Story = {};

/** With voice: a mic sits between the box and send. Click it to walk recording → transcribing → text. */
export const WithVoice: Story = {
  args: { onTranscribe: stubTranscribe },
};

/** The transcript lands in the box and waits — the rule the whole feature is built around. */
export const VoiceFails: Story = {
  args: {
    onTranscribe: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      throw new Error("ai-service POST /v2/ai/stt → 500");
    },
  },
};

/** A turn is in flight: send becomes stop, and the mic stays available for the next question. */
export const Busy: Story = {
  args: { busy: true, onTranscribe: stubTranscribe },
};

/**
 * Side by side, so the row height cannot drift between the two states — the composer with a mic must
 * occupy exactly the same band as the one without, or every screen that toggles `voiceInput` jumps.
 */
export const HeightParity: Story = {
  render: (args: React.ComponentProps<typeof Composer>) => (
    <div className="flex flex-col gap-6">
      <div data-probe="without">
        <Composer {...args} onTranscribe={undefined} />
      </div>
      <div data-probe="with">
        <Composer {...args} onTranscribe={stubTranscribe} />
      </div>
    </div>
  ),
};
