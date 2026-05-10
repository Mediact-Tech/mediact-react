import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, FolderOpen, Inbox, Info, Search } from "lucide-react";
import { Button } from "../ui/Button";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Empty placeholder for screens / sections with no data. Pass `icon` as a fully-styled element — the caller controls its size and color (e.g. `<Calendar className=\"size-15 text-info-blue-primary\" />`).",
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Minimal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Minimal variant — just an outlined icon and a one-line description. Use `iconTone=\"none\"` to skip the colored circle wrapper, and pass only `description` (no title) for a quiet inline empty state.",
      },
    },
  },
  args: {
    iconTone: "none",
    icon: <Info className="size-10 text-text-tertiary" strokeWidth={1.5} />,
    description: "You haven't created any jobs yet.",
  },
};

export const Default: Story = {
  args: {
    icon: <Inbox className="size-15 text-info-blue-primary" />,
    title: "No items yet",
    description: "Create your first item to get started.",
  },
};

export const WithAction: Story = {
  args: {
    icon: <FolderOpen className="size-15 text-info-blue-primary" />,
    title: "No projects",
    description: "You haven't created any projects yet.",
    action: <Button>New project</Button>,
  },
};

export const SearchEmpty: Story = {
  args: {
    icon: <Search className="size-15 text-text-tertiary" />,
    iconTone: "neutral",
    title: "No results found",
    description: "Try adjusting your search or filters.",
  },
};

export const NoSchedule: Story = {
  args: {
    icon: <Calendar className="size-15 text-info-blue-primary" />,
    title: "No Schedule Selected",
    description:
      "To manage schedules, please select a facility, department, year, and month from the selection panel above.",
  },
};

export const Tones: Story = {
  args: { title: "—" },
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {(["info", "success", "warning", "danger", "neutral"] as const).map(
        (tone) => (
          <EmptyState
            key={tone}
            iconTone={tone}
            icon={<Inbox className="size-12" />}
            title={`Tone: ${tone}`}
            description="Sample description text."
          />
        ),
      )}
    </div>
  ),
};

export const CustomIllustration: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `iconTone=\"none\"` to render a fully custom illustration without the colored circle wrapper.",
      },
    },
  },
  args: {
    iconTone: "none",
    icon: (
      <div className="flex size-32 items-center justify-center rounded-2xl bg-gradient-to-br from-info-blue-50 to-success-green-50 text-4xl">
        🎉
      </div>
    ),
    title: "All caught up!",
    description: "You've completed all your tasks for today.",
  },
};
