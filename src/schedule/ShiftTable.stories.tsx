import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShiftTable } from "./ShiftTable";
import type { ShiftTableColumn, ShiftTableDay } from "./types";

const columns: ShiftTableColumn[] = [
  { id: "morning", name: "เช้า", timeRange: "08:00 – 16:00", slotCount: 3 },
  { id: "evening", name: "บ่าย", timeRange: "16:00 – 00:00", slotCount: 2 },
  { id: "night", name: "ดึก", timeRange: "00:00 – 08:00", slotCount: 1 },
];

const doctors = {
  worawit: { name: "นพ. วรวิทย์ ตันสกุล", avatarLabel: "วก", color: "green" },
  nattarika: { name: "พญ. ณัฐริกา พรหมชัย", avatarLabel: "ณพ", color: "orange" },
  thanakorn: { name: "นพ. ธนกร เรืองโรจน์", avatarLabel: "ธร", color: "yellow" },
  anuwat: { name: "นพ. อนุวัฒน์ แสงทอง", avatarLabel: "อส", color: "blue" },
} as const;

const WEEKDAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

const days: ShiftTableDay[] = [
  {
    id: "2569-06-01",
    dayNumber: 1,
    weekdayLabel: WEEKDAYS[1]!,
    slots: {},
  },
  {
    id: "2569-06-02",
    dayNumber: 2,
    weekdayLabel: WEEKDAYS[2]!,
    isToday: true,
    slots: {
      morning: [
        { id: "s1", order: 1, ...doctors.worawit },
        { id: "s2", order: 2, ...doctors.nattarika },
      ],
      evening: [{ id: "s3", order: 1, ...doctors.thanakorn }],
      night: [{ id: "s4", order: 1, ...doctors.anuwat }],
    },
  },
  {
    id: "2569-06-03",
    dayNumber: 3,
    weekdayLabel: WEEKDAYS[3]!,
    slots: {
      morning: [{ id: "s5", order: 1, ...doctors.nattarika }],
      evening: [
        { id: "s6", order: 1, ...doctors.worawit },
        { id: "s7", order: 2, ...doctors.thanakorn },
      ],
    },
  },
  {
    id: "2569-06-04",
    dayNumber: 4,
    weekdayLabel: WEEKDAYS[4]!,
    slots: {
      morning: [{ id: "s8", order: 1, ...doctors.anuwat }],
    },
  },
  {
    id: "2569-06-06",
    dayNumber: 6,
    weekdayLabel: WEEKDAYS[6]!,
    isWeekend: true,
    slots: {},
  },
];

const meta = {
  title: "Schedule/ShiftTable",
  component: ShiftTable,
  tags: ["autodocs"],
  args: {
    columns,
    days,
    addLabel: "เพิ่มหมอ",
    onSlotClick: (dayId, columnId, slot) =>
      console.log("slot click", dayId, columnId, slot),
    onAddSlot: (dayId, columnId, order) =>
      console.log("add slot", dayId, columnId, order),
    onEditColumn: (columnId) => console.log("edit column", columnId),
  },
} satisfies Meta<typeof ShiftTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ReadOnly: Story = {
  args: {
    onSlotClick: undefined,
    onAddSlot: undefined,
    onEditColumn: undefined,
  },
};

export const ScrollableMonth: Story = {
  args: {
    maxHeight: 480,
    days: Array.from({ length: 30 }, (_, index): ShiftTableDay => ({
      id: `2569-06-${String(index + 1).padStart(2, "0")}`,
      dayNumber: index + 1,
      weekdayLabel: WEEKDAYS[(index + 1) % 7]!,
      isToday: index + 1 === 2,
      isWeekend: (index + 1) % 7 === 0 || (index + 1) % 7 === 6,
      slots:
        index % 2 === 1
          ? {
              morning: [{ id: `m-${index}`, order: 1, ...doctors.worawit }],
              evening: [{ id: `e-${index}`, order: 1, ...doctors.thanakorn }],
            }
          : {},
    })),
  },
};
