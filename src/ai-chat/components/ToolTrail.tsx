import * as React from "react";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import type { ToolCallEntry } from "../types";
import { cn } from "../lib/cn";

/**
 * RR-A.6 transparency trail — what the agent actually did this turn, in the service's own
 * Thai labels. Rendered above the answer so a long tool run never looks like a hang.
 */
export function ToolTrail({ tools }: { tools: ToolCallEntry[] }) {
  if (tools.length === 0) return null;

  return (
    <ul className="mb-2 flex flex-col gap-1" data-slot="ai-chat-tool-trail">
      {tools.map((tool, index) => (
        <li
          key={`${tool.label_th}-${index}`}
          className={cn(
            "flex items-center gap-1.5 text-caption",
            tool.status === "error" ? "text-error-red-600" : "text-gray-500",
          )}
        >
          <ToolIcon status={tool.status} />
          <span className={cn(tool.status === "done" && "line-through decoration-gray-300")}>
            {tool.label_th}
          </span>
          {tool.status === "start" && <Elapsed since={tool.startedAt} />}
        </li>
      ))}
    </ul>
  );
}

/**
 * Live seconds counter for a running tool. The auto-schedule solve takes ~90s — without a moving
 * number a correct run is indistinguishable from a hung one.
 */
function Elapsed({ since }: { since: number }) {
  const [seconds, setSeconds] = React.useState(() => elapsedSeconds(since));

  React.useEffect(() => {
    const timer = setInterval(() => setSeconds(elapsedSeconds(since)), 1000);
    return () => clearInterval(timer);
  }, [since]);

  if (seconds < 3) return null;
  return <span className="tabular-nums opacity-60">({seconds} วิ)</span>;
}

const elapsedSeconds = (since: number) => Math.floor((Date.now() - since) / 1000);

function ToolIcon({ status }: { status: ToolCallEntry["status"] }) {
  if (status === "start") return <Loader2 className="size-3.5 shrink-0 animate-spin" />;
  if (status === "error") return <TriangleAlert className="size-3.5 shrink-0" />;
  return <Check className="size-3.5 shrink-0 text-success-green-600" />;
}
