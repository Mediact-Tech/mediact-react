import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateNavigator } from "./DateNavigator";

const meta = {
  title: "Schedule/DateNavigator",
  component: DateNavigator,
  tags: ["autodocs"],
  args: {
    label: "มิถุนายน 2569",
  },
} satisfies Meta<typeof DateNavigator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export const Controlled: Story = {
  render: () => {
    const [month, setMonth] = React.useState(5);
    return (
      <DateNavigator
        label={`${MONTHS[month]} 2569`}
        onPrev={() => setMonth((m) => Math.max(m - 1, 0))}
        onNext={() => setMonth((m) => Math.min(m + 1, 11))}
        prevDisabled={month === 0}
        nextDisabled={month === 11}
      />
    );
  },
};

export const DayLevel: Story = {
  args: {
    label: "2 มิถุนายน · วันอังคาร",
    size: "sm",
  },
};
