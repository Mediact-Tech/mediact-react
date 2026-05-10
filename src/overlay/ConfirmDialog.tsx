import * as React from "react";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./Dialog";

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Visual tone — affects icon and confirm button variant. */
  tone?: "info" | "warning" | "danger" | "success";
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  /** Called on Confirm. Return a Promise to keep dialog open with loading state until it resolves. */
  onConfirm?: () => void | Promise<void>;
  /** Called on Cancel/× (defaults to closing the dialog). */
  onCancel?: () => void;
  size?: React.ComponentProps<typeof DialogContent>["size"];
};

const toneIcon = {
  info: <Info className="size-5 text-brand-active" />,
  warning: <AlertTriangle className="size-5 text-warning-yellow-600" />,
  danger: <AlertTriangle className="size-5 text-cherry-red-600" />,
  success: <CheckCircle2 className="size-5 text-success-green-primary" />,
} as const;

const toneIconBg = {
  info: "bg-info-blue-50",
  warning: "bg-warning-yellow-50",
  danger: "bg-cherry-red-50",
  success: "bg-success-green-50",
} as const;

const toneConfirmVariant = {
  info: "primary",
  warning: "warning",
  danger: "destructive",
  success: "success",
} as const;

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  tone = "info",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  size = "sm",
}: ConfirmDialogProps) {
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) {
      onOpenChange(false);
      return;
    }
    try {
      setLoading(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size={size}>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              toneIconBg[tone],
            )}
          >
            {toneIcon[tone]}
          </div>
          <div className="flex-1">
            <DialogHeader className="pb-1 pr-0">
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={toneConfirmVariant[tone]}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmDialog };
