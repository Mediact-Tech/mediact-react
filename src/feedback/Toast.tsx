import * as React from "react";
import { Toaster as SonnerToaster } from "sonner";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

export { toast } from "sonner";

export type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

const baseToast =
  "flex items-center gap-3 rounded-sm border px-5 py-3 shadow-sm font-semibold text-base [&_svg]:size-6 [&_svg]:shrink-0";

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
 * Note for monorepo consumers using a workspace dev import (e.g. Storybook
 * importing `@mediact/react` via the package's `dist`): make sure your dev
 * resolver aliases `@mediact/react` to `packages/react/src/index.ts` so the
 * Toaster and `toast()` call share the same `sonner` module instance. Without
 * this, sonner's singleton state silently desyncs and toasts won't render.
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
          description: "text-sm font-medium opacity-90",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
