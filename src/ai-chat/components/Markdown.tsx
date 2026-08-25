import * as React from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { ExternalLink, CornerDownRight } from "lucide-react";
import type { AiChatLabels } from "../types";
import { cn } from "../lib/cn";

/**
 * Assistant answers are markdown — roster questions come back as tables, rule lists as bullets.
 * Rendering them as plain text is the difference between a readable shift table and a wall of pipes.
 *
 * Sanitized because the text is model output that can echo whatever a tool read out of the DB;
 * `dangerouslySetInnerHTML` is only safe on the far side of DOMPurify. On the server (no DOM) we
 * render plain text instead of shipping unsanitized HTML.
 */

let hooked = false;
function ensureLinkHardening() {
  if (hooked || typeof window === "undefined") return;
  // `target=_blank` stays as the FALLBACK, not as the decision: a modifier-click, a middle-click and
  // any environment where the click handler below does not run all land here. `rel` is non-negotiable
  // on a link whose href came out of model output.
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.nodeName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
  hooked = true;
}

/**
 * An alias token the service could not resolve (`<user:501>` — a turn whose vault no longer holds it)
 * reaches us verbatim. GFM reads `<scheme:value>` as an AUTOLINK, so it would render as a clickable
 * `user:501` link. Neutralize it so it stays plain, visible text — which is also what the service's own
 * "unknown token is left standing" rule intends.
 */
const ALIAS_TOKEN = /<(user|facility|department|subUnit):(\d+)>/g;

/** Where the choice popover is drawn, plus the link it is deciding for. */
interface LinkChoice {
  href: string;
  x: number;
  y: number;
}

const POPOVER_WIDTH = 208;
const POPOVER_HEIGHT = 92;
const EDGE_GAP = 8;

export function Markdown({
  text,
  className,
  labels,
}: {
  text: string;
  className?: string;
  labels?: AiChatLabels;
}) {
  const [choice, setChoice] = React.useState<LinkChoice | null>(null);

  const html = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    ensureLinkHardening();
    try {
      const safeText = text.replace(ALIAS_TOKEN, "&lt;$1:$2&gt;");
      return DOMPurify.sanitize(marked(safeText, { async: false, breaks: true, gfm: true }));
    } catch {
      return null;
    }
  }, [text]);

  /**
   * A plain click on a link ASKS instead of navigating.
   *
   * Both answers are legitimate and neither is safe to assume. Opening in this tab tears the host page
   * down mid-conversation (the socket goes with it, and the reader loses the answer they are following);
   * opening a new tab every time leaves a trail of tabs behind somebody who just wanted to go to the
   * screen the assistant named. The widget cannot know which one this click means, so it asks — once,
   * at the moment of the click, next to the link.
   *
   * NOT intercepted, deliberately: modifier- and middle-clicks (the reader has already stated their
   * intent in the language of the browser — honour it, do not put a menu in front of it) and anything
   * that is not the primary button.
   */
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!labels) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement).closest?.("a[href]") as HTMLAnchorElement | null;
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    // Anchors and `javascript:` survivors are not navigation choices; let the browser deal with them.
    if (!href || href.startsWith("#")) return;

    event.preventDefault();
    // A keyboard "click" carries no coordinates (`detail === 0`) — anchor the popover to the link
    // itself then, or it lands in the top-left corner of the screen, far from what it is asking about.
    const rect = anchor.getBoundingClientRect();
    const originX = event.detail === 0 ? rect.left : event.clientX;
    const originY = event.detail === 0 ? rect.bottom : event.clientY;
    setChoice({
      href: anchor.href,
      x: Math.min(originX, window.innerWidth - POPOVER_WIDTH - EDGE_GAP),
      y: Math.min(originY + EDGE_GAP, window.innerHeight - POPOVER_HEIGHT - EDGE_GAP),
    });
  };

  if (html === null) return <>{text}</>;

  return (
    <>
      <div
        onClick={onClick}
        className={cn(
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
          className,
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {choice && labels ? (
        <LinkChoicePopover choice={choice} labels={labels} onClose={() => setChoice(null)} />
      ) : null}
    </>
  );
}

/**
 * Two answers and no default. There is no "remember this" on purpose: the right answer is a property of
 * the link, not of the person — "open the roster I am being told about" and "keep this to read later"
 * are both normal within one conversation.
 */
function LinkChoicePopover({
  choice,
  labels,
  onClose,
}: {
  choice: LinkChoice;
  labels: AiChatLabels;
  onClose: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    ref.current?.querySelector("button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    // `pointerdown`, not `click`: the click that opened this popover is still travelling, and a `click`
    // listener added during it would fire on the same event and close the popover before it is seen.
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onClose]);

  const open = (newTab: boolean) => {
    if (newTab) window.open(choice.href, "_blank", "noopener,noreferrer");
    else window.location.assign(choice.href);
    onClose();
  };

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={labels.linkOpenTitle}
      data-slot="ai-chat-link-choice"
      style={{ left: choice.x, top: choice.y, width: POPOVER_WIDTH }}
      className="fixed z-10 overflow-hidden rounded-lg border border-border-default bg-bg-default py-1 shadow-lg"
    >
      {/* The host is the part of a URL that answers "am I staying inside this app" — the path is noise
          at this width, and truncating from the left would hide exactly that. */}
      <p className="truncate px-3 pb-1 text-caption text-text-body">{hostOf(choice.href)}</p>
      <LinkChoiceItem
        icon={<CornerDownRight className="size-3.5 shrink-0" />}
        label={labels.linkOpenHere}
        onClick={() => open(false)}
      />
      <LinkChoiceItem
        icon={<ExternalLink className="size-3.5 shrink-0" />}
        label={labels.linkOpenNewTab}
        onClick={() => open(true)}
      />
    </div>
  );
}

function LinkChoiceItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-caption text-text-black hover:bg-brand-subtle hover:text-brand-hover"
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}

/** `https://mediwork.dev…/schedules` → `mediwork.dev…`; anything unparseable falls back to the raw href. */
function hostOf(href: string): string {
  try {
    return new URL(href, window.location.href).host;
  } catch {
    return href;
  }
}
