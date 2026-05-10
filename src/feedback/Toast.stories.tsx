import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "../ui/Button";
import { Toaster, toast } from "./Toast";

const meta = {
  title: "Feedback/Toast",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Static visual preview of the toast styling — matches what Sonner will render at runtime. */
export const VisualPreview: Story = {
  render: () => {
    const baseToast =
      "flex items-center gap-3 rounded-sm border px-5 py-3 shadow-sm font-semibold text-base [&_svg]:size-6 [&_svg]:shrink-0";
    const tones = {
      success:
        "bg-success-green-50 border-success-green-200 text-success-green-800 [&_svg]:text-success-green-primary",
      error:
        "bg-cherry-red-50 border-cherry-red-200 text-cherry-red-800 [&_svg]:text-cherry-red-600",
      warning:
        "bg-warning-yellow-50 border-warning-yellow-200 text-warning-yellow-800 [&_svg]:text-warning-yellow-600",
      info: "bg-info-blue-50 border-info-blue-200 text-info-blue-800 [&_svg]:text-info-blue-primary",
    };
    return (
      <div className="flex flex-col gap-3 w-fit">
        <div className={`${baseToast} ${tones.success}`}>
          <CheckCircle2 strokeWidth={2.25} />
          <span>Edit holiday successfully</span>
        </div>
        <div className={`${baseToast} ${tones.error}`}>
          <XCircle strokeWidth={2.25} />
          <span>Failed to save changes</span>
        </div>
        <div className={`${baseToast} ${tones.warning}`}>
          <AlertTriangle strokeWidth={2.25} />
          <span>Your session will expire soon</span>
        </div>
        <div className={`${baseToast} ${tones.info}`}>
          <Info strokeWidth={2.25} />
          <span>3 new updates available</span>
        </div>
      </div>
    );
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast("Plain toast", { duration: 60000 })}>
        Plain
      </Button>
      <Button
        variant="success"
        onClick={() =>
          toast.success("Edit holiday successfully", { duration: 60000 })
        }
      >
        Success
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          toast.error("Something went wrong", { duration: 60000 })
        }
      >
        Error
      </Button>
      <Button
        variant="warning"
        onClick={() => toast.warning("Are you sure?", { duration: 60000 })}
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.info("Heads up", { duration: 60000 })}
      >
        Info
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          toast.promise(
            new Promise((r) => setTimeout(r, 1500)),
            { loading: "Loading…", success: "Done!", error: "Failed" },
          )
        }
      >
        Promise
      </Button>
    </div>
  ),
};
