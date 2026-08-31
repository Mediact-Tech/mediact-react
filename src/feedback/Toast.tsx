import * as React from "react";
import { Toaster as SonnerToaster } from "sonner";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

export { toast } from "sonner";

export type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

const baseToast =
  "flex items-center gap-3 rounded-sm border px-5 py-3 shadow-sm font-semibold text-body-md [&_svg]:size-6 [&_svg]:shrink-0";

// Tone classes use `!` (important) because Sonner applies BOTH the `default`
// class AND the `<type>` class on the same element. Without `!`, Tailwind's
// cascade order can let `bg-white` / icon `text-text-primary` (default)
// override the tone-specific colors at runtime.
const tones = {
  success:
    "bg-success-green-50! border-success-green-200! text-success-green-800! [&_svg]:text-success-green-primary!",
  error:
    "bg-cherry-red-50! border-cherry-red-200! text-cherry-red-800! [&_svg]:text-cherry-red-600!",
  warning:
    "bg-warning-yellow-50! border-warning-yellow-200! text-warning-yellow-800! [&_svg]:text-warning-yellow-600!",
  info: "bg-info-blue-50! border-info-blue-200! text-info-blue-800! [&_svg]:text-info-blue-primary!",
  default:
    "bg-white border-border-default text-brand [&_svg]:text-brand",
};

/**
 * Mount once near the app root. All `toast.*` calls render through this.
 *
 * 🔴 `toast()` and `<Toaster>` MUST resolve the same `sonner` module instance.
 * sonner keeps its queue in module state, so two copies = two queues: the call
 * enqueues on one, the mounted Toaster listens to the other, and **nothing
 * renders — no error, no warning**.
 *
 * `sonner` is therefore a **peerDependency**, not a dependency (2026-08-31).
 * While it was a dependency, every consumer pinning a different major got a
 * nested `node_modules/@mediact/react/node_modules/sonner` and the singleton
 * split in two. Measured across the four apps: three pin `sonner@^2.0.7` while
 * this package asked for `^1.7.4` — all three carried the duplicate. None had
 * hit it yet only because none had adopted this `Toaster`; the first adopter
 * would have.
 *
 * The declared range is `^2.0.0`, not `^1.7.4 || ^2.0.0`. The API used here
 * (`position` · `duration` · `icons` · `toastOptions.unstyled` · the eight
 * `classNames` keys) exists in both majors, but only v2 is ever installed,
 * typechecked or tested here — declaring a v1 half nobody exercises would be a
 * promise this package cannot keep. All three apps that declare `sonner` are
 * already on `^2.0.7`.
 *
 * 🔴 **Consumers must add `sonner` to their own `package.json`.** Do not rely on
 * a package manager to fill the peer in: `npm install` and bun do, but
 * **`npm ci` does not** — it installs the lockfile and nothing else, so a
 * consumer that only bumps the tag and rebuilds in CI gets a tree with no
 * `sonner` at all. That is not "toasts don't render", it is
 * `Module not found: Can't resolve 'sonner'` and the whole app fails to build,
 * because `src/index.ts` re-exports this file and every barrel import reaches
 * it. yarn 1 and pnpm without `auto-install-peers` behave the same way.
 *
 * Same rule for a monorepo dev import (e.g. Storybook importing this package
 * via `dist`): alias `@mediact/react` to `packages/react/src/index.ts` so both
 * sides share one instance.
 *
 * @example
 * <Toaster position="top-right" />
 */
function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="top-right"
      duration={4000}
      icons={{
        success: <CheckCircle2 strokeWidth={2.25} />,
        error: <XCircle strokeWidth={2.25} />,
        warning: <AlertTriangle strokeWidth={2.25} />,
        info: <Info strokeWidth={2.25} />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: baseToast,
          default: tones.default,
          success: tones.success,
          error: tones.error,
          warning: tones.warning,
          info: tones.info,
          title: "leading-tight",
          description: "text-body-sm font-medium opacity-90",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
