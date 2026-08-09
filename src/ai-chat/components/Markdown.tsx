import * as React from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
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
  // Deep-links (e.g. "ดูตารางใน Mediwork") must open a new tab — a click must never navigate the
  // host app away and kill the live socket mid-conversation.
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

export function Markdown({ text, className }: { text: string; className?: string }) {
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

  if (html === null) return <>{text}</>;

  return (
    <div
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
  );
}
