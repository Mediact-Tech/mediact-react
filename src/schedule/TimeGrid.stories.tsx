import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimeGrid } from "./TimeGrid";
import type { TimeGridEventData, TimeGridRoom } from "./types";

const rooms: TimeGridRoom[] = [
  { id: "room-1", name: "ห้องตรวจ 1" },
  { id: "room-2", name: "ห้องตรวจ 2" },
  { id: "room-3", name: "ห้องหัตถการ" },
];

const events: TimeGridEventData[] = [
  {
    id: "e1",
    roomId: "room-1",
    name: "นพ. วรวิทย์ ตันสกุล",
    avatarLabel: "วก",
    color: "green",
    start: "08:00",
    end: "12:00",
  },
  {
    id: "e2",
    roomId: "room-2",
    name: "พญ. ณัฐริกา พรหมชัย",
    avatarLabel: "ณพ",
    color: "orange",
    start: "08:00",
    end: "10:00",
    note: "เฉพาะผู้ป่วยนัด",
  },
  {
    id: "e3",
    roomId: "room-2",
    name: "นพ. ธนกร เรืองโรจน์",
    avatarLabel: "ธร",
    color: "yellow",
    start: "10:00",
    end: "12:00",
  },
  {
    id: "e4",
    roomId: "room-3",
    name: "นพ. อนุวัฒน์ แสงทอง",
    avatarLabel: "อส",
    color: "blue",
    start: "09:00",
    end: "12:00",
  },
];

const meta = {
  title: "Schedule/TimeGrid",
  component: TimeGrid,
  tags: ["autodocs"],
  args: {
    rooms,
    events,
    windowStart: "08:00",
    windowEnd: "12:00",
    addLabel: "เพิ่มแพทย์เวร",
    onEventClick: (event) => console.log("event click", event),
    onEditRoom: (roomId) => console.log("edit room", roomId),
    onAddEvent: (roomId, startMinutes) =>
      console.log("add event", roomId, startMinutes),
  },
} satisfies Meta<typeof TimeGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OverlappingEvents: Story = {
  args: {
    events: [
      ...events,
      {
        id: "e5",
        roomId: "room-1",
        name: "พญ. ศิริพร วงศ์สวัสดิ์",
        avatarLabel: "ศว",
        color: "red",
        start: "10:00",
        end: "12:00",
        note: "ซ้อนเวลากับเวรหลัก",
      },
    ],
  },
};

export const Empty: Story = {
  args: { events: [] },
};

export const LongDay: Story = {
  args: {
    windowStart: "08:00",
    windowEnd: "20:00",
    maxHeight: 560,
    pixelsPerMinute: 1.5,
  },
};

export const ReadOnly: Story = {
  args: {
    onEventClick: undefined,
    onEditRoom: undefined,
    onAddEvent: undefined,
  },
};
