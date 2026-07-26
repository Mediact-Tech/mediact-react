import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContextMeter } from "./ContextMeter";
import { defaultLabels } from "../labels";

/**
 * The meter's whole job is to be trustworthy about when the conversation starts losing its oldest turns,
 * so what it must never do is show a number the service did not measure, or read "fine" once trimming has
 * already begun.
 */
const render = (usage: Parameters<typeof ContextMeter>[0]["usage"]) =>
  renderToStaticMarkup(<ContextMeter usage={usage} labels={defaultLabels} />);

describe("ContextMeter", () => {
  it("renders nothing at all until the service has measured something", () => {
    expect(render(null)).toBe("");
    expect(render({ used: 100, limit: 0 })).toBe(""); // a limit of 0 is not a scale
  });

  it("shows the share used and the real token counts in the tooltip", () => {
    const html = render({ used: 2000, limit: 8000 });
    expect(html).toContain("25%");
    expect(html).toContain("2,000");
    expect(html).toContain("8,000");
  });

  it("warns before the cliff, not after", () => {
    expect(render({ used: 6300, limit: 8000 })).toContain("bg-brand-active"); // 79%
    expect(render({ used: 6500, limit: 8000 })).toContain("bg-warning-yellow-400"); // 81%
  });

  it("reads as over once messages have actually been dropped, even at a low fill", () => {
    const html = render({ used: 500, limit: 8000, trimmed: true });
    expect(html).toContain("bg-error-red-600");
    expect(html).toContain(defaultLabels.contextTrimmed);
  });

  it("keeps an over-budget bar inside its track while still reporting the true figure", () => {
    const html = render({ used: 12000, limit: 8000 });
    expect(html).toContain("150%"); // the truth, in the label
    expect(html).toContain("width:100%"); // but the bar cannot overflow
  });
});
