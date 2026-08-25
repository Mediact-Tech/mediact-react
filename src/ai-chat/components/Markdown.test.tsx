import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Markdown } from "./Markdown";
import { defaultLabels } from "../labels";

/**
 * Links the assistant writes are deep links into the host app ("ดูตารางใน Mediwork"), and the two ways
 * to open one are not interchangeable: this tab tears down the page the conversation is about — the
 * socket with it — while a new tab every time leaves a trail behind somebody who only wanted to get to
 * the screen they were pointed at. The widget cannot infer which one a click means, so it asks.
 */
const LINK = "ไปที่ [ตารางเวร](https://mediwork.example.com/schedules)";

describe("Markdown — link opening is the reader's choice", () => {
  const openSpy = vi.fn();
  let assign: unknown;

  beforeEach(() => {
    vi.stubGlobal("open", openSpy);
    assign = window.location.assign;
    Object.defineProperty(window.location, "assign", { value: vi.fn(), configurable: true });
  });

  afterEach(() => {
    openSpy.mockReset();
    Object.defineProperty(window.location, "assign", { value: assign, configurable: true });
    vi.unstubAllGlobals();
  });

  /**
   * Dispatches the click INSIDE `act` and hands the event back.
   *
   * 🔴 Both halves matter. Without `act` the state update has not flushed when the assertion runs, so
   * `queryByRole(...)` returns null whatever the component did — three of these tests passed against a
   * deliberately broken component before this was fixed. And the returned event is the only way to
   * assert the interception itself: happy-dom does not navigate, so "did not navigate" is invisible;
   * `defaultPrevented` is the observable fact.
   */
  const clickLink = async (init: MouseEventInit = {}, markdown = LINK) => {
    render(<Markdown text={markdown} labels={defaultLabels} />);
    const link = await screen.findByRole("link", { name: /ตารางเวร|หัวข้อ/ });
    const event = new MouseEvent("click", { bubbles: true, cancelable: true, ...init });
    await act(async () => {
      link.dispatchEvent(event);
    });
    return event;
  };

  it("asks instead of navigating, and names the host so the reader knows where they are going", async () => {
    const event = await clickLink();
    expect(event.defaultPrevented).toBe(true);
    await waitFor(() => expect(screen.getByRole("menu")).toBeTruthy());
    expect(screen.getByText("mediwork.example.com")).toBeTruthy();
    expect(window.location.assign).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it("opens in this tab when asked", async () => {
    await clickLink();
    await waitFor(() => expect(screen.getByRole("menu")).toBeTruthy());
    screen.getByRole("menuitem", { name: defaultLabels.linkOpenHere }).click();
    expect(window.location.assign).toHaveBeenCalledWith("https://mediwork.example.com/schedules");
    expect(openSpy).not.toHaveBeenCalled();
  });

  it("opens a new tab when asked — with `noopener`, since the href came from model output", async () => {
    await clickLink();
    await waitFor(() => expect(screen.getByRole("menu")).toBeTruthy());
    screen.getByRole("menuitem", { name: defaultLabels.linkOpenNewTab }).click();
    expect(openSpy).toHaveBeenCalledWith(
      "https://mediwork.example.com/schedules",
      "_blank",
      "noopener,noreferrer",
    );
    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it("closes without navigating when the reader changes their mind", async () => {
    await clickLink();
    await waitFor(() => expect(screen.getByRole("menu")).toBeTruthy());
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(window.location.assign).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
  });

  /**
   * A modifier-click is the reader stating their intent in the browser's own language. Putting a menu in
   * front of it would override a decision that has already been made.
   *
   * ⚠️ The other half of that guarantee — `target="_blank"` + `rel` surviving on the anchor as the
   * fallback — is NOT asserted here and cannot be: those attributes are written by a DOMPurify
   * `afterSanitizeAttributes` hook, and under happy-dom the sanitizer does not produce them (measured:
   * the rendered anchor carries neither, while the same input in a browser carries both). Asserting it
   * here would only pin the test environment's behaviour.
   */
  it("does not intercept a modifier-click", async () => {
    const event = await clickLink({ metaKey: true });
    expect(event.defaultPrevented).toBe(false);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("leaves in-page anchors alone — a jump inside the answer is not a navigation choice", async () => {
    const event = await clickLink({}, "[หัวข้อ](#section)");
    expect(event.defaultPrevented).toBe(false);
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
