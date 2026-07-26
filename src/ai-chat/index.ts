// The one thing most apps need
export { AiChatWidget, type AiChatWidgetProps } from "./AiChatWidget";

// Config + UI model
export type {
  AiChatAuthConfig,
  AiChatConfig,
  AiChatLabels,
  ChatMessage,
  SessionStatus,
  ToolCallEntry,
} from "./types";
export { defaultLabels, resolveLabels, buildScheduleGreeting } from "./labels";

// Building blocks — for a host that wants its own shell around the chat surface
export { ChatDrawer, type ChatDrawerProps } from "./components/ChatDrawer";
export { FloatingButton, type FloatingButtonProps } from "./components/FloatingButton";
export { MessageList, type MessageListProps } from "./components/MessageList";
export { MessageBubble, type MessageBubbleProps } from "./components/MessageBubble";
export { Composer, type ComposerProps } from "./components/Composer";
export { ConversationPicker, type ConversationPickerProps } from "./components/ConversationPicker";
export { WidgetRenderer, type WidgetRendererProps } from "./components/WidgetRenderer";
export { ToolTrail } from "./components/ToolTrail";
export { ContextMeter, type ContextMeterProps } from "./components/ContextMeter";
export { Markdown } from "./components/Markdown";

// FE directives the agent embeds in a reply (`[[ENTER_MODE:…]]` …)
export {
  extractEnterMode,
  extractRedirect,
  hasExitMode,
  stripSentinels,
  type ScheduleSeed,
} from "./lib/sentinels";

// Session engine — drive the transport yourself (e.g. mount the chat inside a page, not a drawer)
export { useAiChatSession, type AiChatSession, type AiChatSessionConfig } from "./state/useAiChatSession";
// Self-auth — usable on its own when a host drives the session directly
export { SelfAuth, resolveTokenProvider } from "./auth/selfAuth";
export {
  createAiChatApi,
  AiChatApiError,
  type AiChatApi,
  type AiChatApiConfig,
} from "./api/aiChatApi";
export { ChatTransport, type ChatTransportConfig, type TransportStatus } from "./realtime/chatTransport";

// The ai-service wire contract
export type * from "./api/types";

// Utilities
export { cn } from "./lib/cn";
