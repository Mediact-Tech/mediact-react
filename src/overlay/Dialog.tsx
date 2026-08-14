import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../lib/cn";

const Dialog = RadixDialog.Root;
const DialogTrigger = RadixDialog.Trigger;
const DialogPortal = RadixDialog.Portal;
const DialogClose = RadixDialog.Close;

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RadixDialog.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <RadixDialog.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className,
      )}
      {...props}
    />
  );
});

type DialogContentProps = React.ComponentProps<typeof RadixDialog.Content> & {
  size?: "sm" | "md" | "lg" | "xl";
  /** Show the built-in close (×) button. Default `true`. */
  showClose?: boolean;
};

const sizeClasses: Record<NonNullable<DialogContentProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(
    { className, children, size = "md", showClose = true, ...props },
    ref,
  ) {
    return (
      <DialogPortal>
        <DialogOverlay />
        <RadixDialog.Content
          ref={ref}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
            "rounded-md border border-border-default bg-white p-6 shadow-xl outline-none",
            "data-[state=open]:animate-in data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95",
            sizeClasses[size],
            className,
          )}
          {...props}
        >
          {children}
          {showClose && (
            <RadixDialog.Close
              aria-label="Close"
              className="absolute right-4 top-4 rounded-sm p-1 text-text-tertiary opacity-70 transition-opacity hover:bg-black/5 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <X className="size-4" />
            </RadixDialog.Close>
          )}
        </RadixDialog.Content>
      </DialogPortal>
    );
  },
);

const DialogHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={cn("flex flex-col gap-1.5 pb-4 pr-6", className)}
    {...props}
  />
);

const DialogFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end",
      className,
    )}
    {...props}
  />
);

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<typeof RadixDialog.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <RadixDialog.Title
      ref={ref}
      /* 🔴 ดำคงที่ ไม่ตามแบรนด์ — `text-text-primary` ถูก alias ไป `--color-brand`
       * ใน `theme.css` ถ้าปล่อยไว้ หัวข้อ dialog ธรรมดาจะเป็นคนละสีกับหัวข้อของ
       * `ConfirmDialog` ที่แก้แล้ว ทั้งที่เป็นหัวข้อเหมือนกันบนจอเดียวกัน */
      /* `m-0` — Radix `Title` เรนเดอร์ `<h2>` ซึ่งได้ `margin: 0.83em 0` จาก UA
       * stylesheet · dialog ถูก Portal ไปไว้ที่ `body` เสมอ ⇒ กฎกู้ preflight ที่แอป
       * เขียนคุมเฉพาะ subtree ของจอจะจับไม่ถึง (วัดที่ Mediwork ได้ 16.6px จริง)
       * ⇒ component ต้องล้างเอง เหตุผลเต็มอยู่ที่ `ui/Text.tsx` */
      className={cn(
        "m-0 text-body-lg font-semibold text-text-black",
        className,
      )}
      {...props}
    />
  );
});

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof RadixDialog.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <RadixDialog.Description
      ref={ref}
      /* `m-0` — Radix `Description` เรนเดอร์ `<p>` (UA ให้ `margin: 1em 0`) */
      className={cn("m-0 text-body-sm text-text-body", className)}
      {...props}
    />
  );
});

DialogOverlay.displayName = "DialogOverlay";
DialogContent.displayName = "DialogContent";
DialogTitle.displayName = "DialogTitle";
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
