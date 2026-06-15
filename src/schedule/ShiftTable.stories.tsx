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

// ใช้วันที่จริง (Gregorian) เพื่อให้ isToday auto-detect ทำงานได้
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const isoDay = (d: number) => `${yyyy}-${mm}-${String(d).padStart(2, "0")}`;

const days: ShiftTableDay[] = [
  {
    id: isoDay(1),
    dayNumber: 1,
    weekdayLabel: WEEKDAYS[1]!,
    slots: {},
  },
  {
    // ไม่ต้องส่ง isToday — component คำนวณจาก id อัตโนมัติ
    id: isoDay(today.getDate()),
    dayNumber: today.getDate(),
    weekdayLabel: WEEKDAYS[today.getDay()]!,
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
    id: isoDay(today.getDate() + 1),
    dayNumber: today.getDate() + 1,
    weekdayLabel: WEEKDAYS[(today.getDay() + 1) % 7]!,
    slots: {
      morning: [{ id: "s5", order: 1, ...doctors.nattarika }],
      evening: [
        { id: "s6", order: 1, ...doctors.worawit },
        { id: "s7", order: 2, ...doctors.thanakorn },
      ],
    },
  },
  {
    id: isoDay(today.getDate() + 2),
    dayNumber: today.getDate() + 2,
    weekdayLabel: WEEKDAYS[(today.getDay() + 2) % 7]!,
    slots: {
      morning: [{ id: "s8", order: 1, ...doctors.anuwat }],
    },
  },
  {
    id: isoDay(today.getDate() + 4),
    dayNumber: today.getDate() + 4,
    weekdayLabel: WEEKDAYS[0]!,
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
      id: isoDay(index + 1),
      dayNumber: index + 1,
      weekdayLabel: WEEKDAYS[(index + 1) % 7]!,
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
