import * as React from "react";
import { resolveTokenProvider } from "./auth/selfAuth";
import { ChatDrawer } from "./components/ChatDrawer";
import { FloatingButton } from "./components/FloatingButton";
import { resolveLabels } from "./labels";
import { useAiChatSession } from "./state/useAiChatSession";
import type { AiChatConfig } from "./types";

/** Roster-flavoured openers — the assistant's most common real questions. */
const DEFAULT_SUGGESTIONS = [
  "วันที่ 6 ใครขึ้นเวรเช้าบ้าง",
  "เดือนนี้มีเวรไหนคนไม่พอ",
  "ตอนนี้แผนกเปิดกฎอะไรอยู่บ้าง",
];

export interface AiChatWidgetProps extends AiChatConfig {
  /** Controlled open state. Omit to let the widget own it. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hide the built-in launcher when the host opens the drawer from its own button. */
  hideLauncher?: boolean;
  className?: string;
}

/**
 * The single component every app mounts — floating launcher + chat drawer, one import.
 *
 * Mount it once, high in the tree (Portal `_app`, Mediwork/Medimatch root layout). Nothing
 * happens until the user opens it: no socket, no request. Everything the widget needs from
 * the host arrives as props (`baseUrl`, `getToken`, `scope`), so it stays free of any app's
 * auth wiring, HTTP client or router.
 */
export function AiChatWidget({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  hideLauncher,
  className,
  ...config
}: AiChatWidgetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  // One provider per mount: `resolveTokenProvider` owns the widget's Keycloak adapter, so re-creating it
  // per render would re-run `init` (and its iframe) on every keystroke.
  const getToken = React.useMemo(
    () => resolveTokenProvider(config.auth, config.getToken, config.onError),
    [config.auth, config.getToken, config.onError],
  );
  const session = useAiChatSession(React.useMemo(() => ({ ...config, getToken }), [config, getToken]));
  const labels = React.useMemo(() => resolveLabels(config.labels), [config.labels]);
  const position = config.position ?? "bottom-right";
  const suggestions = config.suggestions ?? DEFAULT_SUGGESTIONS;

  // Mode lives in the session, not here: the `start_scheduling` tool can flip it mid-turn.
  // The host's `mode` prop is the starting point, applied when it changes.
  const { setMode } = session;
  React.useEffect(() => {
    if (config.mode) setMode(config.mode);
  }, [config.mode, setMode]);

  // Lazy connect: the socket opens the first time the drawer is opened, not on mount.
  React.useEffect(() => {
    if (open) void session.start();
  }, [open, session.start]);

  const handleSend = React.useCallback(
    (text: string) => {
      void session.send(text);
    },
    [session.send],
  );

  const handlePickConversation = React.useCallback(
    (conversationId: string) => {
      void session.start(conversationId);
    },
    [session.start],
  );

  const handleNewChat = React.useCallback(() => {
    session.newConversation();
    void session.start();
  }, [session.newConversation, session.start]);

  const handleRetry = React.useCallback(() => {
    session.newConversation();
    void session.start();
  }, [session.newConversation, session.start]);

  return (
    <>
      {!hideLauncher && (
        <FloatingButton
          open={open}
          onClick={() => setOpen(!open)}
          label={labels.launcher}
          position={position}
          className={className}
        />
      )}

      <ChatDrawer
        open={open}
        onOpenChange={setOpen}
        messages={session.state.messages}
        status={session.state.status}
        transportStatus={session.state.transportStatus}
        error={session.state.error}
        activeConversationId={session.state.conversationId}
        labels={labels}
        position={position}
        mode={session.state.mode}
        onModeChange={setMode}
        showModeToggle={config.showModeToggle}
        contextUsage={session.state.contextUsage}
        suggestions={suggestions}
        onSend={handleSend}
        onCancel={() => void session.cancel()}
        onNewChat={handleNewChat}
        onPickConversation={handlePickConversation}
        onRetry={handleRetry}
        loadConversations={session.listConversations}
      />
    </>
  );
}
