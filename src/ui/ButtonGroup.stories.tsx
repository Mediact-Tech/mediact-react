import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";
import { ButtonGroup, ConfirmCancelActions } from "./ButtonGroup";

const meta = {
  title: "UI/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "select",
      options: ["start", "end", "between", "fill"],
    },
    gap: {
      control: "select",
      options: ["sm", "md"],
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-96 rounded-md border border-border-default bg-white p-4">
    {children}
  </div>
);

export const AlignEnd: Story = {
  name: "align=end (default — modal footer convention)",
  render: () => (
    <Frame>
      <ButtonGroup align="end">
        <Button variant="secondary">ยกเลิก</Button>
        <Button variant="primary">บันทึก</Button>
      </ButtonGroup>
    </Frame>
  ),
};

export const AlignBetween: Story = {
  name: "align=between (drawer/panel footer convention)",
  render: () => (
    <Frame>
      <ButtonGroup align="between">
        <Button variant="secondary">ยกเลิก</Button>
        <Button variant="primary">บันทึก</Button>
      </ButtonGroup>
    </Frame>
  ),
};

export const AlignFill: Story = {
  name: "align=fill (equal-width pair, e.g. ConfirmModal)",
  render: () => (
    <Frame>
      <ButtonGroup align="fill">
        <Button variant="secondary">ยกเลิก</Button>
        <Button variant="primary">ยืนยัน</Button>
      </ButtonGroup>
    </Frame>
  ),
};

export const AlignStart: Story = {
  render: () => (
    <Frame>
      <ButtonGroup align="start">
        <Button variant="ghost">ย้อนกลับ</Button>
        <Button variant="primary">ถัดไป</Button>
      </ButtonGroup>
    </Frame>
  ),
};

export const SingleButton: Story = {
  name: "1 button (e.g. flex-end footer)",
  render: () => (
    <Frame>
      <ButtonGroup align="end">
        <Button variant="primary">ส่ง</Button>
      </ButtonGroup>
    </Frame>
  ),
};

export const ConfirmCancel: Story = {
  name: "ConfirmCancelActions — default",
  render: () => (
    <Frame>
      <ConfirmCancelActions
        confirmLabel="ยืนยัน"
        cancelLabel="ยกเลิก"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    </Frame>
  ),
};

export const ConfirmCancelBetween: Story = {
  name: "ConfirmCancelActions — align=between",
  render: () => (
    <Frame>
      <ConfirmCancelActions
        confirmLabel="บันทึก"
        cancelLabel="ยกเลิก"
        align="between"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    </Frame>
  ),
};

export const ConfirmCancelLoading: Story = {
  name: "ConfirmCancelActions — loading",
  render: () => (
    <Frame>
      <ConfirmCancelActions
        confirmLabel="กำลังบันทึก..."
        cancelLabel="ยกเลิก"
        isLoading
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    </Frame>
  ),
};

export const ConfirmCancelDestructive: Story = {
  name: "ConfirmCancelActions — destructive confirm",
  render: () => (
    <Frame>
      <ConfirmCancelActions
        confirmLabel="ลบ"
        cancelLabel="ยกเลิก"
        confirmVariant="destructive"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    </Frame>
  ),
};
