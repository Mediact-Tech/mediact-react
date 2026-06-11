/**
 * Pure layout math for TimeGrid (Pattern B).
 * No React imports — fully unit-testable.
 */

/** Parse 24h "HH:mm" into minutes since midnight. Returns NaN if malformed. */
export function parseTimeToMinutes(time: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return NaN;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return NaN;
  return hours * 60 + minutes;
}

export type EventLayoutInput = {
  id: string;
  /** 24h "HH:mm". */
  start: string;
  /** 24h "HH:mm". */
  end: string;
};

export type EventLayout = {
  id: string;
  /** Pixels from the top of the time window. */
  top: number;
  /** Pixel height. */
  height: number;
  /** CSS percentage, e.g. "0%" / "50%". */
  left: string;
  /** CSS percentage, e.g. "100%" / "50%". */
  width: string;
  /** 0-based overlap column index. */
  column: number;
  /** Total overlap columns in this event's cluster. */
  totalColumns: number;
};

/** Minimum rendered duration (minutes) so zero/short events stay visible. */
const MIN_RENDER_MINUTES = 15;

type Positioned = EventLayoutInput & {
  startMin: number;
  endMin: number;
  column: number;
};

/**
 * Compute absolute positions for events within a time window.
 *
 * Overlapping events in the same cluster are laid out side-by-side:
 * each takes the leftmost free column, width = 100% / cluster columns.
 * Events fully outside the window are dropped; partial ones are clamped.
 */
export function computeEventLayouts(
  events: EventLayoutInput[],
  windowStart: string,
  windowEnd: string,
  pixelsPerMinute: number,
): EventLayout[] {
  const winStart = parseTimeToMinutes(windowStart);
  const winEnd = parseTimeToMinutes(windowEnd);
  if (Number.isNaN(winStart) || Number.isNaN(winEnd) || winEnd <= winStart) {
    return [];
  }

  // Normalize: parse, clamp to window, drop invalid/outside events.
  const valid: Positioned[] = [];
  for (const event of events) {
    let startMin = parseTimeToMinutes(event.start);
    let endMin = parseTimeToMinutes(event.end);
    if (Number.isNaN(startMin) || Number.isNaN(endMin)) continue;
    if (endMin <= startMin) endMin = startMin + MIN_RENDER_MINUTES;
    if (endMin <= winStart || startMin >= winEnd) continue;
    startMin = Math.max(startMin, winStart);
    endMin = Math.min(endMin, winEnd);
    valid.push({ ...event, startMin, endMin, column: 0 });
  }

  valid.sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

  // Cluster overlapping events, assign greedy column indices.
  const layouts: EventLayout[] = [];
  let cluster: Positioned[] = [];
  let clusterEnd = -1;

  const flushCluster = () => {
    if (cluster.length === 0) return;
    const totalColumns =
      Math.max(...cluster.map((event) => event.column)) + 1;
    for (const event of cluster) {
      layouts.push({
        id: event.id,
        top: (event.startMin - winStart) * pixelsPerMinute,
        height: Math.max(
          (event.endMin - event.startMin) * pixelsPerMinute,
          MIN_RENDER_MINUTES * pixelsPerMinute,
        ),
        left: `${(event.column * 100) / totalColumns}%`,
        width: `${100 / totalColumns}%`,
        column: event.column,
        totalColumns,
      });
    }
    cluster = [];
  };

  for (const event of valid) {
    if (cluster.length > 0 && event.startMin >= clusterEnd) {
      flushCluster();
      clusterEnd = -1;
    }
    // Greedy: take the lowest column free at this event's start time.
    const used = new Set(
      cluster
        .filter((other) => other.endMin > event.startMin)
        .map((other) => other.column),
    );
    let column = 0;
    while (used.has(column)) column += 1;
    event.column = column;
    cluster.push(event);
    clusterEnd = Math.max(clusterEnd, event.endMin);
  }
  flushCluster();

  return layouts;
}

export type FreeGap = {
  /** Pixels from the top of the time window. */
  top: number;
  /** Pixel height. */
  height: number;
  /** Gap start in minutes since midnight. */
  startMinutes: number;
};

/**
 * Free (event-less) intervals within the window, in pixels.
 * Used to position "add" placeholders. Gaps shorter than `minMinutes`
 * are skipped.
 */
export function computeFreeGaps(
  events: EventLayoutInput[],
  windowStart: string,
  windowEnd: string,
  pixelsPerMinute: number,
  minMinutes = 30,
): FreeGap[] {
  const winStart = parseTimeToMinutes(windowStart);
  const winEnd = parseTimeToMinutes(windowEnd);
  if (Number.isNaN(winStart) || Number.isNaN(winEnd) || winEnd <= winStart) {
    return [];
  }

  const intervals = events
    .map((event) => ({
      start: Math.max(parseTimeToMinutes(event.start), winStart),
      end: Math.min(parseTimeToMinutes(event.end), winEnd),
    }))
    .filter(
      (interval) =>
        !Number.isNaN(interval.start) &&
        !Number.isNaN(interval.end) &&
        interval.end > interval.start,
    )
    .sort((a, b) => a.start - b.start);

  const gaps: FreeGap[] = [];
  let cursor = winStart;
  for (const interval of intervals) {
    if (interval.start - cursor >= minMinutes) {
      gaps.push({
        top: (cursor - winStart) * pixelsPerMinute,
        height: (interval.start - cursor) * pixelsPerMinute,
        startMinutes: cursor,
      });
    }
    cursor = Math.max(cursor, interval.end);
  }
  if (winEnd - cursor >= minMinutes) {
    gaps.push({
      top: (cursor - winStart) * pixelsPerMinute,
      height: (winEnd - cursor) * pixelsPerMinute,
      startMinutes: cursor,
    });
  }
  return gaps;
}
