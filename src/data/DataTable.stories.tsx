import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { Chip } from "../ui/Chip";
import { DataTable } from "./DataTable";

const meta = {
  title: "Data/DataTable",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "ตารางข้อมูล — เรียง · เลือกแถว · แบ่งหน้า · สถานะโหลด/ว่าง/ผิดพลาด",
          "",
          "หน้าตายึดจาก **Portal ที่ใช้จริง** (วัดสดจาก `/staff`): พื้นหัวตาราง `#ededf5` ·",
          "เซลล์หัว 48px 14px/500 · เซลล์ข้อมูล 64px 14px/600 · กล่องนอก radius 12 + เงาบาง",
          "",
          "### เลือกยังไง",
          "",
          "| อยากได้ | ใช้ |",
          "|---|---|",
          "| ตารางที่ต้องเรียง/เลือก/แบ่งหน้า | `DataTable` |",
          "| ตารางนิ่ง ๆ ที่จัดเองทุกอย่าง | `Table` + `TableRow` … |",
          "",
          "### สามข้อที่พลาดบ่อยที่สุด",
          "",
          "1. **`getRowId` ไม่ใช่ของประดับ** — ไม่ส่ง = ใช้ index ของอาร์เรย์เป็นคีย์",
          "   ⇒ เปลี่ยนหน้าแล้วแถวที่ติ๊กไว้จะย้ายไปติ๊กแถวอื่นที่บังเอิญอยู่ตำแหน่งเดียวกัน",
          "2. **`size` = ความกว้างขั้นต่ำ ไม่ใช่เป๊ะ** — ตั้ง 200 อาจ render ออกมา 555",
          "   (ของจริงทุกแอปเขียน `minWidth` — ใช้อยู่ 22/41 ไฟล์ มากกว่าความสามารถอื่นทุกตัว)",
          "3. **เรียงฝั่งหลังบ้านต้องใส่ `manualSorting`** — ขาดไปตารางจะเรียงซ้ำทับผลที่ส่งมา",
        ].join("\n"),
      },
    },
  },
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

/** ตารางเปล่า ๆ — ไม่มีเรียง ไม่มีเลือก ไม่มีแบ่งหน้า */
export const Basic: Story = {
  render: () => <DataTable columns={columns} data={allUsers.slice(0, 5)} />,
};

/** กดหัวตารางเพื่อเรียง — ตารางเรียงเองในเครื่อง\n *\n * ถ้าเรียงฝั่งหลังบ้าน ต้องส่ง `manualSorting` ด้วย ไม่งั้นเรียงซ้ำสองรอบ\n */
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

/** แบ่งหน้าฝั่งหลังบ้าน + เลือกแถว\n *\n * `rowCount` คือจำนวน **ทั้งหมด** ไม่ใช่จำนวนแถวในหน้านี้ — ตารางใช้คำนวณจำนวนหน้า\n */
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

/** โครงร่างแถวระหว่างโหลด — จำนวนแถวตาม `pageSize` เพื่อไม่ให้ตารางยุบแล้วกระโดด */
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

/** ไม่มีข้อมูล — ดูตัวอย่างการแยก \"กรองไม่เจอ\" ออกจาก \"ยังไม่มีข้อมูล\" ที่ `Render Empty` */
export const Empty: Story = {
  render: () => <DataTable columns={columns} data={[]} />,
};

/** กดทั้งแถวเพื่อเปิดรายละเอียด\n *\n * ⚠️ ของจริงใช้แค่ 1 ใน 41 ไฟล์ — ส่วนใหญ่ใช้ปุ่มในคอลัมน์จัดการแทน\n * เพราะกดทั้งแถวไม่บอกผู้ใช้ว่ากดได้ และชนกับการติ๊ก checkbox\n */
export const RowClick: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={allUsers.slice(0, 5)}
      onRowClick={(u) => alert(`Clicked: ${u.name}`)}
    />
  ),
};

/** หัวตารางติดบนขณะเลื่อน — เหมาะกับตารางยาวที่ไม่แบ่งหน้า */
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

/** โหลดไม่สำเร็จ + ปุ่มลองใหม่\n *\n * `isLoading` ชนะ `error` เสมอ ⇒ refetch เบื้องหลังจะไม่วาบ error เก่าให้เห็น\n */
export const ErrorState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass a truthy `error` to render the error state instead of rows. The default block composes `EmptyState` with a `danger` tone; `onRetry` adds a retry button. Override the whole block with `errorSlot`.",
      },
    },
  },
  render: () => (
    <DataTable
      columns={columns}
      data={[]}
      error={new Error("Network request failed")}
      onRetry={() => alert("retry")}
    />
  ),
};

/** เปลี่ยนข้อความในตัวทั้งหมดผ่าน `labels` — package นี้ไม่มี i18n ผูกมา แอปเป็นคนส่งคำแปล */
export const ThaiLabels: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Every built-in string DataTable renders (empty/error state, pagination copy, selection aria-labels) is English by default and overridable via `labels` — this app has no i18n lib bound into the DS.",
      },
    },
  },
  render: () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const slice = useMemo(
      () => allUsers.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
      [pageIndex, pageSize],
    );
    return (
      <DataTable
        columns={columns}
        data={slice}
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
        labels={{
          selectAllAriaLabel: "เลือกทั้งหมด",
          selectRowAriaLabel: "เลือกแถว",
          empty: { title: "ไม่มีข้อมูล", description: "ยังไม่มีรายการให้แสดง" },
          error: { title: "เกิดข้อผิดพลาด", description: "โหลดข้อมูลไม่สำเร็จ" },
          retry: "ลองใหม่",
          prev: "ก่อนหน้า",
          next: "ถัดไป",
          rowsPerPage: "แถวต่อหน้า",
          selected: (n) => `เลือกแล้ว ${n} รายการ`,
          of: (start, end, total) => `${start}–${end} จาก ${total}`,
        }}
      />
    );
  },
};

/* ── ที่เพิ่มหลังสำรวจตารางจริง 41 ไฟล์ใน 4 แอป (2026-08-08) ── */

/** `size` = ความกว้าง **ขั้นต่ำ** ไม่ใช่ความกว้างเป๊ะ
 *
 * ของจริงทุกแอปเขียน `minWidth: '200px'` — ใช้อยู่ **22/41 ไฟล์ มากกว่าความสามารถอื่นทุกตัว**
 * ถ้าตีเป็น `width` เป๊ะ คอลัมน์จะไม่ขยายตามตาราง เหลือช่องว่างด้านขวาเวลาจอกว้าง
 *
 * ⚠️ TanStack ตั้ง `size: 150` ให้ทุกคอลัมน์เป็นค่าเริ่มต้น — `DataTable` จึงอ่านจาก
 * `columns` ที่ส่งมาโดยตรง ไม่ใช่จาก `columnDef.size` ไม่งั้นทุกคอลัมน์จะโดนยัด 150px
 */
export const ColumnWidths: Story = {
  render: () => (
    <div data-testid="widths">
      <DataTable
        columns={[
          { accessorKey: "name", header: "Name", size: 260 },
          { accessorKey: "email", header: "Email" },
          { accessorKey: "role", header: "Role", size: 100 },
        ]}
        data={allUsers.slice(0, 4)}
      />
    </div>
  ),
};

/** `minTableWidth` — แคบกว่านี้แล้วเลื่อนแนวนอน แทนที่จะบีบคอลัมน์จนอ่านไม่ออก */
export const MinTableWidth: Story = {
  render: () => (
    <div className="w-[480px] border border-dashed border-border-strong p-2">
      <p className="mb-2 text-caption text-text-tertiary">
        กล่องกว้าง 480 · ตารางขั้นต่ำ 900 ⇒ ต้องเลื่อนแนวนอนได้
      </p>
      <DataTable columns={columns} data={allUsers.slice(0, 4)} minTableWidth={900} />
    </div>
  ),
};

/** `isRowSelectable` — ติ๊กได้เฉพาะบางแถว
 *
 * 🔴 ของจริงบน Mediwork ต้องการแบบนี้ทุกหน้าคำขอ: ติ๊กได้เฉพาะใบที่ยัง "รออนุมัติ"
 * ใบที่อนุมัติ/ปฏิเสธไปแล้วต้องเห็นในตารางแต่ทำอะไรไม่ได้
 * (วันนี้ 6 ฟีเจอร์ส่ง `pendingCount` เข้าไปเอง ซ้ำกันทุกที่)
 *
 * **select-all ติ๊กเฉพาะแถวที่ติ๊กได้** — ถ้านับจากแถวทั้งหมด หัวตารางจะค้างเป็น
 * ขีดกลางตลอดไป ไม่มีทางขึ้นเป็น "เลือกครบ" เลย
 */
export const SelectableRowsOnly: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={allUsers.slice(0, 6)}
      getRowId={(r) => r.id}
      enableSelection
      isRowSelectable={(r) => r.status === "active"}
    />
  ),
};

/** เลือกแถวได้แต่ไม่มีแบ่งหน้า — ตัวนับ "เลือกแล้ว N" ยังต้องขึ้น
 *
 * 🔴 เดิมตัวนับอยู่ในแถบแบ่งหน้าเท่านั้น ⇒ ตารางที่ไม่มีแบ่งหน้าจะติ๊กแล้วเงียบสนิท
 * ของจริงเลือกได้ 11 ตาราง แต่มีแบ่งหน้าแค่ 6 ⇒ ~5 ตารางเคยเงียบ
 */
export const SelectionWithoutPagination: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={allUsers.slice(0, 4)}
      getRowId={(r) => r.id}
      enableSelection
    />
  ),
};

/** **ตัวอย่างใช้จริง** — ตารางคำขอลาแบบเต็ม
 *
 * ยกโครงมาจาก `leave-request-management` ของ Mediwork ซึ่งวันนี้เขียนมือ 4 ไฟล์
 * รวมทุกอย่างที่หน้าจริงต้องใช้: ป้ายสถานะ · คอลัมน์จัดการ · ติ๊กได้เฉพาะใบที่รออนุมัติ ·
 * แบ่งหน้า · ข้อความไทย · ความกว้างคอลัมน์ · เลื่อนแนวนอน
 *
 * 📌 **ติ๊กได้เฉพาะแถว "รออนุมัติ"** — ใบที่ตัดสินไปแล้วต้องเห็นในตารางแต่แตะไม่ได้
 * กด select-all แล้วจะติ๊กแค่ 2 ใบ ไม่ใช่ทั้ง 5
 */
export const RealWorldLeaveRequests: Story = {
  render: () => {
    type Leave = {
      id: string;
      name: string;
      type: string;
      range: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
    };
    const rows: Leave[] = [
      { id: "1", name: "ศุกร์ ทดสอบ", type: "ลาป่วย", range: "12–13 ส.ค. 2569", status: "PENDING" },
      { id: "2", name: "เอมมี่ พยาบาล", type: "ลากิจ", range: "15 ส.ค. 2569", status: "APPROVED" },
      { id: "3", name: "บีบี้ อาร์เอ็น", type: "ลาพักร้อน", range: "20–24 ส.ค. 2569", status: "PENDING" },
      { id: "4", name: "ซีซี่ ผู้ช่วย", type: "ลาป่วย", range: "9 ส.ค. 2569", status: "REJECTED" },
      { id: "5", name: "ดารา พีที", type: "ลากิจ", range: "28 ส.ค. 2569", status: "APPROVED" },
    ];
    const label = { PENDING: "รออนุมัติ", APPROVED: "อนุมัติแล้ว", REJECTED: "ปฏิเสธ" } as const;
    const tone = { PENDING: "warning", APPROVED: "success", REJECTED: "danger" } as const;

    const cols: ColumnDef<Leave>[] = [
      { accessorKey: "name", header: "ชื่อพนักงาน", size: 180 },
      { accessorKey: "type", header: "ประเภทการลา", size: 140 },
      { accessorKey: "range", header: "วันที่ลา", size: 190 },
      {
        accessorKey: "status",
        header: "สถานะ",
        size: 120,
        cell: ({ row }) => (
          <Chip size="sm" variant={tone[row.original.status]}>
            {label[row.original.status]}
          </Chip>
        ),
      },
      {
        id: "actions",
        header: "จัดการ",
        size: 110,
        enableSorting: false,
        cell: ({ row }) =>
          row.original.status === "PENDING" ? (
            <span className="text-caption text-brand">อนุมัติ · ปฏิเสธ</span>
          ) : (
            <span className="text-caption text-text-tertiary">—</span>
          ),
      },
    ];

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    return (
      <DataTable
        columns={cols}
        data={rows}
        getRowId={(r) => r.id}
        enableSelection
        isRowSelectable={(r) => r.status === "PENDING"}
        minTableWidth={860}
        pagination={{
          pageIndex: page,
          pageSize,
          rowCount: 42,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
        labels={{
          rowsPerPage: "แถวต่อหน้า",
          prev: "ก่อนหน้า",
          next: "ถัดไป",
          selected: (n) => `เลือกแล้ว ${n} รายการ`,
          of: (s, e, t) => `${s}–${e} จาก ${t}`,
        }}
      />
    );
  },
};

/** **ว่างเพราะกรองไม่เจอ ≠ ว่างเพราะยังไม่มีข้อมูล**
 *
 * 🔴 สองอย่างนี้ต้องพูดคนละแบบ และพาผู้ใช้ไปคนละทาง —
 * *"ล้างคำค้น"* กับ *"สร้างรายการ"* · บอกให้ไปสร้างใหม่ทั้งที่เขาแค่กรองผิด
 * คือทางที่ทำให้เขาสร้างข้อมูลซ้ำ
 *
 * ตารางไม่รู้เองว่ากำลังถูกกรอง เพราะช่องค้นหาอยู่นอกตัวมัน ⇒ ต้องบอกผ่าน `isFiltered`
 */
export const RenderEmpty: Story = {
  render: () => {
    const [keyword, setKeyword] = useState("พยาบาล");
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-caption text-text-tertiary">คำค้น:</span>
          <code className="rounded-sm bg-bg-subtle px-2 py-0.5 text-caption">
            {keyword || "(ว่าง)"}
          </code>
          <button
            type="button"
            className="text-caption text-brand underline"
            onClick={() => setKeyword(keyword ? "" : "พยาบาล")}
          >
            {keyword ? "ล้างคำค้น" : "ใส่คำค้น"}
          </button>
        </div>
        <DataTable
          columns={columns}
          data={[]}
          isFiltered={keyword !== ""}
          renderEmpty={({ isFiltered }) => (
            <div className="px-4 py-10 text-center">
              <p className="text-body-md font-semibold text-text-primary">
                {isFiltered ? "ไม่พบผลลัพธ์" : "ยังไม่มีรายการ"}
              </p>
              <p className="mt-1 text-body-sm text-text-tertiary">
                {isFiltered
                  ? `ไม่มีรายการที่ตรงกับ "${keyword}" — ลองแก้คำค้น`
                  : "รายการที่เพิ่มเข้ามาจะแสดงที่นี่"}
              </p>
            </div>
          )}
        />
      </div>
    );
  },
};

/** **วาดสถานะผิดพลาดเองแบบใช้ซ้ำได้**
 *
 * `renderError` ส่ง `error` กับ `retry` มาให้ ⇒ แยกเป็น component กลางได้จริง
 * ต่างจาก `errorSlot` ที่ต้องหอบสองอย่างนั้นไปผูกไว้ข้างนอกเอง
 */
export const RenderError: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={[]}
      error={new TypeError("Failed to fetch")}
      onRetry={() => alert("โหลดใหม่")}
      renderError={({ error, retry }) => {
        const offline = error instanceof TypeError;
        return (
          <div className="px-4 py-10 text-center">
            <p className="text-body-md font-semibold text-cherry-red-600">
              {offline ? "เชื่อมต่อไม่ได้" : "โหลดข้อมูลไม่สำเร็จ"}
            </p>
            <p className="mt-1 text-body-sm text-text-tertiary">
              {offline ? "ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่" : String(error)}
            </p>
            <button
              type="button"
              onClick={retry}
              className="mt-3 rounded-md border border-border-strong px-3 py-1.5 text-body-sm"
            >
              ลองใหม่
            </button>
          </div>
        );
      }}
    />
  ),
};

/* ────────────────────────────────────────────────────────────────────────────
 * จัดกลุ่ม
 * ──────────────────────────────────────────────────────────────────────────── */

type Person = {
  id: string;
  name: string;
  role: "RN" | "PN" | "NA";
  partTime: boolean;
  status: "ACTIVE" | "INVITED";
};

const roster: Person[] = [
  { id: "1", name: "ศุกร์ ทดสอบ", role: "RN", partTime: false, status: "ACTIVE" },
  { id: "2", name: "เอมมี่ พยาบาล", role: "RN", partTime: false, status: "ACTIVE" },
  { id: "3", name: "บีบี้ อาร์เอ็น", role: "RN", partTime: false, status: "INVITED" },
  { id: "4", name: "ซีซี่ ผู้ช่วย", role: "NA", partTime: false, status: "ACTIVE" },
  { id: "5", name: "ดารา พีที", role: "PN", partTime: true, status: "ACTIVE" },
  { id: "6", name: "ดาว พาร์ทไทม์", role: "NA", partTime: true, status: "INVITED" },
];

const rosterColumns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "ชื่อ", size: 200 },
  { accessorKey: "role", header: "วิชาชีพ", size: 110 },
  {
    accessorKey: "status",
    header: "สถานะการเข้าร่วม",
    size: 150,
    cell: ({ row }) => (
      <Chip
        size="sm"
        variant={row.original.status === "ACTIVE" ? "success" : "warning"}
      >
        {row.original.status === "ACTIVE" ? "เข้าร่วมแล้ว" : "รอตอบรับ"}
      </Chip>
    ),
  },
];

/** จุดสีหน้าป้ายกลุ่ม — สีเป็นของ**ผู้เรียก** ไม่ใช่ของ DS */
const GroupDot = ({ className }: { className: string }) => (
  <span className={`size-2 shrink-0 rounded-full ${className}`} aria-hidden />
);

/** ประจำ/พาร์ตไทม์ แยกกัน แต่อยู่ใต้หัวตารางชุดเดียว
 *
 * 🔴 ของจริงวันนี้ทำเป็น **2 ตาราง หัวซ้ำ 2 ชุด** ทั้งฝั่ง Mediwork และ MediHR —
 * พอเลื่อนผ่านกลุ่มแรกจะเจอหัวคอลัมน์อีกชุดกลางจอ ซึ่งอ่านเป็น "ตารางใหม่"
 * ไม่ใช่ "หัวข้อย่อยของตารางเดิม"
 *
 * `groupBy` คืน**คีย์** ไม่ใช่คำแปล — คืนคำแปลตรง ๆ กลุ่มจะแตกทันทีที่สลับภาษา
 */
export const GroupedRoster: Story = {
  render: () => (
    <DataTable
      columns={rosterColumns}
      data={roster}
      getRowId={(r) => r.id}
      groupBy={(p) => (p.partTime ? "partTime" : "fullTime")}
      groupOrder={["fullTime", "partTime"]}
      groupLabel={({ key, count }) => (
        <span className="flex items-center gap-2">
          <GroupDot
            className={key === "fullTime" ? "bg-success-green-600" : "bg-brand"}
          />
          {key === "fullTime" ? "พนักงานประจำ" : "พาร์ตไทม์"} ({count})
        </span>
      )}
    />
  ),
};

/** จัดกลุ่มตามวันที่ พร้อมติ๊กเลือกและแบ่งหน้า — ทรงของหน้าคำขอทั้ง 5
 *
 * 🔴 **`colSpan` ของแถบหัวกลุ่มนับจากตารางเองเสมอ** — ของจริงเขียนเลขตายตัว
 * (`colSpan={6}` · `{5}` · `{7}`) ⇒ วันที่ใครเพิ่มคอลัมน์ แถบจะสั้นกว่าตาราง
 * แล้วมีช่องโหว่ท้ายแถวโดยไม่มีอะไรฟ้อง · ลองเปิด/ปิดช่องติ๊กเลือกดู แถบขยับตามเอง
 */
export const GroupedByDate: Story = {
  render: () => {
    type Req = { id: string; name: string; type: string; date: string };
    const reqs: Req[] = [
      { id: "1", name: "ศุกร์ ทดสอบ", type: "ลาป่วย", date: "2026-08-12" },
      { id: "2", name: "เอมมี่ พยาบาล", type: "ลากิจ", date: "2026-08-12" },
      { id: "3", name: "บีบี้ อาร์เอ็น", type: "ลาพักร้อน", date: "2026-08-12" },
      { id: "4", name: "ซีซี่ ผู้ช่วย", type: "ลาป่วย", date: "2026-08-15" },
      { id: "5", name: "ดารา พีที", type: "ลากิจ", date: "2026-08-20" },
    ];
    const thaiDate = (iso: string) =>
      new Date(iso).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    const cols: ColumnDef<Req>[] = [
      { accessorKey: "name", header: "ชื่อพนักงาน", size: 200 },
      { accessorKey: "type", header: "ประเภทการลา", size: 150 },
      { id: "actions", header: "จัดการ", enableSorting: false, cell: () => "อนุมัติ · ปฏิเสธ" },
    ];
    const [page, setPage] = useState(0);
    return (
      <DataTable
        columns={cols}
        data={reqs}
        getRowId={(r) => r.id}
        enableSelection
        groupBy={(r) => r.date}
        groupLabel={({ key, count }) => `${thaiDate(key)} (${count} คำขอ)`}
        pagination={{
          pageIndex: page,
          pageSize: 10,
          rowCount: 5,
          onPageChange: setPage,
        }}
        labels={{
          prev: "ก่อนหน้า",
          next: "ถัดไป",
          selected: (n) => `เลือกแล้ว ${n} รายการ`,
          of: (s, e, t) => `${s}–${e} จาก ${t}`,
        }}
      />
    );
  },
};

/** พับกลุ่มได้ — ตารางเวรทำแบบนี้อยู่แล้วแต่ทำเองด้วยมือ
 *
 * ⚠️ **พับแล้วแถวที่ติ๊กไว้ยังถูกนับอยู่** ทั้งที่มองไม่เห็น — ตั้งใจ
 * พับคือการซ่อนชั่วคราว ไม่ใช่การถอนสิ่งที่ผู้ใช้เลือกไว้ (ลองติ๊กแล้วพับดู)
 */
export const CollapsibleGroups: Story = {
  render: () => {
    const roleLabel = { RN: "พยาบาลวิชาชีพ", PN: "พยาบาลเทคนิค", NA: "ผู้ช่วยพยาบาล" };
    return (
      <DataTable
        columns={rosterColumns}
        data={roster}
        getRowId={(r) => r.id}
        enableSelection
        groupBy={(p) => p.role}
        groupOrder={["RN", "PN", "NA"]}
        collapsibleGroups
        defaultCollapsedGroups={["NA"]}
        groupLabel={({ key, count }) =>
          `${roleLabel[key as keyof typeof roleLabel]} (${count})`
        }
        labels={{
          toggleGroup: "พับ/กางกลุ่ม",
          selected: (n) => `เลือกแล้ว ${n} รายการ`,
        }}
      />
    );
  },
};

/** แถวที่ไม่เข้ากลุ่มไหน (`groupBy` คืน `null`) อยู่**บนสุดและไม่มีแถบหัว**
 *
 * ตั้งใจให้อยู่บนสุด เพราะปกติคือรายการที่ยังไม่ถูกจัดหมวด ซึ่งเป็นสิ่งที่ต้องจัดการก่อน —
 * ไม่ใช่เศษที่กวาดไปไว้ท้ายตาราง · กติกาเดียวกับกลุ่มตัวเลือกใน `ComboBox`
 */
export const UngroupedRowsFirst: Story = {
  render: () => (
    <DataTable
      columns={rosterColumns}
      data={roster}
      getRowId={(r) => r.id}
      groupBy={(p) => (p.status === "INVITED" ? null : p.role)}
      groupOrder={["RN", "PN", "NA"]}
      groupLabel={({ key, count }) => `${key} (${count})`}
    />
  ),
};

/** เรียงฝั่งหลังบ้าน — ผูกกับ react-query
 *
 * `onSortingChange` ส่ง **`SortingState` มาตรง ๆ** เอาไปใส่ `queryKey` ได้ทันที
 *
 * 🔴 TanStack เรียก callback ตัวนี้ด้วย **ฟังก์ชัน** `(old) => next` เสมอ — DS คลี่ให้แล้ว
 * ถ้าไม่คลี่ ทุกจอที่ใช้ต้องเขียน `typeof u === "function" ? u(prev) : u` เอง
 * และจอที่ลืมจะพัง**เงียบ**: `queryKey` ได้ฟังก์ชันไปแทนค่า → key ไม่เปลี่ยน → ไม่ refetch
 *
 * ```tsx
 * const [sorting, setSorting] = useState<SortingState>([]);
 * const { data, isFetching } = useQuery({
 *   queryKey: ["staff", page, sorting],
 *   queryFn: () => api.getStaff({ page, sort: sorting[0]?.id, desc: sorting[0]?.desc }),
 *   placeholderData: keepPreviousData,
 * });
 *
 * <DataTable
 *   manualSorting            // ⚠️ ขาดตัวนี้ = ตารางเรียงซ้ำทับผลที่หลังบ้านส่งมา
 *   sorting={sorting}
 *   onSortingChange={setSorting}
 *   isLoading={isFetching}
 *   data={data?.rows ?? []}
 * />
 * ```
 *
 * ตัวอย่างข้างล่างจำลอง API ที่หน่วง 600ms — กดหัวคอลัมน์แล้วดูบรรทัด "เรียกไปแล้ว"
 */
export const ServerSideSorting: Story = {
  render: () => {
    type Row = { id: string; name: string; ward: string; shifts: number };
    const source: Row[] = [
      { id: "1", name: "ศุกร์ ทดสอบ", ward: "ICU", shifts: 18 },
      { id: "2", name: "เอมมี่ พยาบาล", ward: "ER", shifts: 22 },
      { id: "3", name: "บีบี้ อาร์เอ็น", ward: "ICU", shifts: 15 },
      { id: "4", name: "ดารา พีที", ward: "PH", shifts: 9 },
    ];
    const cols: ColumnDef<Row>[] = [
      { accessorKey: "name", header: "ชื่อ", size: 200 },
      { accessorKey: "ward", header: "หน่วยงาน", size: 140 },
      { accessorKey: "shifts", header: "จำนวนเวร", size: 120 },
    ];

    const [sorting, setSorting] = useState<SortingState>([]);
    const [rows, setRows] = useState(source);
    const [fetching, setFetching] = useState(false);
    const [log, setLog] = useState<string[]>([]);

    /* แทนที่ useQuery — ของจริงคือ queryKey: ["staff", sorting] แล้วปล่อยให้ react-query
       เห็นว่า key เปลี่ยนแล้วยิงเอง · ที่นี่จำลองด้วย effect เพื่อไม่ต้องลง provider ใน story */
    useMemo(() => {
      const s = sorting[0];
      setFetching(true);
      setLog((l) => [
        `GET /staff?sort=${s?.id ?? "-"}&desc=${s?.desc ?? "-"}`,
        ...l,
      ]);
      const t = setTimeout(() => {
        const sorted = [...source].sort((a, b) => {
          if (!s) return 0;
          const av = a[s.id as keyof Row];
          const bv = b[s.id as keyof Row];
          const cmp = av > bv ? 1 : av < bv ? -1 : 0;
          return s.desc ? -cmp : cmp;
        });
        setRows(sorted);
        setFetching(false);
      }, 600);
      return () => clearTimeout(t);
    }, [sorting]);

    return (
      <div className="flex flex-col gap-3">
        <DataTable
          columns={cols}
          data={rows}
          getRowId={(r) => r.id}
          manualSorting
          sorting={sorting}
          onSortingChange={setSorting}
          isLoading={fetching}
        />
        <div className="rounded-md border border-divider-gray bg-bg-subtle p-3 font-mono text-caption text-text-tertiary">
          <p className="mb-1 font-sans font-medium text-text-primary">
            เรียกไปแล้ว {log.length} ครั้ง
          </p>
          {log.slice(0, 4).map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
      </div>
    );
  },
};

/** แช่คอลัมน์ — ซ้าย/ขวา · **เลื่อนตารางแนวนอนเพื่อดูผล**
 *
 * ต้องมี `minTableWidth` (หรือคอลัมน์กว้างจนล้น) ก่อน ไม่งั้นไม่มีอะไรให้เลื่อน
 * แล้วจะดูเหมือน prop ไม่ทำงาน
 *
 * ```tsx
 * minTableWidth={1400}
 * freezeColumns={{ left: 1, right: 1 }}   // ช่องติ๊กแช่ตามซ้ายให้เอง
 * ```
 *
 * 🔴 **ระยะ `left`/`right` วัดจาก DOM จริง ไม่ได้บวกจาก `columnDef.size`** —
 * เพราะ `size` คือความกว้าง*ขั้นต่ำ* คอลัมน์ที่ตั้ง 200 อาจ render ออกมา 555
 * ⇒ `column.getStart('left')` ของ TanStack จะให้ค่าผิดและคอลัมน์ที่สองจะทับตัวแรก
 *
 * ⚠️ ของจริงวันนี้แช่ซ้ายอย่างเดียว 1 คอลัมน์ (ตารางเวร 4 ไฟล์) — **ฝั่งขวายังไม่มีที่ไหนทำ**
 */
export const FrozenColumns: Story = {
  render: () => {
    type Row = {
      id: string;
      name: string;
      ward: string;
      role: string;
      shifts: number;
      hours: number;
      night: number;
      leave: number;
    };
    const data: Row[] = [
      { id: "1", name: "ศุกร์ ทดสอบ", ward: "ICU", role: "RN", shifts: 18, hours: 144, night: 6, leave: 2 },
      { id: "2", name: "เอมมี่ พยาบาล", ward: "ER", role: "RN", shifts: 22, hours: 176, night: 9, leave: 0 },
      { id: "3", name: "บีบี้ อาร์เอ็น", ward: "ICU", role: "RN", shifts: 15, hours: 120, night: 4, leave: 1 },
      { id: "4", name: "ดารา พีที", ward: "PH", role: "PN", shifts: 9, hours: 72, night: 1, leave: 0 },
    ];
    const cols: ColumnDef<Row>[] = [
      { accessorKey: "name", header: "ชื่อ", size: 200 },
      { accessorKey: "ward", header: "หน่วยงาน", size: 160 },
      { accessorKey: "role", header: "วิชาชีพ", size: 160 },
      { accessorKey: "shifts", header: "จำนวนเวร", size: 160 },
      { accessorKey: "hours", header: "ชั่วโมงรวม", size: 160 },
      { accessorKey: "night", header: "เวรดึก", size: 160 },
      { accessorKey: "leave", header: "วันลา", size: 160 },
      {
        id: "actions",
        header: "จัดการ",
        size: 130,
        enableSorting: false,
        cell: () => <span className="text-caption text-brand">แก้ไข</span>,
      },
    ];
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    return (
      <div className="max-w-3xl">
        <DataTable
          columns={cols}
          data={data}
          getRowId={(r) => r.id}
          enableSelection
          minTableWidth={1400}
          freezeColumns={{ left: 1, right: 1 }}
          pagination={{
            pageIndex: page,
            pageSize,
            rowCount: 13,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          labels={{
            rowsPerPage: "จำนวนแถวต่อหน้า:",
            selected: (n) => `เลือกแล้ว ${n} รายการ`,
            of: (s, e, t) => `${s}-${e} จาก ${t}`,
          }}
        />
      </div>
    );
  },
};

/** แช่ซ้ายอย่างเดียว — ทรงเดียวกับตารางเวรที่ใช้จริง (`StaffRow` แช่ `left: 0`) */
export const FrozenLeftOnly: Story = {
  render: () => {
    type Row = { id: string; name: string } & Record<string, any>;
    const days = Array.from({ length: 14 }, (_, i) => `d${i + 1}`);
    const data: Row[] = [
      { id: "1", name: "ศุกร์ ทดสอบ" },
      { id: "2", name: "เอมมี่ พยาบาล" },
      { id: "3", name: "ดารา พีที" },
    ].map((r, ri) => ({
      ...r,
      ...Object.fromEntries(days.map((d, i) => [d, (i + ri) % 3 === 0 ? "ช" : (i + ri) % 3 === 1 ? "บ" : "ด"])),
    }));
    const cols: ColumnDef<Row>[] = [
      { accessorKey: "name", header: "พนักงาน", size: 200 },
      ...days.map((d, i) => ({
        accessorKey: d,
        header: `${i + 1} ส.ค.`,
        size: 90,
        enableSorting: false,
      })),
    ];
    return (
      <div className="max-w-2xl">
        <DataTable
          columns={cols}
          data={data}
          getRowId={(r) => r.id}
          minTableWidth={1500}
          freezeColumns={{ left: 1 }}
        />
      </div>
    );
  },
};
