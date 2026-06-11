import type { Meta, StoryObj } from "@storybook/react-vite";
import { AssignmentChip } from "./AssignmentChip";
import type { AssignmentColor } from "./types";

// explicit annotation (not `satisfies`) — inferred decorator type references
// storybook internals (PartialStoryFn) which breaks declaration emit (TS2883)
const meta: Meta<typeof AssignmentChip> = {
  title: "Schedule/AssignmentChip",
  component: AssignmentChip,
  tags: ["autodocs"],
  args: {
    slot: {
      id: "1",
      order: 1,
      name: "นพ. วรวิทย์ ตันสกุล",
      avatarLabel: "วก",
      color: "green",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Clickable: Story = {
  args: {
    onClick: (slot) => console.log("clicked", slot),
  },
};

export const WithoutOrder: Story = {
  args: { hideOrder: true },
};

const COLORS: AssignmentColor[] = [
  "blue",
  "green",
  "orange",
  "yellow",
  "red",
  "teal",
  "gray",
];

export const AllColors: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      {COLORS.map((color, index) => (
        <AssignmentChip
          key={color}
          slot={{
            id: color,
            order: index + 1,
            name: `พญ. ณัฐริกา พรหมชัย (${color})`,
            avatarLabel: "ณพ",
            color,
          }}
        />
      ))}
    </div>
  ),
};
