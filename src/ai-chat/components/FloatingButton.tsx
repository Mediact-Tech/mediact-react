import * as React from "react";
import { ChevronsLeft, ChevronsRight, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface FloatingButtonProps {
  open: boolean;
  onClick: () => void;
  label: string;
  position?: "bottom-right" | "bottom-left";
  className?: string;
}

/**
 * The always-mounted entry point. Sits in a viewport corner on top of the host app, so it
 * carries the widget's z-index var — a host that needs it lower overrides
 * `--mediact-ai-chat-z` rather than patching the component.
 *
 * It says what it is, in words. A bare chat bubble in the corner of a hospital admin app reads as
 * "support chat" — the thing you press when something is broken — and nobody presses that to ask who is on
 * the night shift. So the closed state is a labelled pill (sparkle + "ผู้ช่วย AI"): the sparkle carries the
 * AI convention for people who know it, the label carries it for everyone else. It collapses to a circle
 * only where the text genuinely does not fit (narrow screens) and while the drawer is open, where the
 * button's job changes to "close" and the panel beside it is already titled.
 */
export const FloatingButton = React.forwardRef<HTMLButtonElement, FloatingButtonProps>(
  function FloatingButton({ open, onClick, label, position = "bottom-right", className }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-expanded={open}
        data-slot="ai-chat-launcher"
        style={{
          zIndex: "var(--mediact-ai-chat-z, 1310)",
          insetInlineEnd:
            position === "bottom-right" ? "var(--mediact-ai-chat-launcher-offset, 1.5rem)" : undefined,
          insetInlineStart:
            position === "bottom-left" ? "var(--mediact-ai-chat-launcher-offset, 1.5rem)" : undefined,
          insetBlockEnd: "var(--mediact-ai-chat-launcher-offset, 1.5rem)",
        }}
        className={cn(
          "group fixed flex h-14 items-center justify-center gap-2 rounded-full",
          // Circle while open (it is a close button then) or on a narrow screen; labelled pill otherwise.
          open ? "w-14" : "w-14 sm:w-auto sm:px-5",
          "bg-brand text-brand-foreground shadow-lg transition-all",
          "hover:bg-brand-hover hover:shadow-xl active:scale-95",
          "outline-none focus-visible:ring-2 focus-visible:ring-brand-active focus-visible:ring-offset-2",
          "cursor-pointer",
          className,
        )}
      >
        {open ? (
          // Matches the drawer's own header button: the same collapse chevron, pointing at the same edge.
          // Two different glyphs for one action taught two different meanings — and an ✕ taught the wrong one.
          position === "bottom-left" ? (
            <ChevronsLeft className="size-6" />
          ) : (
            <ChevronsRight className="size-6" />
          )
        ) : (
          <>
            <Sparkles className="size-6 shrink-0 transition-transform group-hover:scale-110" />
            <span className="hidden text-body-sm font-medium whitespace-nowrap sm:inline">{label}</span>
          </>
        )}
      </button>
    );
  },
);
