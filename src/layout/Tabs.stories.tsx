import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

const meta = {
  title: "Layout/Tabs",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Underline: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[480px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview content</TabsContent>
      <TabsContent value="settings">Settings content</TabsContent>
      <TabsContent value="billing">Billing content</TabsContent>
    </Tabs>
  ),
};

export const Pill: Story = {
  render: () => (
    <Tabs defaultValue="day" className="w-[400px]">
      <TabsList variant="pill">
        <TabsTrigger value="day" variant="pill">
          Day
        </TabsTrigger>
        <TabsTrigger value="week" variant="pill">
          Week
        </TabsTrigger>
        <TabsTrigger value="month" variant="pill">
          Month
        </TabsTrigger>
      </TabsList>
      <TabsContent value="day">Day view</TabsContent>
      <TabsContent value="week">Week view</TabsContent>
      <TabsContent value="month">Month view</TabsContent>
    </Tabs>
  ),
};
