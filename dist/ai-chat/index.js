// src/ai-chat/AiChatWidget.tsx
import * as React9 from "react";

// src/ai-chat/auth/selfAuth.ts
var DEFAULT_CLIENT_ID = "mediact-ai-assistant";
var MIN_VALIDITY_SECONDS = 30;
var INIT_TIMEOUT_MS = 3e3;
var SelfAuth = class {
  constructor(config, onError) {
    this.config = config;
    this.onError = onError;
  }
  config;
  onError;
  /** One init per widget instance, shared by every caller (`start`, each send, each reconnect). */
  initialized = null;
  /** Set once init finally lands — a late success is still adopted by the NEXT call. */
  adapter = null;
  /** The check already ran out of patience once; stop paying that wait on every send. */
  gaveUp = false;
  /**
   * A fresh access token for the widget's own client, or `""` when there is no session to adopt — the
   * caller decides what to do with that, because only it knows whether a host token exists.
   */
  async token() {
    const keycloak = this.adapter ?? (this.gaveUp ? null : await this.instanceOrTimeout());
    if (!keycloak?.authenticated) return "";
    await keycloak.updateToken(MIN_VALIDITY_SECONDS).catch(() => false);
    return keycloak.token ?? "";
  }
  /** The adapter if it arrives in time, otherwise null — and from then on, null immediately. */
  instanceOrTimeout() {
    this.initialized ??= this.createAndInit().then((keycloak) => {
      this.adapter = keycloak;
      return keycloak;
    });
    return Promise.race([
      this.initialized,
      new Promise(
        (resolve) => setTimeout(() => {
          this.gaveUp = true;
          resolve(null);
        }, this.config.initTimeoutMs ?? INIT_TIMEOUT_MS)
      )
    ]);
  }
  async createAndInit() {
    if (typeof window === "undefined") return null;
    try {
      const module = await import("keycloak-js");
      const keycloak = new module.default({
        url: this.config.url,
        realm: this.config.realm,
        clientId: this.config.clientId ?? DEFAULT_CLIENT_ID
      });
      await keycloak.init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: this.config.silentCheckSsoRedirectUri ?? `${window.location.origin}/silent-check-sso.html`,
        pkceMethod: "S256",
        checkLoginIframe: false,
        // Bound the adapter's own wait too, so a refused iframe rejects here instead of hanging past the
        // race above and leaving a stray promise running for another ten seconds.
        messageReceiveTimeout: 2500
      });
      return keycloak;
    } catch (error) {
      this.onError?.(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  }
};
function resolveTokenProvider(auth, hostGetToken, onError) {
  if (!auth) {
    if (!hostGetToken) throw new Error("AiChatWidget needs either `auth` or `getToken`.");
    return async () => hostGetToken();
  }
  const selfAuth = new SelfAuth(auth, onError);
  return async () => {
    const own = await selfAuth.token();
    if (own) return own;
    return hostGetToken ? hostGetToken() : "";
  };
}

// src/ai-chat/components/ChatDrawer.tsx
import * as React6 from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { CalendarDays, ChevronsLeft, ChevronsRight, History, MessageCircle, Plus } from "lucide-react";

// src/ai-chat/lib/cn.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/ai-chat/components/Composer.tsx
import * as React from "react";
import { Send, Square } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
function Composer({
  onSend,
  onCancel,
  busy,
  disabled,
  labels,
  placeholder = labels.placeholder
}) {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef(null);
  const submit = () => {
    const text = value.trim();
    if (!text || busy || disabled) return;
    onSend(text);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };
  const autoGrow = (event) => {
    setValue(event.target.value);
    const el = event.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-slot": "ai-chat-composer",
      className: "flex items-end gap-2 border-t border-border-subtle bg-white px-3 py-3",
      children: [
        /* @__PURE__ */ jsx(
          "textarea",
          {
            ref: textareaRef,
            rows: 1,
            value,
            onChange: autoGrow,
            onKeyDown: handleKeyDown,
            disabled,
            placeholder,
            "aria-label": placeholder,
            className: cn(
              "max-h-40 min-h-9 flex-1 resize-none rounded-md border border-border-input px-3 py-2 text-sm",
              "outline-none placeholder:text-gray-400",
              "focus-visible:border-brand-active focus-visible:ring-1 focus-visible:ring-brand-active",
              "disabled:bg-gray-50 disabled:text-gray-400"
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: busy ? onCancel : submit,
            disabled: disabled || !busy && !value.trim(),
            "aria-label": busy ? labels.cancel : labels.send,
            className: cn(
              "flex size-9 shrink-0 items-center justify-center rounded-md transition-colors cursor-pointer",
              "disabled:pointer-events-none disabled:opacity-40",
              busy ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-brand text-brand-foreground hover:bg-brand-hover"
            ),
            children: busy ? /* @__PURE__ */ jsx(Square, { className: "size-4 fill-current" }) : /* @__PURE__ */ jsx(Send, { className: "size-4" })
          }
        )
      ]
    }
  );
}

// src/ai-chat/components/ContextMeter.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var WARN_AT = 0.8;
function ContextMeter({ usage, labels, className }) {
  if (!usage || usage.limit <= 0) return null;
  const ratio = usage.used / usage.limit;
  const percent = Math.round(ratio * 100);
  const state = usage.trimmed || ratio >= 1 ? "over" : ratio >= WARN_AT ? "warn" : "ok";
  const tooltip = [
    fill(labels.contextTooltip, { used: format(usage.used), limit: format(usage.limit) }),
    usage.trimmed ? labels.contextTrimmed : null
  ].filter(Boolean).join("\n");
  return /* @__PURE__ */ jsxs2(
    "div",
    {
      "data-slot": "ai-chat-context-meter",
      title: tooltip,
      "aria-label": tooltip,
      className: cn("flex shrink-0 items-center gap-1.5", className),
      children: [
        /* @__PURE__ */ jsx2("div", { className: "h-1 w-10 overflow-hidden rounded-full bg-gray-200", children: /* @__PURE__ */ jsx2(
          "div",
          {
            style: { width: `${Math.min(100, Math.max(2, percent))}%` },
            className: cn(
              "h-full rounded-full transition-[width] duration-500",
              state === "over" ? "bg-error-red-600" : state === "warn" ? "bg-warning-yellow-400" : "bg-brand-active"
            )
          }
        ) }),
        /* @__PURE__ */ jsxs2(
          "span",
          {
            className: cn(
              "text-[11px] tabular-nums",
              state === "over" ? "text-error-red-600" : state === "warn" ? "text-warning-yellow-800" : "text-gray-500"
            ),
            children: [
              percent,
              "%"
            ]
          }
        )
      ]
    }
  );
}
function format(value) {
  return value.toLocaleString("en-US");
}
function fill(template, values) {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.split(`{${name}}`).join(value),
    template
  );
}

// src/ai-chat/components/ConversationPicker.tsx
import * as React2 from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function relativeTime(iso) {
  const date = new Date(iso);
  const seconds = (Date.now() - date.getTime()) / 1e3;
  if (seconds < 60) return "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E2A\u0E31\u0E01\u0E04\u0E23\u0E39\u0E48";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} \u0E19\u0E32\u0E17\u0E35\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} \u0E0A\u0E21.\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27`;
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function ConversationPicker({ load, onPick, activeId, labels }) {
  const [items, setItems] = React2.useState(null);
  const [error, setError] = React2.useState(null);
  React2.useEffect(() => {
    let cancelled = false;
    load().then((result) => {
      if (!cancelled) setItems(result);
    }).catch((err) => {
      if (!cancelled) setError(err instanceof Error ? err.message : String(err));
    });
    return () => {
      cancelled = true;
    };
  }, [load]);
  if (error) {
    return /* @__PURE__ */ jsx3("p", { className: "px-4 py-3 text-xs text-error-red-600", children: error });
  }
  if (!items) {
    return /* @__PURE__ */ jsx3("div", { className: "flex items-center justify-center py-6", children: /* @__PURE__ */ jsx3(Loader2, { className: "size-4 animate-spin text-gray-400" }) });
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsx3("p", { className: "px-4 py-3 text-xs text-gray-500", children: labels.emptyHint });
  }
  return /* @__PURE__ */ jsx3("ul", { "data-slot": "ai-chat-history", className: "max-h-64 overflow-y-auto border-b border-border-subtle", children: items.map((item) => /* @__PURE__ */ jsx3("li", { children: /* @__PURE__ */ jsxs3(
    "button",
    {
      type: "button",
      onClick: () => onPick(item.id),
      className: cn(
        "flex w-full items-start gap-2 px-4 py-2.5 text-left transition-colors cursor-pointer",
        "hover:bg-brand-subtle",
        item.id === activeId && "bg-brand-subtle"
      ),
      children: [
        /* @__PURE__ */ jsx3(MessageSquare, { className: "mt-0.5 size-3.5 shrink-0 text-gray-400" }),
        /* @__PURE__ */ jsxs3("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx3("span", { className: "block truncate text-sm text-black", children: item.title || item.preview || "(\u0E44\u0E21\u0E48\u0E21\u0E35\u0E0A\u0E37\u0E48\u0E2D)" }),
          /* @__PURE__ */ jsx3("span", { className: "block text-[11px] text-gray-400", children: relativeTime(item.createdAt) })
        ] })
      ]
    }
  ) }, item.id)) });
}

// src/ai-chat/components/MessageList.tsx
import * as React5 from "react";
import { Sparkles } from "lucide-react";

// src/ai-chat/components/MessageBubble.tsx
import { CircleCheck, CircleSlash } from "lucide-react";

// src/ai-chat/components/Markdown.tsx
import * as React3 from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { Fragment, jsx as jsx4 } from "react/jsx-runtime";
var hooked = false;
function ensureLinkHardening() {
  if (hooked || typeof window === "undefined") return;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.nodeName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
  hooked = true;
}
var ALIAS_TOKEN = /<(user|facility|department|subUnit):(\d+)>/g;
function Markdown({ text, className }) {
  const html = React3.useMemo(() => {
    if (typeof window === "undefined") return null;
    ensureLinkHardening();
    try {
      const safeText = text.replace(ALIAS_TOKEN, "&lt;$1:$2&gt;");
      return DOMPurify.sanitize(marked(safeText, { async: false, breaks: true, gfm: true }));
    } catch {
      return null;
    }
  }, [text]);
  if (html === null) return /* @__PURE__ */ jsx4(Fragment, { children: text });
  return /* @__PURE__ */ jsx4(
    "div",
    {
      className: cn(
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        "[&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5",
        "[&_li]:my-0.5",
        "[&_h1]:my-2 [&_h1]:text-base [&_h1]:font-semibold",
        "[&_h2]:my-2 [&_h2]:text-sm [&_h2]:font-semibold",
        "[&_h3]:my-1.5 [&_h3]:text-sm [&_h3]:font-semibold",
        "[&_a]:text-brand-active [&_a]:underline",
        "[&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em]",
        "[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-gray-100 [&_pre]:p-2",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-border-default [&_blockquote]:pl-2 [&_blockquote]:text-gray-600",
        // Tables scroll inside the bubble instead of stretching the drawer.
        "[&_table]:my-2 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-xs",
        "[&_th]:border [&_th]:border-border-default [&_th]:bg-gray-50 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:whitespace-nowrap",
        "[&_td]:border [&_td]:border-border-default [&_td]:px-2 [&_td]:py-1 [&_td]:whitespace-nowrap",
        className
      ),
      dangerouslySetInnerHTML: { __html: html }
    }
  );
}

// src/ai-chat/components/ToolTrail.tsx
import * as React4 from "react";
import { Check, Loader2 as Loader22, TriangleAlert } from "lucide-react";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function ToolTrail({ tools }) {
  if (tools.length === 0) return null;
  return /* @__PURE__ */ jsx5("ul", { className: "mb-2 flex flex-col gap-1", "data-slot": "ai-chat-tool-trail", children: tools.map((tool, index) => /* @__PURE__ */ jsxs4(
    "li",
    {
      className: cn(
        "flex items-center gap-1.5 text-xs",
        tool.status === "error" ? "text-error-red-600" : "text-gray-500"
      ),
      children: [
        /* @__PURE__ */ jsx5(ToolIcon, { status: tool.status }),
        /* @__PURE__ */ jsx5("span", { className: cn(tool.status === "done" && "line-through decoration-gray-300"), children: tool.label_th }),
        tool.status === "start" && /* @__PURE__ */ jsx5(Elapsed, { since: tool.startedAt })
      ]
    },
    `${tool.label_th}-${index}`
  )) });
}
function Elapsed({ since }) {
  const [seconds, setSeconds] = React4.useState(() => elapsedSeconds(since));
  React4.useEffect(() => {
    const timer = setInterval(() => setSeconds(elapsedSeconds(since)), 1e3);
    return () => clearInterval(timer);
  }, [since]);
  if (seconds < 3) return null;
  return /* @__PURE__ */ jsxs4("span", { className: "tabular-nums opacity-60", children: [
    "(",
    seconds,
    " \u0E27\u0E34)"
  ] });
}
var elapsedSeconds = (since) => Math.floor((Date.now() - since) / 1e3);
function ToolIcon({ status }) {
  if (status === "start") return /* @__PURE__ */ jsx5(Loader22, { className: "size-3.5 shrink-0 animate-spin" });
  if (status === "error") return /* @__PURE__ */ jsx5(TriangleAlert, { className: "size-3.5 shrink-0" });
  return /* @__PURE__ */ jsx5(Check, { className: "size-3.5 shrink-0 text-success-green-600" });
}

// src/ai-chat/components/WidgetRenderer.tsx
import { CircleAlert, TriangleAlert as TriangleAlert2 } from "lucide-react";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
function WidgetRenderer({ widget, onAction, disabled }) {
  switch (widget.type) {
    case "confirm":
      return /* @__PURE__ */ jsx6(ConfirmCard, { payload: widget.payload, onAction, disabled });
    case "error_card":
      return /* @__PURE__ */ jsx6(ErrorCard, { payload: widget.payload, onAction, disabled });
    case "staff_picker":
      return /* @__PURE__ */ jsx6(StaffPicker, { payload: widget.payload, onAction, disabled });
    case "summary_stats":
      return /* @__PURE__ */ jsx6(SummaryStats, { payload: widget.payload });
    case "schedule_diff":
      return /* @__PURE__ */ jsx6(ScheduleDiff, { payload: widget.payload });
    default:
      return /* @__PURE__ */ jsx6(Frame, { children: /* @__PURE__ */ jsxs5("p", { className: "text-xs text-gray-500", children: [
        "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A (",
        widget.type,
        ")"
      ] }) });
  }
}
function Frame({ children, className }) {
  return /* @__PURE__ */ jsx6(
    "div",
    {
      "data-slot": "ai-chat-widget",
      className: cn("mt-2 rounded-md border border-border-default bg-white p-3", className),
      children
    }
  );
}
function ActionButton({
  children,
  onClick,
  variant = "primary",
  disabled
}) {
  return /* @__PURE__ */ jsx6(
    "button",
    {
      type: "button",
      onClick,
      disabled,
      className: cn(
        "h-8 rounded-sm px-3 text-sm font-semibold transition-colors cursor-pointer",
        "disabled:pointer-events-none disabled:opacity-40",
        variant === "primary" ? "bg-brand text-brand-foreground hover:bg-brand-hover" : "border border-brand bg-white text-brand hover:bg-brand-subtle"
      ),
      children
    }
  );
}
function ConfirmCard({
  payload,
  onAction,
  disabled
}) {
  return /* @__PURE__ */ jsxs5(Frame, { children: [
    /* @__PURE__ */ jsx6("p", { className: "text-sm font-semibold text-black", children: payload.title_th }),
    /* @__PURE__ */ jsx6("p", { className: "mt-1 whitespace-pre-wrap text-sm text-gray-600", children: payload.summary_th }),
    /* @__PURE__ */ jsxs5("div", { className: "mt-3 flex gap-2", children: [
      /* @__PURE__ */ jsx6(ActionButton, { onClick: () => onAction(payload.confirmLabel), disabled, children: payload.confirmLabel }),
      /* @__PURE__ */ jsx6(
        ActionButton,
        {
          variant: "secondary",
          onClick: () => onAction(payload.cancelLabel),
          disabled,
          children: payload.cancelLabel
        }
      )
    ] })
  ] });
}
function ErrorCard({
  payload,
  onAction,
  disabled
}) {
  const isError = payload.severity === "error";
  return /* @__PURE__ */ jsx6(
    Frame,
    {
      className: isError ? "border-error-red-100 bg-error-red-50" : "border-warning-yellow-200 bg-warning-yellow-50",
      children: /* @__PURE__ */ jsxs5("div", { className: "flex items-start gap-2", children: [
        isError ? /* @__PURE__ */ jsx6(CircleAlert, { className: "mt-0.5 size-4 shrink-0 text-error-red-600" }) : /* @__PURE__ */ jsx6(TriangleAlert2, { className: "mt-0.5 size-4 shrink-0 text-warning-normal" }),
        /* @__PURE__ */ jsxs5("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxs5("p", { className: "text-sm font-semibold text-black", children: [
            payload.code,
            " \u2014 ",
            payload.message_th
          ] }),
          payload.location && /* @__PURE__ */ jsxs5("p", { className: "mt-1 text-xs text-gray-600", children: [
            payload.location.date,
            " \xB7 \u0E40\u0E27\u0E23 ",
            payload.location.shiftType
          ] }),
          payload.fixActions.length > 0 && /* @__PURE__ */ jsx6("div", { className: "mt-2 flex flex-wrap gap-2", children: payload.fixActions.map((fix) => /* @__PURE__ */ jsx6(
            ActionButton,
            {
              variant: "secondary",
              onClick: () => onAction(fix.label_th),
              disabled,
              children: fix.label_th
            },
            fix.opRef
          )) })
        ] })
      ] })
    }
  );
}
function StaffPicker({
  payload,
  onAction,
  disabled
}) {
  return /* @__PURE__ */ jsxs5(Frame, { children: [
    /* @__PURE__ */ jsx6("p", { className: "text-sm text-gray-700", children: payload.prompt_th }),
    /* @__PURE__ */ jsx6("div", { className: "mt-2 flex flex-col gap-1", children: payload.candidates.map((candidate) => /* @__PURE__ */ jsxs5(
      "button",
      {
        type: "button",
        disabled,
        onClick: () => onAction(candidate.displayName),
        className: cn(
          "flex items-baseline gap-2 rounded-sm border border-border-subtle px-2 py-1.5 text-left",
          "hover:bg-brand-subtle disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
        ),
        children: [
          /* @__PURE__ */ jsx6("span", { className: "text-sm font-medium text-black", children: candidate.displayName }),
          candidate.subUnit && /* @__PURE__ */ jsx6("span", { className: "text-xs text-gray-500", children: candidate.subUnit }),
          candidate.hint && /* @__PURE__ */ jsx6("span", { className: "text-xs text-gray-400", children: candidate.hint })
        ]
      },
      candidate.userId
    )) })
  ] });
}
function SummaryStats({ payload }) {
  return /* @__PURE__ */ jsxs5(Frame, { children: [
    /* @__PURE__ */ jsx6("dl", { className: "grid grid-cols-2 gap-2", children: payload.stats.map((stat) => /* @__PURE__ */ jsxs5("div", { className: "rounded-sm bg-gray-50 px-2 py-1.5", children: [
      /* @__PURE__ */ jsx6("dt", { className: "text-xs text-gray-500", children: stat.label_th }),
      /* @__PURE__ */ jsx6(
        "dd",
        {
          className: cn(
            "text-sm font-semibold",
            stat.flag === "high" && "text-error-red-600",
            stat.flag === "low" && "text-warning-normal",
            !stat.flag && "text-black"
          ),
          children: stat.value
        }
      )
    ] }, stat.label_th)) }),
    payload.warnings_th.length > 0 && /* @__PURE__ */ jsx6("ul", { className: "mt-2 flex flex-col gap-1", children: payload.warnings_th.map((warning) => /* @__PURE__ */ jsxs5("li", { className: "text-xs text-warning-normal", children: [
      "\u2022 ",
      warning
    ] }, warning)) })
  ] });
}
function ScheduleDiff({ payload }) {
  return /* @__PURE__ */ jsxs5(Frame, { className: "overflow-x-auto", children: [
    /* @__PURE__ */ jsxs5("p", { className: "mb-2 text-xs text-gray-500", children: [
      "\u0E15\u0E32\u0E23\u0E32\u0E07\u0E40\u0E27\u0E23 #",
      payload.scheduleId,
      " \xB7 \u0E40\u0E27\u0E2D\u0E23\u0E4C\u0E0A\u0E31\u0E19 ",
      payload.version,
      " \xB7 ",
      payload.changes.length,
      " \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"
    ] }),
    /* @__PURE__ */ jsx6("table", { className: "w-full border-collapse text-sm", children: /* @__PURE__ */ jsx6("tbody", { children: payload.changes.map((change, index) => /* @__PURE__ */ jsxs5("tr", { className: "border-b border-border-subtle", children: [
      /* @__PURE__ */ jsx6("td", { className: "py-1 pr-2 whitespace-nowrap text-gray-600", children: change.date }),
      /* @__PURE__ */ jsx6("td", { className: "py-1 pr-2 text-gray-400 line-through", children: change.before ?? "\u2014" }),
      /* @__PURE__ */ jsx6("td", { className: "py-1 font-medium text-black", children: change.after ?? "\u2014" })
    ] }, `${change.date}-${change.userId}-${index}`)) }) })
  ] });
}

// src/ai-chat/components/MessageBubble.tsx
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
function MessageBubble({ message, labels, onWidgetAction, widgetsDisabled }) {
  if (message.role === "system") {
    return /* @__PURE__ */ jsxs6("div", { className: "my-2 flex items-center gap-2", "data-slot": "ai-chat-divider", children: [
      /* @__PURE__ */ jsx7("span", { className: "h-px flex-1 bg-border-subtle" }),
      /* @__PURE__ */ jsx7("span", { className: "text-[11px] text-gray-400", children: message.content }),
      /* @__PURE__ */ jsx7("span", { className: "h-px flex-1 bg-border-subtle" })
    ] });
  }
  const isUser = message.role === "user";
  return /* @__PURE__ */ jsx7(
    "div",
    {
      "data-slot": "ai-chat-message",
      "data-role": message.role,
      className: cn("flex w-full", isUser ? "justify-end" : "justify-start"),
      children: /* @__PURE__ */ jsxs6("div", { className: cn("max-w-[85%]", isUser && "flex flex-col items-end"), children: [
        !isUser && message.tools && /* @__PURE__ */ jsx7(ToolTrail, { tools: message.tools }),
        (message.content || !isUser) && /* @__PURE__ */ jsx7(
          "div",
          {
            className: cn(
              "rounded-lg px-3 py-2 text-sm break-words",
              isUser ? "bg-brand text-brand-foreground whitespace-pre-wrap" : message.failed ? "border border-error-red-100 bg-error-red-50 text-error-red-800" : "border border-border-subtle bg-white text-black"
            ),
            children: isUser ? message.content : message.content ? /* @__PURE__ */ jsx7(Markdown, { text: message.content }) : message.streaming ? /* @__PURE__ */ jsx7(TypingDots, { label: labels.thinking }) : null
          }
        ),
        message.widgets?.map((widget, index) => /* @__PURE__ */ jsx7(
          WidgetRenderer,
          {
            widget,
            onAction: onWidgetAction,
            disabled: widgetsDisabled
          },
          `${widget.type}-${index}`
        )),
        message.outcome && /* @__PURE__ */ jsx7(OutcomeBadge, { outcome: message.outcome, labels })
      ] })
    }
  );
}
function OutcomeBadge({
  outcome,
  labels
}) {
  if (outcome.committed === void 0) return null;
  return /* @__PURE__ */ jsxs6(
    "span",
    {
      className: cn(
        "mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        outcome.committed ? "bg-success-green-background-50 text-success-green-800" : "bg-gray-100 text-gray-600"
      ),
      children: [
        outcome.committed ? /* @__PURE__ */ jsx7(CircleCheck, { className: "size-3" }) : /* @__PURE__ */ jsx7(CircleSlash, { className: "size-3" }),
        outcome.committed ? labels.committed : labels.notCommitted
      ]
    }
  );
}
function TypingDots({ label }) {
  return /* @__PURE__ */ jsxs6("span", { className: "flex items-center gap-1 text-gray-400", "aria-label": label, children: [
    /* @__PURE__ */ jsx7(Dot, { delay: "0ms" }),
    /* @__PURE__ */ jsx7(Dot, { delay: "150ms" }),
    /* @__PURE__ */ jsx7(Dot, { delay: "300ms" })
  ] });
}
function Dot({ delay }) {
  return /* @__PURE__ */ jsx7(
    "span",
    {
      className: "inline-block size-1.5 animate-bounce rounded-full bg-current",
      style: { animationDelay: delay }
    }
  );
}

// src/ai-chat/components/MessageList.tsx
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
function MessageList({
  messages,
  labels,
  onWidgetAction,
  busy,
  suggestions
}) {
  const endRef = React5.useRef(null);
  React5.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);
  if (messages.length === 0) {
    return /* @__PURE__ */ jsxs7("div", { className: "flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center", children: [
      /* @__PURE__ */ jsx8(Sparkles, { className: "size-8 text-brand-active" }),
      /* @__PURE__ */ jsx8("p", { className: "text-sm font-semibold text-black", children: labels.emptyTitle }),
      /* @__PURE__ */ jsx8("p", { className: "text-xs text-gray-500", children: labels.emptyHint }),
      suggestions && suggestions.length > 0 && /* @__PURE__ */ jsx8("div", { className: "mt-4 flex w-full flex-col gap-2", children: suggestions.map((suggestion) => /* @__PURE__ */ jsx8(
        "button",
        {
          type: "button",
          disabled: busy,
          onClick: () => onWidgetAction(suggestion),
          className: cn(
            "rounded-lg border border-border-default bg-white px-3 py-2 text-left text-sm text-black",
            "transition-colors hover:border-brand-active hover:bg-brand-subtle cursor-pointer",
            "disabled:pointer-events-none disabled:opacity-40"
          ),
          children: suggestion
        },
        suggestion
      )) })
    ] });
  }
  return /* @__PURE__ */ jsxs7(
    "div",
    {
      "data-slot": "ai-chat-messages",
      className: "flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4",
      children: [
        messages.map((message, index) => /* @__PURE__ */ jsx8(
          MessageBubble,
          {
            message,
            labels,
            onWidgetAction,
            widgetsDisabled: busy || index !== messages.length - 1
          },
          message.id
        )),
        /* @__PURE__ */ jsx8("div", { ref: endRef })
      ]
    }
  );
}

// src/ai-chat/components/ChatDrawer.tsx
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
function ChatDrawer(props) {
  const {
    open,
    onOpenChange,
    messages,
    status,
    transportStatus,
    error,
    labels,
    position,
    onSend,
    onCancel,
    onNewChat,
    onPickConversation,
    onRetry,
    loadConversations,
    activeConversationId,
    mode,
    onModeChange,
    showModeToggle,
    contextUsage,
    suggestions
  } = props;
  const [historyOpen, setHistoryOpen] = React6.useState(false);
  const busy = status === "sending" || status === "streaming";
  const starting = status === "starting";
  return /* @__PURE__ */ jsx9(RadixDialog.Root, { open, onOpenChange, modal: false, children: /* @__PURE__ */ jsx9(RadixDialog.Portal, { children: /* @__PURE__ */ jsxs8(
    RadixDialog.Content,
    {
      "data-slot": "ai-chat-drawer",
      "aria-describedby": void 0,
      onInteractOutside: (event) => event.preventDefault(),
      onPointerDownOutside: (event) => event.preventDefault(),
      style: { zIndex: "var(--mediact-ai-chat-z, 1310)" },
      className: cn(
        "fixed inset-y-0 flex w-full flex-col bg-gray-50 shadow-2xl outline-none",
        "sm:w-[var(--mediact-ai-chat-drawer-width,26rem)]",
        position === "bottom-left" ? "left-0 border-r border-border-default" : "right-0 border-l border-border-default",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        position === "bottom-left" ? "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left" : "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
      ),
      children: [
        /* @__PURE__ */ jsxs8("header", { className: "flex items-center gap-2 border-b border-border-subtle bg-white px-4 py-3", children: [
          /* @__PURE__ */ jsxs8("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx9(RadixDialog.Title, { className: "truncate text-sm font-semibold text-black", children: labels.title }),
            /* @__PURE__ */ jsx9("p", { className: "truncate text-xs text-gray-500", children: labels.subtitle })
          ] }),
          /* @__PURE__ */ jsx9(ContextMeter, { usage: contextUsage ?? null, labels, className: "mr-1" }),
          /* @__PURE__ */ jsx9(IconButton, { label: labels.history, onClick: () => setHistoryOpen((v) => !v), active: historyOpen, children: /* @__PURE__ */ jsx9(History, { className: "size-4" }) }),
          /* @__PURE__ */ jsx9(IconButton, { label: labels.newChat, onClick: onNewChat, children: /* @__PURE__ */ jsx9(Plus, { className: "size-4" }) }),
          /* @__PURE__ */ jsx9(RadixDialog.Close, { asChild: true, children: /* @__PURE__ */ jsx9(IconButton, { label: labels.minimize, children: position === "bottom-left" ? /* @__PURE__ */ jsx9(ChevronsLeft, { className: "size-4" }) : /* @__PURE__ */ jsx9(ChevronsRight, { className: "size-4" }) }) })
        ] }),
        (showModeToggle || mode === "schedule") && onModeChange && /* @__PURE__ */ jsxs8("div", { className: "flex gap-1 border-b border-border-subtle bg-white px-4 py-2", children: [
          /* @__PURE__ */ jsx9(
            ModeChip,
            {
              active: mode === "assistant",
              onClick: () => onModeChange("assistant"),
              icon: /* @__PURE__ */ jsx9(MessageCircle, { className: "size-3.5" }),
              label: labels.assistantMode
            }
          ),
          /* @__PURE__ */ jsx9(
            ModeChip,
            {
              active: mode === "schedule",
              onClick: () => onModeChange("schedule"),
              icon: /* @__PURE__ */ jsx9(CalendarDays, { className: "size-3.5" }),
              label: labels.scheduleMode
            }
          )
        ] }),
        historyOpen && /* @__PURE__ */ jsx9(
          ConversationPicker,
          {
            load: loadConversations,
            activeId: activeConversationId,
            labels,
            onPick: (id) => {
              setHistoryOpen(false);
              onPickConversation(id);
            }
          }
        ),
        /* @__PURE__ */ jsx9(
          StatusBar,
          {
            status,
            transportStatus,
            error,
            labels,
            onRetry
          }
        ),
        /* @__PURE__ */ jsx9(
          MessageList,
          {
            messages,
            labels,
            busy,
            suggestions,
            onWidgetAction: onSend
          }
        ),
        /* @__PURE__ */ jsx9(
          Composer,
          {
            onSend,
            onCancel,
            busy,
            disabled: starting || status === "error",
            labels,
            placeholder: mode === "schedule" ? labels.placeholderSchedule : labels.placeholder
          }
        )
      ]
    }
  ) }) });
}
function StatusBar({
  status,
  transportStatus,
  error,
  labels,
  onRetry
}) {
  if (status === "error") {
    return /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2 bg-error-red-50 px-4 py-2 text-xs text-error-red-800", children: [
      /* @__PURE__ */ jsxs8("span", { className: "min-w-0 flex-1", children: [
        error,
        transportStatus === "connecting" && /* @__PURE__ */ jsx9("span", { className: "mt-0.5 block text-error-red-800/70", children: labels.reconnecting })
      ] }),
      /* @__PURE__ */ jsx9(
        "button",
        {
          type: "button",
          onClick: onRetry,
          className: "shrink-0 font-semibold underline cursor-pointer",
          children: labels.retry
        }
      )
    ] });
  }
  if (status === "starting" || transportStatus === "connecting") {
    return /* @__PURE__ */ jsx9("div", { className: "bg-brand-subtle px-4 py-1.5 text-xs text-brand", children: labels.connecting });
  }
  if (transportStatus === "disconnected") {
    return /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2 bg-gray-100 px-4 py-1.5 text-xs text-gray-600", children: [
      /* @__PURE__ */ jsx9("span", { className: "min-w-0 flex-1 truncate", children: labels.disconnected }),
      /* @__PURE__ */ jsx9(
        "button",
        {
          type: "button",
          onClick: onRetry,
          className: "shrink-0 font-semibold underline cursor-pointer",
          children: labels.retry
        }
      )
    ] });
  }
  return null;
}
var IconButton = React6.forwardRef(function IconButton2({ label, onClick, active, children, ...props }, ref) {
  return /* @__PURE__ */ jsx9(
    "button",
    {
      ref,
      type: "button",
      onClick,
      "aria-label": label,
      title: label,
      className: cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors cursor-pointer",
        "hover:bg-gray-100 hover:text-black",
        active && "bg-brand-subtle text-brand"
      ),
      ...props,
      children
    }
  );
});
function ModeChip({
  active,
  onClick,
  icon,
  label
}) {
  return /* @__PURE__ */ jsxs8(
    "button",
    {
      type: "button",
      onClick,
      "aria-pressed": active,
      className: cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
        active ? "bg-brand text-brand-foreground" : "border border-border-default bg-white text-gray-600 hover:bg-gray-50"
      ),
      children: [
        icon,
        label
      ]
    }
  );
}

// src/ai-chat/components/FloatingButton.tsx
import * as React7 from "react";
import { ChevronsLeft as ChevronsLeft2, ChevronsRight as ChevronsRight2, Sparkles as Sparkles2 } from "lucide-react";
import { Fragment as Fragment2, jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
var FloatingButton = React7.forwardRef(
  function FloatingButton2({ open, onClick, label, position = "bottom-right", className }, ref) {
    return /* @__PURE__ */ jsx10(
      "button",
      {
        ref,
        type: "button",
        onClick,
        "aria-label": label,
        "aria-expanded": open,
        "data-slot": "ai-chat-launcher",
        style: {
          zIndex: "var(--mediact-ai-chat-z, 1310)",
          insetInlineEnd: position === "bottom-right" ? "var(--mediact-ai-chat-launcher-offset, 1.5rem)" : void 0,
          insetInlineStart: position === "bottom-left" ? "var(--mediact-ai-chat-launcher-offset, 1.5rem)" : void 0,
          insetBlockEnd: "var(--mediact-ai-chat-launcher-offset, 1.5rem)"
        },
        className: cn(
          "group fixed flex h-14 items-center justify-center gap-2 rounded-full",
          // Circle while open (it is a close button then) or on a narrow screen; labelled pill otherwise.
          open ? "w-14" : "w-14 sm:w-auto sm:px-5",
          "bg-brand text-brand-foreground shadow-lg transition-all",
          "hover:bg-brand-hover hover:shadow-xl active:scale-95",
          "outline-none focus-visible:ring-2 focus-visible:ring-brand-active focus-visible:ring-offset-2",
          "cursor-pointer",
          className
        ),
        children: open ? (
          // Matches the drawer's own header button: the same collapse chevron, pointing at the same edge.
          // Two different glyphs for one action taught two different meanings — and an ✕ taught the wrong one.
          position === "bottom-left" ? /* @__PURE__ */ jsx10(ChevronsLeft2, { className: "size-6" }) : /* @__PURE__ */ jsx10(ChevronsRight2, { className: "size-6" })
        ) : /* @__PURE__ */ jsxs9(Fragment2, { children: [
          /* @__PURE__ */ jsx10(Sparkles2, { className: "size-6 shrink-0 transition-transform group-hover:scale-110" }),
          /* @__PURE__ */ jsx10("span", { className: "hidden text-sm font-medium whitespace-nowrap sm:inline", children: label })
        ] })
      }
    );
  }
);

// src/ai-chat/labels.ts
var defaultLabels = {
  launcher: "\u0E1C\u0E39\u0E49\u0E0A\u0E48\u0E27\u0E22 AI",
  title: "\u0E1C\u0E39\u0E49\u0E0A\u0E48\u0E27\u0E22 AI",
  subtitle: "\u0E16\u0E32\u0E21\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E15\u0E32\u0E23\u0E32\u0E07\u0E40\u0E27\u0E23 \u0E04\u0E33\u0E02\u0E2D \u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22",
  placeholder: "\u0E16\u0E32\u0E21\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E15\u0E32\u0E23\u0E32\u0E07\u0E40\u0E27\u0E23 \u0E40\u0E0A\u0E48\u0E19 \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 6 \u0E43\u0E04\u0E23\u0E40\u0E27\u0E23\u0E40\u0E0A\u0E49\u0E32\u2026",
  placeholderSchedule: '\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E42\u0E2B\u0E21\u0E14\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23 \u2014 \u0E1E\u0E34\u0E21\u0E1E\u0E4C "\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23\u0E40\u0E25\u0E22" \u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E30\u0E1A\u0E38\u0E41\u0E1C\u0E19\u0E01/\u0E40\u0E14\u0E37\u0E2D\u0E19\u2026',
  send: "\u0E2A\u0E48\u0E07",
  cancel: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01",
  newChat: "\u0E41\u0E0A\u0E17\u0E43\u0E2B\u0E21\u0E48",
  history: "\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E41\u0E0A\u0E17",
  emptyTitle: "\u0E40\u0E23\u0E34\u0E48\u0E21\u0E16\u0E32\u0E21\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22",
  emptyHint: "\u0E40\u0E0A\u0E48\u0E19 \u201C\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E19\u0E35\u0E49\u0E40\u0E27\u0E23\u0E14\u0E36\u0E01\u0E43\u0E04\u0E23\u0E22\u0E31\u0E07\u0E02\u0E32\u0E14\u0E1A\u0E49\u0E32\u0E07\u201D",
  connecting: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u2026",
  disconnected: "\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E2B\u0E25\u0E38\u0E14",
  reconnecting: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34\u2026",
  retry: "\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48",
  minimize: "\u0E22\u0E48\u0E2D\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07\u0E41\u0E0A\u0E17 (\u0E1A\u0E17\u0E2A\u0E19\u0E17\u0E19\u0E32\u0E22\u0E31\u0E07\u0E2D\u0E22\u0E39\u0E48)",
  committed: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E41\u0E25\u0E49\u0E27",
  notCommitted: "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01",
  thinking: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E04\u0E34\u0E14\u2026",
  scheduleMode: "\u0E42\u0E2B\u0E21\u0E14\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23",
  assistantMode: "\u0E42\u0E2B\u0E21\u0E14\u0E1C\u0E39\u0E49\u0E0A\u0E48\u0E27\u0E22",
  // `{context}` ถูกแทนด้วยแผนก/เดือนที่ hand-off ระบุมา (หรือคำชวนให้ระบุ เมื่อยังไม่รู้)
  scheduleGreeting: [
    "\u{1F5D3}\uFE0F **\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E42\u0E2B\u0E21\u0E14\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23\u0E41\u0E25\u0E49\u0E27\u0E04\u0E23\u0E31\u0E1A**",
    "{context}",
    "",
    "\u0E1A\u0E2D\u0E01\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22\u0E27\u0E48\u0E32\u0E08\u0E30\u0E17\u0E33\u0E2D\u0E30\u0E44\u0E23\u0E15\u0E48\u0E2D \u0E40\u0E0A\u0E48\u0E19",
    '\u2022 **\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34** \u2014 \u0E1E\u0E34\u0E21\u0E1E\u0E4C *"\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23\u0E40\u0E25\u0E22"* \u0E43\u0E2B\u0E49\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E31\u0E14\u0E43\u0E2B\u0E49\u0E17\u0E31\u0E49\u0E07\u0E40\u0E14\u0E37\u0E2D\u0E19',
    "\u2022 **\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E01\u0E48\u0E2D\u0E19** \u2014 \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E1C\u0E39\u0E49\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E07\u0E32\u0E19 \xB7 \u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E40\u0E27\u0E23 \xB7 \u0E40\u0E27\u0E25\u0E32\u0E17\u0E33\u0E01\u0E32\u0E23 \xB7 \u0E01\u0E0E\u0E01\u0E32\u0E23\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23",
    '\u2022 **\u0E25\u0E07\u0E40\u0E27\u0E23\u0E40\u0E2D\u0E07** \u2014 \u0E40\u0E0A\u0E48\u0E19 *"\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 5 \u0E43\u0E2B\u0E49\u0E2A\u0E21\u0E2B\u0E0D\u0E34\u0E07 \u0E40\u0E27\u0E23 D"*',
    "",
    '\u0E1E\u0E34\u0E21\u0E1E\u0E4C *"\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"* \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E42\u0E2B\u0E21\u0E14\u0E44\u0E14\u0E49\u0E17\u0E38\u0E01\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E04\u0E23\u0E31\u0E1A'
  ].join("\n"),
  scheduleGreetingScoped: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23 **\u0E41\u0E1C\u0E19\u0E01 {department}**{period}",
  scheduleGreetingUnscoped: '\u0E40\u0E23\u0E34\u0E48\u0E21\u0E44\u0E14\u0E49\u0E42\u0E14\u0E22\u0E1A\u0E2D\u0E01\u0E41\u0E1C\u0E19\u0E01\u0E41\u0E25\u0E30\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E08\u0E30\u0E08\u0E31\u0E14\u0E01\u0E48\u0E2D\u0E19 \u0E40\u0E0A\u0E48\u0E19 *"\u0E41\u0E1C\u0E19\u0E01 ICU \u0E40\u0E14\u0E37\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32"*',
  contextTooltip: "\u0E04\u0E27\u0E32\u0E21\u0E08\u0E33\u0E02\u0E2D\u0E07\u0E41\u0E0A\u0E17\u0E19\u0E35\u0E49 \u2014 \u0E43\u0E0A\u0E49\u0E44\u0E1B\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 {used} \u0E08\u0E32\u0E01 {limit} \u0E42\u0E17\u0E40\u0E04\u0E19\n\u0E40\u0E01\u0E34\u0E19\u0E01\u0E27\u0E48\u0E32\u0E19\u0E35\u0E49 \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E40\u0E01\u0E48\u0E32\u0E2A\u0E38\u0E14\u0E08\u0E30\u0E16\u0E39\u0E01\u0E15\u0E31\u0E14\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48 AI \u0E08\u0E33\u0E44\u0E14\u0E49",
  contextTrimmed: "\u0E15\u0E2D\u0E19\u0E19\u0E35\u0E49\u0E15\u0E31\u0E14\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E40\u0E01\u0E48\u0E32\u0E1A\u0E32\u0E07\u0E2A\u0E48\u0E27\u0E19\u0E2D\u0E2D\u0E01\u0E44\u0E1B\u0E41\u0E25\u0E49\u0E27 \u2014 \u0E16\u0E49\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E2B\u0E21\u0E48\u0E43\u0E2B\u0E49\u0E01\u0E14 \u201C\u0E41\u0E0A\u0E17\u0E43\u0E2B\u0E21\u0E48\u201D"
};
function resolveLabels(overrides) {
  return overrides ? { ...defaultLabels, ...overrides } : defaultLabels;
}
function buildScheduleGreeting(labels, seed) {
  const context = seed?.departmentName ? labels.scheduleGreetingScoped.replace("{department}", seed.departmentName).replace("{period}", seed.month ? ` \u0E40\u0E14\u0E37\u0E2D\u0E19 ${seed.month}/${seed.year ?? ""}`.trimEnd() : "") : labels.scheduleGreetingUnscoped;
  return labels.scheduleGreeting.replace("{context}", context);
}

// src/ai-chat/lib/hostBridge.ts
var AI_CHAT_OPEN_EVENT = "mediact-ai-chat:open";
function openAiChat(detail = {}) {
  if (typeof window === "undefined") return false;
  const event = new CustomEvent(AI_CHAT_OPEN_EVENT, {
    detail,
    cancelable: true
  });
  window.dispatchEvent(event);
  return event.defaultPrevented;
}

// src/ai-chat/state/useAiChatSession.ts
import * as React8 from "react";

// src/ai-chat/api/aiChatApi.ts
var AiChatApiError = class extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
    this.name = "AiChatApiError";
  }
  status;
  body;
};
function createAiChatApi(config) {
  const base = config.baseUrl.replace(/\/+$/, "");
  const doFetch = config.fetchImpl ?? globalThis.fetch;
  async function request(path, init) {
    const token = await config.getToken();
    const response = await doFetch(`${base}${path}`, {
      method: init.method,
      signal: init.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        ...init.body !== void 0 ? { "Content-Type": "application/json" } : {}
      },
      body: init.body !== void 0 ? JSON.stringify(init.body) : void 0
    });
    const body = response.status === 204 ? null : await response.text().then(safeJsonParse);
    if (!response.ok) {
      throw new AiChatApiError(messageOf(body) ?? `ai-service ${init.method} ${path} \u2192 ${response.status}`, response.status, body);
    }
    return unwrap(body);
  }
  return {
    createConversation: (title, signal) => request("/v2/ai/conversations", {
      method: "POST",
      body: title ? { title } : {},
      signal
    }),
    listConversations: (signal) => request("/v2/ai/conversations", { method: "GET", signal }),
    getMessages: (conversationId, signal) => request(
      `/v2/ai/conversations/${encodeURIComponent(conversationId)}/messages`,
      { method: "GET", signal }
    ),
    connectInfo: (conversationId, signal) => request("/v2/ai/transport/subscribe", {
      method: "POST",
      body: { conversationId },
      signal
    }),
    cancelRun: (runId, signal) => request(`/v2/ai/chat/runs/${encodeURIComponent(runId)}/cancel`, {
      method: "POST",
      signal
    })
  };
}
function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
function unwrap(body) {
  if (body && typeof body === "object" && "data" in body && "status" in body) {
    return body.data;
  }
  return body;
}
function messageOf(body) {
  if (!body || typeof body !== "object") return null;
  const envelope = body;
  if (typeof envelope.message === "string" && envelope.message) return envelope.message;
  if (typeof envelope.data?.message === "string" && envelope.data.message) return envelope.data.message;
  return null;
}

// src/ai-chat/lib/sentinels.ts
var ENTER_MODE = /\[\[ENTER_MODE:([^\]]+)\]\]/;
var REDIRECT = /\[\[REDIRECT:([^\]]+)\]\]/;
var EXIT_MODE = /\[\[EXIT_MODE\]\]/;
var ANY_SENTINEL = /\[\[(?:ENTER_MODE:[^\]]+|REDIRECT:[^\]]+|EXIT_MODE)\]\]/g;
function extractEnterMode(text) {
  const match = ENTER_MODE.exec(text);
  if (!match?.[1]) return null;
  const seed = {};
  for (const part of match[1].split("|")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const key = part.slice(0, eq);
    const value = part.slice(eq + 1);
    if (key === "dept") seed.departmentId = Number(value);
    else if (key === "deptName") seed.departmentName = safeDecode(value);
    else if (key === "month") seed.month = Number(value);
    else if (key === "year") seed.year = Number(value);
  }
  return seed;
}
function hasExitMode(text) {
  return EXIT_MODE.test(text);
}
function extractRedirect(text) {
  return REDIRECT.exec(text)?.[1] ?? null;
}
function stripSentinels(text) {
  return text.replace(ANY_SENTINEL, "").trim();
}
function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// src/ai-chat/realtime/chatTransport.ts
import { Centrifuge, State } from "centrifuge";
var CONNECT_TIMEOUT_MS = 5e3;
var COMMAND_TIMEOUT_MS = 3e4;
var ChatSendTimeoutError = class extends Error {
  constructor() {
    super("\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E25\u0E49\u0E27 \u0E41\u0E15\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E15\u0E2D\u0E1A\u0E23\u0E31\u0E1A \u2014 \u0E01\u0E33\u0E25\u0E31\u0E07\u0E23\u0E2D\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E2D\u0E22\u0E39\u0E48\u0E04\u0E48\u0E30");
    this.name = "ChatSendTimeoutError";
  }
};
var CENTRIFUGE_TIMEOUT_CODE = 1;
var ChatTransport = class {
  constructor(config) {
    this.config = config;
  }
  config;
  client = null;
  subs = [];
  status = "idle";
  /** The token the current connection was opened with — what the service will forward downstream. */
  pinnedToken = null;
  /** Suppresses the transient "disconnected" blip while we deliberately re-pin the token. */
  repinning = false;
  get currentStatus() {
    return this.status;
  }
  async connect() {
    if (this.client) return;
    const token = await this.config.getToken();
    this.pinnedToken = token;
    const client = new Centrifuge(this.config.wsUrl, {
      data: { token },
      getData: async () => {
        const fresh = await this.config.getToken();
        this.pinnedToken = fresh;
        return { token: fresh };
      },
      timeout: COMMAND_TIMEOUT_MS,
      debug: this.config.debug ?? false
    });
    client.on("state", (ctx) => this.setStatus(mapState(ctx.newState)));
    client.on("error", (ctx) => this.config.onError?.(toError(ctx.error)));
    this.subs = ["chat", "task"].map((kind) => {
      const sub = client.newSubscription(this.config.channels[kind]);
      sub.on("publication", (ctx) => {
        const event = ctx.data;
        if (event && typeof event === "object" && "event" in event) {
          this.config.onEvent(event, kind);
        }
      });
      sub.on("error", (ctx) => {
        this.config.onError?.(
          new Error(`subscription ${this.config.channels[kind]}: ${toError(ctx.error).message}`)
        );
      });
      sub.subscribe();
      return sub;
    });
    this.client = client;
    this.setStatus("connecting");
    client.connect();
  }
  /**
   * Re-open the socket if the host's token changed since it was pinned. Cheap in the common case
   * (a string compare), and the reconnect only happens on the ~5-minute cadence of a real refresh.
   */
  async ensureFreshConnection() {
    if (!this.client) return;
    const token = await this.config.getToken();
    if (token === this.pinnedToken) return;
    this.repinning = true;
    try {
      this.teardown();
      await this.connect();
      await this.waitUntilConnected();
    } finally {
      this.repinning = false;
    }
  }
  /** Send one turn. Resolves with the run ticket the client tracks for streaming/cancel. */
  async send(params) {
    if (!this.client) throw new Error("ChatTransport.send called before connect()");
    await this.ensureFreshConnection();
    if (!await this.waitUntilConnected()) {
      this.client.disconnect();
      this.client.connect();
      if (!await this.waitUntilConnected()) {
        throw new Error("\u0E22\u0E31\u0E07\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E01\u0E31\u0E1A\u0E40\u0E0B\u0E34\u0E23\u0E4C\u0E1F\u0E40\u0E27\u0E2D\u0E23\u0E4C\u0E41\u0E1A\u0E1A\u0E40\u0E23\u0E35\u0E22\u0E25\u0E44\u0E17\u0E21\u0E4C\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 \u0E08\u0E36\u0E07\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48");
      }
    }
    try {
      const result = await this.client.rpc("chat.send", params);
      return result.data;
    } catch (error) {
      if (isTimeout(error)) throw new ChatSendTimeoutError();
      throw toError(error);
    }
  }
  /** Resolves true once connected, false on timeout. */
  waitUntilConnected(timeoutMs = CONNECT_TIMEOUT_MS) {
    if (this.status === "connected") return Promise.resolve(true);
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.status === "connected") finish(true);
      }, 100);
      const timeout = setTimeout(() => finish(false), timeoutMs);
      const finish = (ok) => {
        clearInterval(interval);
        clearTimeout(timeout);
        resolve(ok);
      };
    });
  }
  disconnect() {
    this.teardown();
    this.setStatus("disconnected");
  }
  teardown() {
    for (const sub of this.subs) {
      sub.unsubscribe();
      this.client?.removeSubscription(sub);
    }
    this.subs = [];
    this.client?.disconnect();
    this.client = null;
  }
  setStatus(status) {
    this.status = status;
    if (this.repinning && status !== "connected") return;
    this.config.onStatusChange?.(status);
  }
};
var CONNECTION_FAILURE = /timeout|connection|closed|unavailable|transport/i;
function isTimeout(error) {
  return typeof error === "object" && error !== null && "code" in error && error.code === CENTRIFUGE_TIMEOUT_CODE;
}
function toError(error) {
  if (error instanceof Error) return error;
  if (error && typeof error === "object" && "message" in error) {
    const { message, code } = error;
    if (CONNECTION_FAILURE.test(message)) {
      return new Error(
        "\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E02\u0E31\u0E14\u0E02\u0E49\u0E2D\u0E07\u0E0A\u0E31\u0E48\u0E27\u0E04\u0E23\u0E32\u0E27 \u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E43\u0E2B\u0E21\u0E48\u0E43\u0E2B\u0E49\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34 \u2014 \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E07\u0E44\u0E1B\u0E2D\u0E32\u0E08\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25\u0E2D\u0E22\u0E39\u0E48 \u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E30\u0E41\u0E2A\u0E14\u0E07\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E01\u0E25\u0E31\u0E1A\u0E21\u0E32\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E44\u0E14\u0E49"
      );
    }
    return new Error(code ? `${message} (code ${code})` : message);
  }
  return new Error(String(error));
}
function mapState(state) {
  switch (state) {
    case State.Connected:
      return "connected";
    case State.Connecting:
      return "connecting";
    case State.Disconnected:
      return "disconnected";
    default:
      return "idle";
  }
}

// src/ai-chat/state/useAiChatSession.ts
var MODE_ENTER_TEXT = "\u{1F5D3}\uFE0F \u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E42\u0E2B\u0E21\u0E14\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23";
var MODE_EXIT_TEXT = "\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E42\u0E2B\u0E21\u0E14\u0E08\u0E31\u0E14\u0E40\u0E27\u0E23";
var NO_ANSWER_TEXT = "(\u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E33\u0E15\u0E2D\u0E1A)";
var UNACKED_GRACE_MS = 15e4;
var UNACKED_EXPIRED_TEXT = "\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E32\u0E01\u0E23\u0E30\u0E1A\u0E1A\u0E04\u0E48\u0E30 \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E2D\u0E32\u0E08\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E16\u0E39\u0E01\u0E2A\u0E48\u0E07\u0E16\u0E36\u0E07 \u0E25\u0E2D\u0E07\u0E2A\u0E48\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E19\u0E30\u0E04\u0E30";
var initialState = {
  conversationId: null,
  messages: [],
  status: "idle",
  transportStatus: "idle",
  activeRunId: null,
  error: null,
  mode: "assistant",
  scheduleSeed: null,
  contextUsage: null
};
function reducer(state, action) {
  switch (action.type) {
    case "starting":
      return { ...state, status: "starting", error: null };
    case "started":
      return {
        ...state,
        conversationId: action.conversationId,
        messages: action.history,
        status: "ready",
        error: null,
        mode: action.mode,
        scheduleSeed: action.seed,
        // A replayed transcript carries no `done` events, so the meter has nothing to show until the
        // next turn answers. Better blank than a stale number from another conversation.
        contextUsage: null
      };
    case "transport": {
      if (action.status === "connected" && state.status === "error") {
        return { ...state, transportStatus: action.status, status: "ready", error: null };
      }
      return { ...state, transportStatus: action.status };
    }
    case "user_turn":
      return {
        ...state,
        messages: [...state.messages, action.message, action.placeholder],
        status: "sending",
        error: null
      };
    case "run_accepted":
      return { ...state, activeRunId: action.runId };
    case "event":
      return applyEvent(state, action.event);
    case "done":
      return applyDone(state, action);
    case "set_mode": {
      if (action.mode === state.mode) return state;
      const entering = action.mode === "schedule";
      const messages = [...state.messages];
      if (messages.length) messages.push(divider(entering ? MODE_ENTER_TEXT : MODE_EXIT_TEXT));
      if (entering) messages.push(assistantNote(action.greeting));
      return {
        ...state,
        mode: action.mode,
        // Re-entering scheduling by hand keeps whatever scope a previous hand-off resolved.
        scheduleSeed: entering ? action.seed ?? state.scheduleSeed : null,
        messages
      };
    }
    case "error":
      return {
        ...state,
        status: "error",
        error: action.message,
        // Put the reason INSIDE the turn that failed. Closing the placeholder silently leaves an
        // empty bubble on screen, and a status banner alone gets overwritten by whatever event
        // arrives next — the user is then left with a blank reply and no explanation.
        messages: failStreamingTurn(state.messages, action.message),
        activeRunId: null
      };
    // The send RPC timed out. Unlike `error`, this says nothing about whether the turn is running,
    // so the placeholder stays STREAMING: the answer arrives as publications on a channel keyed by
    // conversation, not by run, and it lands with or without the runId the RPC never returned.
    // Closing the turn here is what threw real answers away — `applyDone` folds `done` into the
    // last streaming message, so with none left it dropped the reply and rendered nothing. The
    // note goes in `error` for the banner only; the composer stays locked (status "sending")
    // because a turn IS in flight. The caller arms a grace timer so this cannot hang forever —
    // if no publication arrives it dispatches a real `error`, which is the way out (S11-F2).
    case "send_unacked":
      return { ...state, error: action.message };
    case "reset":
      return { ...initialState };
  }
}
function applyEvent(state, event) {
  const index = lastStreamingIndex(state.messages);
  if (index < 0) return state;
  const messages = [...state.messages];
  const turn = messages[index];
  switch (event.event) {
    case "token":
      messages[index] = { ...turn, content: turn.content + event.payload.delta };
      return { ...state, messages, status: "streaming" };
    case "tool_call": {
      const tools = [...turn.tools ?? []];
      const open = tools.findIndex(
        (t) => t.label_th === event.payload.label_th && t.status === "start"
      );
      if (open >= 0 && event.payload.status !== "start") {
        tools[open] = { ...event.payload, startedAt: tools[open].startedAt };
      } else {
        tools.push({ ...event.payload, startedAt: Date.now() });
      }
      messages[index] = { ...turn, tools };
      return { ...state, messages, status: "streaming" };
    }
    case "widget":
      messages[index] = { ...turn, widgets: [...turn.widgets ?? [], event.payload] };
      return { ...state, messages, status: "streaming" };
    case "proposal":
      messages[index] = {
        ...turn,
        content: turn.content ? `${turn.content}

${event.payload.summary_th}` : event.payload.summary_th
      };
      return { ...state, messages, status: "streaming" };
    case "task_state":
      return state;
  }
}
function applyDone(state, action) {
  const index = lastStreamingIndex(state.messages);
  if (index < 0) return { ...state, status: "ready", activeRunId: null };
  const messages = [...state.messages];
  messages[index] = {
    ...messages[index],
    content: action.content || NO_ANSWER_TEXT,
    streaming: false,
    outcome: action.payload
  };
  const enteringSchedule = Boolean(action.seed) && state.mode !== "schedule";
  const leavingSchedule = action.exit && state.mode === "schedule";
  if (enteringSchedule) {
    messages.push(divider(MODE_ENTER_TEXT), assistantNote(action.greeting));
  }
  if (leavingSchedule) messages.push(divider(MODE_EXIT_TEXT));
  return {
    ...state,
    messages,
    status: "ready",
    activeRunId: null,
    mode: action.seed ? "schedule" : action.exit ? "assistant" : state.mode,
    scheduleSeed: action.seed ?? (action.exit ? null : state.scheduleSeed),
    contextUsage: action.payload.context ?? state.contextUsage
  };
}
function lastStreamingIndex(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]?.streaming) return i;
  }
  return -1;
}
function failStreamingTurn(messages, reason) {
  const index = lastStreamingIndex(messages);
  if (index < 0) return messages;
  const next = [...messages];
  const turn = next[index];
  next[index] = {
    ...turn,
    streaming: false,
    failed: true,
    // Keep whatever streamed in before the failure; append the reason rather than losing it.
    content: turn.content ? `${turn.content}

${reason}` : reason
  };
  return next;
}
var messageSeq = 0;
var nextId = () => `m${++messageSeq}-${Date.now().toString(36)}`;
var divider = (text) => ({ id: nextId(), role: "system", content: text });
var assistantNote = (text) => ({
  id: nextId(),
  role: "assistant",
  content: text
});
function useAiChatSession(config) {
  const [state, dispatch] = React8.useReducer(reducer, initialState);
  const configRef = React8.useRef(config);
  configRef.current = config;
  const api = React8.useMemo(
    () => createAiChatApi({
      baseUrl: config.baseUrl,
      getToken: () => configRef.current.getToken(),
      fetchImpl: config.fetchImpl
    }),
    [config.baseUrl, config.fetchImpl]
  );
  const labels = React8.useMemo(() => resolveLabels(config.labels), [config.labels]);
  const labelsRef = React8.useRef(labels);
  labelsRef.current = labels;
  const transportRef = React8.useRef(null);
  const startingRef = React8.useRef(null);
  const startRef = React8.useRef(null);
  const stateRef = React8.useRef(state);
  stateRef.current = state;
  const streamRef = React8.useRef("");
  const storageKey = `mediact-ai-chat:conversation:${config.baseUrl}`;
  const reportError = React8.useCallback((error, fallback) => {
    const err = error instanceof Error ? error : new Error(fallback);
    configRef.current.onError?.(err);
    dispatch({ type: "error", message: err.message || fallback });
  }, []);
  const unackedTimerRef = React8.useRef(null);
  const clearUnackedGrace = React8.useCallback(() => {
    if (!unackedTimerRef.current) return;
    clearTimeout(unackedTimerRef.current);
    unackedTimerRef.current = null;
  }, []);
  const armUnackedGrace = React8.useCallback(() => {
    clearUnackedGrace();
    unackedTimerRef.current = setTimeout(() => {
      unackedTimerRef.current = null;
      dispatch({ type: "error", message: UNACKED_EXPIRED_TEXT });
    }, UNACKED_GRACE_MS);
  }, [clearUnackedGrace]);
  React8.useEffect(() => clearUnackedGrace, [clearUnackedGrace]);
  const handleEvent = React8.useCallback((event) => {
    clearUnackedGrace();
    if (event.event !== "done") {
      if (event.event === "token") streamRef.current += event.payload.delta;
      dispatch({ type: "event", event });
      return;
    }
    const raw = streamRef.current;
    streamRef.current = "";
    const redirect = extractRedirect(raw);
    if (redirect && typeof window !== "undefined") {
      window.open(redirect, "_blank", "noopener,noreferrer");
    }
    const seed = extractEnterMode(raw);
    dispatch({
      type: "done",
      payload: event.payload,
      content: stripSentinels(raw),
      seed,
      exit: hasExitMode(raw),
      greeting: buildScheduleGreeting(labelsRef.current, seed)
    });
  }, []);
  const start = React8.useCallback(
    async (conversationId) => {
      if (transportRef.current && !conversationId) return;
      if (startingRef.current) return startingRef.current;
      const run = (async () => {
        dispatch({ type: "starting" });
        try {
          transportRef.current?.disconnect();
          transportRef.current = null;
          const remembered = conversationId ?? readStored(storageKey);
          let id;
          let transcript = [];
          if (remembered) {
            try {
              transcript = await api.getMessages(remembered);
              id = remembered;
            } catch {
              id = (await api.createConversation()).id;
            }
          } else {
            id = (await api.createConversation()).id;
          }
          writeStored(storageKey, id);
          const { messages, mode, seed } = replayTranscript(transcript);
          const info = await api.connectInfo(id);
          if (!info.wsUrl) {
            throw new Error(
              "ai-service \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32 transport (\u0E44\u0E21\u0E48\u0E21\u0E35 wsUrl) \u2014 \u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E14\u0E39\u0E41\u0E25\u0E23\u0E30\u0E1A\u0E1A"
            );
          }
          const transport = new ChatTransport({
            wsUrl: info.wsUrl,
            channels: info.channels,
            getToken: () => configRef.current.getToken(),
            debug: configRef.current.debug,
            onEvent: handleEvent,
            onStatusChange: (status) => {
              dispatch({ type: "transport", status });
              if (status === "connected" && stateRef.current.status === "error") {
                const current = stateRef.current.conversationId;
                if (current) void startRef.current?.(current);
              }
            },
            onError: (error) => configRef.current.onError?.(error)
          });
          await transport.connect();
          transportRef.current = transport;
          dispatch({ type: "started", conversationId: id, history: messages, mode, seed });
        } catch (error) {
          reportError(error, "\u0E40\u0E1B\u0E34\u0E14\u0E2B\u0E49\u0E2D\u0E07\u0E2A\u0E19\u0E17\u0E19\u0E32\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08");
        } finally {
          startingRef.current = null;
        }
      })();
      startingRef.current = run;
      return run;
    },
    [api, handleEvent, reportError, storageKey]
  );
  startRef.current = start;
  const send = React8.useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const transport = transportRef.current;
      const conversationId = state.conversationId;
      if (!transport || !conversationId) {
        reportError(new Error("\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E2B\u0E49\u0E2D\u0E07\u0E2A\u0E19\u0E17\u0E19\u0E32"), "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D");
        return;
      }
      streamRef.current = "";
      dispatch({
        type: "user_turn",
        message: { id: nextId(), role: "user", content: trimmed },
        placeholder: { id: nextId(), role: "assistant", content: "", streaming: true }
      });
      try {
        const { scope } = configRef.current;
        const ticket = await transport.send({
          conversationId,
          message: trimmed,
          mode: state.mode,
          ...scope,
          // A scheduling hand-off already resolved dept/month — carry it so the agent doesn't re-ask.
          ...state.mode === "schedule" ? state.scheduleSeed : null
        });
        dispatch({ type: "run_accepted", runId: ticket.runId });
      } catch (error) {
        if (error instanceof ChatSendTimeoutError) {
          dispatch({ type: "send_unacked", message: error.message });
          armUnackedGrace();
          return;
        }
        reportError(error, "\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08");
      }
    },
    [state.conversationId, state.mode, state.scheduleSeed, reportError, armUnackedGrace]
  );
  const cancel = React8.useCallback(async () => {
    const runId = state.activeRunId;
    if (!runId) return;
    try {
      await api.cancelRun(runId);
    } catch (error) {
      configRef.current.onError?.(
        error instanceof Error ? error : new Error("\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08")
      );
    }
  }, [api, state.activeRunId]);
  const newConversation = React8.useCallback(() => {
    transportRef.current?.disconnect();
    transportRef.current = null;
    streamRef.current = "";
    writeStored(storageKey, null);
    dispatch({ type: "reset" });
  }, [storageKey]);
  const setMode = React8.useCallback((mode, seed) => {
    const effectiveSeed = seed ?? stateRef.current.scheduleSeed;
    dispatch({
      type: "set_mode",
      mode,
      seed: seed ?? null,
      greeting: buildScheduleGreeting(labelsRef.current, effectiveSeed)
    });
  }, []);
  const listConversations = React8.useCallback(() => api.listConversations(), [api]);
  React8.useEffect(() => {
    return () => {
      transportRef.current?.disconnect();
      transportRef.current = null;
    };
  }, []);
  return {
    state,
    start,
    send,
    cancel,
    newConversation,
    setMode,
    listConversations,
    api
  };
}
function replayTranscript(transcript) {
  let seed = null;
  const messages = transcript.map((message) => {
    if (message.role === "assistant") {
      const entered = extractEnterMode(message.content);
      if (entered) seed = entered;
      if (hasExitMode(message.content)) seed = null;
    }
    return {
      id: nextId(),
      role: message.role,
      // Sentinels are directives, never text — and replay must not re-trigger them either.
      content: message.role === "assistant" ? stripSentinels(message.content) : message.content,
      // A pending change outlives the socket, so its confirm card has to as well: without this, reloading
      // mid-handshake left the reply's "กดยืนยันได้เลย" pointing at buttons that no longer existed. The
      // service only sends back a card that can still be answered, so anything here is safe to render.
      widgets: message.widget ? [message.widget] : void 0
    };
  });
  return { messages, mode: seed ? "schedule" : "assistant", seed };
}
function readStored(key) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key) || null;
  } catch {
    return null;
  }
}
function writeStored(key, value) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
  }
}

// src/ai-chat/AiChatWidget.tsx
import { Fragment as Fragment3, jsx as jsx11, jsxs as jsxs10 } from "react/jsx-runtime";
var DEFAULT_SUGGESTIONS = [
  "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 6 \u0E43\u0E04\u0E23\u0E02\u0E36\u0E49\u0E19\u0E40\u0E27\u0E23\u0E40\u0E0A\u0E49\u0E32\u0E1A\u0E49\u0E32\u0E07",
  "\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E19\u0E35\u0E49\u0E21\u0E35\u0E40\u0E27\u0E23\u0E44\u0E2B\u0E19\u0E04\u0E19\u0E44\u0E21\u0E48\u0E1E\u0E2D",
  "\u0E15\u0E2D\u0E19\u0E19\u0E35\u0E49\u0E41\u0E1C\u0E19\u0E01\u0E40\u0E1B\u0E34\u0E14\u0E01\u0E0E\u0E2D\u0E30\u0E44\u0E23\u0E2D\u0E22\u0E39\u0E48\u0E1A\u0E49\u0E32\u0E07"
];
function AiChatWidget({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  hideLauncher,
  className,
  ...config
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React9.useState(defaultOpen);
  const isControlled = controlledOpen !== void 0;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = React9.useCallback(
    (next) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );
  const getToken = React9.useMemo(
    () => resolveTokenProvider(config.auth, config.getToken, config.onError),
    [config.auth, config.getToken, config.onError]
  );
  const session = useAiChatSession(React9.useMemo(() => ({ ...config, getToken }), [config, getToken]));
  const labels = React9.useMemo(() => resolveLabels(config.labels), [config.labels]);
  const position = config.position ?? "bottom-right";
  const suggestions = config.suggestions ?? DEFAULT_SUGGESTIONS;
  const { setMode } = session;
  React9.useEffect(() => {
    if (config.mode) setMode(config.mode);
  }, [config.mode, setMode]);
  React9.useEffect(() => {
    if (open) void session.start();
  }, [open, session.start]);
  const [hostRequest, setHostRequest] = React9.useState(null);
  React9.useEffect(() => {
    const onOpen = (event) => {
      event.preventDefault();
      const detail = event.detail ?? {};
      if (detail.message?.trim()) setHostRequest(detail);
      setOpen(true);
    };
    window.addEventListener(AI_CHAT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(AI_CHAT_OPEN_EVENT, onOpen);
  }, [setOpen]);
  const { status: sessionStatus, mode: sessionMode } = session.state;
  const { setMode: sessionSetMode, send: sessionSend } = session;
  React9.useEffect(() => {
    if (!hostRequest?.message) return;
    if (sessionStatus === "error") {
      setHostRequest(null);
      return;
    }
    if (sessionStatus !== "ready") return;
    if (hostRequest.mode && sessionMode !== hostRequest.mode) {
      sessionSetMode(hostRequest.mode);
      return;
    }
    setHostRequest(null);
    void sessionSend(hostRequest.message);
  }, [hostRequest, sessionStatus, sessionMode, sessionSetMode, sessionSend]);
  const handleSend = React9.useCallback(
    (text) => {
      void session.send(text);
    },
    [session.send]
  );
  const handlePickConversation = React9.useCallback(
    (conversationId) => {
      void session.start(conversationId);
    },
    [session.start]
  );
  const handleNewChat = React9.useCallback(() => {
    session.newConversation();
    void session.start();
  }, [session.newConversation, session.start]);
  const handleRetry = React9.useCallback(() => {
    const current = session.state.conversationId;
    if (current) {
      void session.start(current);
      return;
    }
    session.newConversation();
    void session.start();
  }, [session.state.conversationId, session.newConversation, session.start]);
  return /* @__PURE__ */ jsxs10(Fragment3, { children: [
    !hideLauncher && /* @__PURE__ */ jsx11(
      FloatingButton,
      {
        open,
        onClick: () => setOpen(!open),
        label: open ? labels.minimize : labels.launcher,
        position,
        className
      }
    ),
    /* @__PURE__ */ jsx11(
      ChatDrawer,
      {
        open,
        onOpenChange: setOpen,
        messages: session.state.messages,
        status: session.state.status,
        transportStatus: session.state.transportStatus,
        error: session.state.error,
        activeConversationId: session.state.conversationId,
        labels,
        position,
        mode: session.state.mode,
        onModeChange: setMode,
        showModeToggle: config.showModeToggle,
        contextUsage: session.state.contextUsage,
        suggestions,
        onSend: handleSend,
        onCancel: () => void session.cancel(),
        onNewChat: handleNewChat,
        onPickConversation: handlePickConversation,
        onRetry: handleRetry,
        loadConversations: session.listConversations
      }
    )
  ] });
}
export {
  AI_CHAT_OPEN_EVENT,
  AiChatApiError,
  AiChatWidget,
  ChatDrawer,
  ChatTransport,
  Composer,
  ContextMeter,
  ConversationPicker,
  FloatingButton,
  Markdown,
  MessageBubble,
  MessageList,
  SelfAuth,
  ToolTrail,
  WidgetRenderer,
  buildScheduleGreeting,
  cn,
  createAiChatApi,
  defaultLabels,
  extractEnterMode,
  extractRedirect,
  hasExitMode,
  openAiChat,
  resolveLabels,
  resolveTokenProvider,
  stripSentinels,
  useAiChatSession
};
//# sourceMappingURL=index.js.map