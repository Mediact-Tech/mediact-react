import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FloatingButton } from "./FloatingButton";
import { defaultLabels } from "../labels";

/**
 * The launcher is the SECOND dismiss control on screen while the drawer is open, so it has to teach the
 * same thing the drawer's own header button does. It used to show an ✕ — two corners of the screen both
 * telling the user that leaving the panel throws the conversation away.
 */
const html = (over: Partial<Parameters<typeof FloatingButton>[0]> = {}) =>
  renderToStaticMarkup(
    <FloatingButton open onClick={vi.fn()} label={defaultLabels.minimize} position="bottom-right" {...over} />,
  );

describe("FloatingButton", () => {
  it("collapses with a chevron while the drawer is open, never an ✕", () => {
    expect(html()).toContain("lucide-chevrons-right");
    expect(html()).not.toContain("lucide-x");
  });

  it("mirrors the chevron with the drawer's side", () => {
    expect(html({ position: "bottom-left" })).toContain("lucide-chevrons-left");
  });

  it("still invites people in when the drawer is shut — sparkle plus the words", () => {
    const closed = renderToStaticMarkup(
      <FloatingButton open={false} onClick={vi.fn()} label={defaultLabels.launcher} />,
    );
    expect(closed).toContain("lucide-sparkles");
    expect(closed).toContain(defaultLabels.launcher);
  });
});
