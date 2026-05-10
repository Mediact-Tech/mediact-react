import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { Chip } from "../ui/Chip";
import { DataTable } from "./DataTable";

const meta = {
  title: "Data/DataTable",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type User = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Member" | "Viewer";
  status: "active" | "invited" | "disabled";
};

const allUsers: User[] = Array.from({ length: 53 }, (_, i) => ({
  id: `u${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@mediact.example`,
  role: (["Admin", "Member", "Viewer"] as const)[i % 3]!,
  status: (["active", "invited", "disabled"] as const)[i % 3]!,
}));

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      const variant =
        s === "active" ? "success" : s === "invited" ? "info" : "neutral";
      return (
        <Chip size="sm" variant={variant}>
          {s}
        </Chip>
      );
    },
  },
];

export const Basic: Story = {
  render: () => <DataTable columns={columns} data={allUsers.slice(0, 5)} />,
};

export const Sorting: Story = {
  render: () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const sortableColumns = useMemo<ColumnDef<User>[]>(
      () => columns.map((c) => ({ ...c, enableSorting: true })),
      [],
    );
    return (
      <DataTable
        columns={sortableColumns}
        data={allUsers.slice(0, 10)}
        sorting={sorting}
        onSortingChange={setSorting}
      />
    );
  },
};

export const PaginationAndSelection: Story = {
  render: () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowSelection, setRowSelection] = useState({});
    const slice = useMemo(
      () => allUsers.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
      [pageIndex, pageSize],
    );
    return (
      <DataTable
        columns={columns}
        data={slice}
        enableSelection
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        getRowId={(row) => row.id}
        pagination={{
          pageIndex,
          pageSize,
          rowCount: allUsers.length,
          onPageChange: setPageIndex,
          onPageSizeChange: (s) => {
            setPageSize(s);
            setPageIndex(0);
          },
        }}
      />
    );
  },
};

export const Loading: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={[]}
      isLoading
      pagination={{
        pageIndex: 0,
        pageSize: 5,
        rowCount: 0,
        onPageChange: () => {},
      }}
    />
  ),
};

export const Empty: Story = {
  render: () => <DataTable columns={columns} data={[]} />,
};

export const RowClick: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={allUsers.slice(0, 5)}
      onRowClick={(u) => alert(`Clicked: ${u.name}`)}
    />
  ),
};

export const StickyHeader: Story = {
  render: () => (
    <div style={{ height: 400 }}>
      <DataTable
        columns={columns}
        data={allUsers}
        stickyHeader
      />
    </div>
  ),
};
