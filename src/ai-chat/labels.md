# ai-chat — copy and language

Every string the widget renders itself lives in `labels.ts`. Two sets ship: `th` (primary) and `en`.
A host picks one with `locale` and may override any subset with `labels`.

```tsx
<AiChatWidget locale={i18n.resolvedLanguage?.startsWith("th") ? "th" : "en"} … />
```

## The rule

`resolveLabels(overrides, locale)` picks the base set **first**, then merges the overrides on top.
The order matters: merging onto Thai and then switching would leave an English panel with ~40 Thai
strings the host never asked to keep.

`labelsByLocale` is a closed map of two. A host that needs a third language injects a full `labels`
object instead — that path was always open and needs no change here.

## What `locale` does NOT reach

🔴 **The service's own copy stays Thai.** `mediact-ai-service` returns `label_th`, `title_th`,
`summary_th`, `message_th` on the wire — there is no English counterpart in the contract. So with
`locale="en"` the panel chrome is English while these remain Thai:

| surface | field | rendered by |
|---|---|---|
| tool trail rows | `tool.label_th` | `ToolTrail.tsx` |
| confirm card title/summary | `payload.title_th` · `payload.summary_th` | `WidgetRenderer.tsx` · `ConfirmCard.tsx` |
| suggested fixes | `fix.label_th` | `WidgetRenderer.tsx` |
| error explanations | `payload.message_th` | `WidgetRenderer.tsx` |
| the assistant's replies | model output | — |

Closing that gap is a **backend change** (an `Accept-Language`-aware field, or `*_en` beside `*_th`),
not something a label set can fix. Do not paper over it with a client-side lookup table: the strings
are generated per turn, not drawn from a fixed vocabulary.

## Traps this file already paid for

- **`th-TH` was hardcoded in `ConversationPicker.relativeTime`.** Rows younger than a day never reach
  that branch, so an English panel looked correct until a conversation aged past 24 h and printed a
  Buddhist-era date. The BCP-47 tag is therefore a **label** (`dateLocale`), changing together with
  the words, not a separate prop that can drift.
- **The month fragment of the scheduling greeting was a template literal** (`` ` เดือน ${month}/…` ``)
  inlined in `buildScheduleGreeting`, so an English `scheduleGreetingScoped` still rendered a Thai
  word in the middle of itself. It is now `scheduleGreetingPeriod`. `scheduleGreetingSubUnit` was
  added the same way rather than inlined, for the same reason.
- **Suggestion chips are sent verbatim as the user's first message**, so they follow the UI language,
  not the model's. A chip read in English that sends Thai reads as a bug in the widget.
- **The host must pass its *current* language.** The widget is mounted once at a root layout and never
  remounts; a value read once at mount freezes the chat in whatever language the user started in.

## Guard

`labels.test.ts` pins: identical key sets, no empty values, **no Thai characters anywhere in `en`**,
identical `{placeholder}` tokens per key, `dateLocale` genuinely different, and that overrides layer
onto the chosen locale. Verified by mutation — a Thai value left in `en`, a dropped `{count}`, and a
base pinned to Thai each fail it.

## Decision log

| date | decision | cost accepted |
|---|---|---|
| 2026-08-16 | Ship `en` in the DS + a `locale` prop, rather than making each app author ~45 strings | Two copy sets to keep in step; the guard test is what keeps them honest |
| 2026-08-16 | `dateLocale` lives in `labels`, not as its own prop | A tag is not "copy"; accepted because it must change with the words or dates drift out of language |
| 2026-08-16 | `AiChatLocale` is a closed union of `th \| en` | A third language needs a full injected `labels`; adding a member without a set would render `undefined` |
| 2026-08-16 | `defaultLabels` kept as an alias of `thLabels` | Dead-ish name, but three apps and one test import it — renaming buys nothing |
| 2026-08-26 | The scheduling greeting names the **ward** after the department | One more optional fragment to keep out of the way when the hand-off carried no ward; the alternative — letting the first tool call reveal the ward — puts the scope on screen only after the user has already asked for something |
| 2026-08-26 | No emoji in the greeting or the mode divider | The calendar glyph was the only thing marking the mode change in the transcript; the divider's own rule and its words carry it instead, and the drawer header states the mode continuously |
