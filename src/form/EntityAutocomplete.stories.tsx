import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useState } from "react";
import { EntityAutocomplete } from "./EntityAutocomplete";

const meta = {
  title: "Form/EntityAutocomplete",
  component: EntityAutocomplete,
  tags: ["autodocs"],
  // Every story below renders its own typed <EntityAutocomplete<Person> /> and
  // ignores the `args` Storybook passes to `render` — these stub values exist
  // only so the (required: options/onSearch/getOption*) prop bag type-checks
  // at the meta level for every story.
  args: {
    options: [],
    onSearch: () => {},
    getOptionValue: (item: unknown) => String(item),
    getOptionLabel: (item: unknown) => String(item),
  },
  parameters: {
    docs: {
      description: {
        component:
          "Generic remote-search combobox for domain entities — the option isn't `{value,label}`, it's your own object (`getOptionValue`/`getOptionLabel` read it). The component debounces keystrokes and asks via `onSearch`; you own the fetch and hand back `options`/`optionsLoading`/`searchError`. Single or multi selection from the same component via `multiple`. Shares Popover + cmdk + FloatingFieldShell internals with ComboBox/MultiAutocomplete.",
      },
    },
  },
} satisfies Meta<typeof EntityAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

type Person = { id: string; name: string; department: string };

const directory: Person[] = [
  { id: "1", name: "Alicia Torres", department: "Cardiology" },
  { id: "2", name: "Ben Whitfield", department: "Radiology" },
  { id: "3", name: "Carmen Diaz", department: "Cardiology" },
  { id: "4", name: "Daniel Osei", department: "Pediatrics" },
  { id: "5", name: "Elena Popescu", department: "Oncology" },
  { id: "6", name: "Farid Haddad", department: "Radiology" },
  { id: "7", name: "Grace Lindqvist", department: "Pediatrics" },
  { id: "8", name: "Hiro Tanaka", department: "Oncology" },
];

/** Fakes a remote search — filters the in-memory directory after a network-ish delay. */
function fakeSearch(
  query: string,
  onResult: (people: Person[]) => void,
  delayMs = 500,
) {
  const timer = setTimeout(() => {
    const q = query.trim().toLowerCase();
    onResult(
      q
        ? directory.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.department.toLowerCase().includes(q),
          )
        : directory,
    );
  }, delayMs);
  return () => clearTimeout(timer);
}

function SingleDemo() {
  const [value, setValue] = useState<Person | null>(null);
  const [options, setOptions] = useState<Person[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  return (
    <EntityAutocomplete<Person>
      label="Assign to"
      placeholder="Search by name or department..."
      value={value}
      onChange={setValue}
      options={options}
      optionsLoading={optionsLoading}
      getOptionValue={(p) => p.id}
      getOptionLabel={(p) => p.name}
      getOptionDescription={(p) => p.department}
      onSearch={(query) => {
        setOptionsLoading(true);
        fakeSearch(query, (people) => {
          setOptions(people);
          setOptionsLoading(false);
        });
      }}
    />
  );
}

export const Single: Story = {
  render: () => (
    <div className="w-80">
      <SingleDemo />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Single-select mode (`multiple` unset/false) — picking an item closes the popover, picking the same item again clears it (same convention as ComboBox).",
      },
    },
  },
};

function MultiDemo() {
  const [value, setValue] = useState<Person[]>([]);
  const [options, setOptions] = useState<Person[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  return (
    <EntityAutocomplete<Person>
      multiple
      label="Team members"
      placeholder="Search people..."
      value={value}
      onChange={setValue}
      options={options}
      optionsLoading={optionsLoading}
      maxItems={4}
      getOptionValue={(p) => p.id}
      getOptionLabel={(p) => p.name}
      getOptionDescription={(p) => p.department}
      onSearch={(query) => {
        setOptionsLoading(true);
        fakeSearch(query, (people) => {
          setOptions(people);
          setOptionsLoading(false);
        });
      }}
    />
  );
}

export const Multiple: Story = {
  render: () => (
    <div className="w-80">
      <MultiDemo />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Multi-select mode (`multiple`) — chips on the trigger, cap via `maxItems`, same chip-overflow (+N) convention as MultiAutocomplete.",
      },
    },
  },
};

export const Loading: Story = {
  render: () => (
    <div className="w-80">
      <EntityAutocomplete<Person>
        label="Assign to"
        placeholder="Search people..."
        options={[]}
        optionsLoading
        onSearch={() => {}}
        getOptionValue={(p) => p.id}
        getOptionLabel={(p) => p.name}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Open the field to see the loading row (`optionsLoading`).",
      },
    },
  },
};

export const EmptyResult: Story = {
  render: () => (
    <div className="w-80">
      <EntityAutocomplete<Person>
        label="Assign to"
        alwaysFloatLabel
        options={[]}
        emptyText="No matching people"
        onSearch={() => {}}
        getOptionValue={(p) => p.id}
        getOptionLabel={(p) => p.name}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Open the field to see the empty state (`options=[]`, not loading, no error).",
      },
    },
  },
};

function ErrorDemo() {
  const [options, setOptions] = useState<Person[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | undefined>();

  return (
    <EntityAutocomplete<Person>
      label="Assign to"
      placeholder="Search people... (always fails)"
      options={options}
      optionsLoading={optionsLoading}
      searchError={searchError}
      getOptionValue={(p) => p.id}
      getOptionLabel={(p) => p.name}
      onSearch={() => {
        setOptionsLoading(true);
        setSearchError(undefined);
        setOptions([]);
        setTimeout(() => {
          setOptionsLoading(false);
          setSearchError("Couldn't reach the directory service. Try again.");
        }, 500);
      }}
    />
  );
}

export const SearchError: Story = {
  render: () => (
    <div className="w-80">
      <ErrorDemo />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`searchError` replaces the list (takes priority over the empty state) when the last `onSearch` failed.",
      },
    },
  },
};

function CustomRenderDemo() {
  const [value, setValue] = useState<Person[]>([]);
  const [options, setOptions] = useState<Person[]>(directory);

  return (
    <EntityAutocomplete<Person>
      multiple
      label="Team members"
      placeholder="Search people..."
      value={value}
      onChange={setValue}
      options={options}
      onSearch={(query) => fakeSearch(query, setOptions, 150)}
      getOptionValue={(p) => p.id}
      getOptionLabel={(p) => p.name}
      renderOption={(p, { selected }) => (
        <span className="flex w-full items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-brand-subtle text-[10px] font-semibold text-brand">
              {p.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <span className="flex flex-col">
              <span>{p.name}</span>
              <span className="text-caption text-text-tertiary">
                {p.department}
              </span>
            </span>
          </span>
          {selected && <span className="text-caption text-brand">Selected</span>}
        </span>
      )}
      renderChip={(p) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-caption font-medium text-brand-foreground">
          {p.name}
        </span>
      )}
    />
  );
}

export const CustomRender: Story = {
  render: () => (
    <div className="w-96">
      <CustomRenderDemo />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "`renderOption` (avatar + description row) and `renderChip` (pill chip).",
      },
    },
  },
};

/** `groupBy` — จัดผลค้นหาเป็นหัวข้อ
 *
 * คืนชื่อกลุ่มของแต่ละรายการ ที่เหลือ component จัดการเอง
 *
 * ⚠️ จัดกลุ่มจาก **ผลที่ได้มาหน้านี้เท่านั้น** ไม่ใช่ทั้งฐานข้อมูล — พิมพ์ค้นแล้ว
 * เหลือ 2 แผนก หัวข้อก็เหลือ 2 อัน ไม่ใช่ทุกแผนกที่มีอยู่จริง
 *
 * ลำดับหัวข้อ = ลำดับที่เจอครั้งแรกในผลลัพธ์ **ไม่ใช่เรียงตามตัวอักษร** เพราะ
 * ผลค้นหาส่วนใหญ่ถูกจัดอันดับความเกี่ยวข้องมาจากหลังบ้านแล้ว
 */
function GroupedDemo({ order }: { order?: string[] }) {
  const [value, setValue] = useState<Person[]>([]);
  const [options, setOptions] = useState<Person[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  return (
    <EntityAutocomplete<Person>
      multiple
      label="Care team"
      placeholder="Search by name or department..."
      value={value}
      onChange={setValue}
      options={options}
      optionsLoading={optionsLoading}
      groupBy={(p) => p.department}
      groupOrder={order}
      getOptionValue={(p) => p.id}
      getOptionLabel={(p) => p.name}
      onSearch={(query) => {
        setOptionsLoading(true);
        fakeSearch(query, (people) => {
          setOptions(people);
          setOptionsLoading(false);
        });
      }}
    />
  );
}

export const Grouped: Story = {
  render: () => <GroupedDemo />,
  parameters: {
    docs: {
      story: "เปิดช่องแล้วดูหัวข้อแผนก — ลำดับตามที่เจอในผลลัพธ์",
    },
  },
};

/** `groupOrder` — ล็อกลำดับหัวข้อเอง
 *
 * กลุ่มที่ไม่ได้อยู่ในลิสต์**ไม่ถูกทิ้ง** แต่ต่อท้ายตามลำดับที่เจอ —
 * ทิ้งไปแปลว่าตัวเลือกหายจากจอโดยไม่มีใครรู้
 */
export const GroupedWithFixedOrder: Story = {
  render: () => <GroupedDemo order={["Pediatrics", "Oncology"]} />,
};

/** `isOptionLocked` — ค่าตั้งต้นที่ถอดออกไม่ได้ (เฉพาะโหมดเลือกหลายอัน)
 *
 * ปิดทางถอดออกครบ **3 ทาง**: กดที่ chip · กดซ้ำในลิสต์ · ปุ่มล้างทั้งหมด
 * และบอกให้เห็นว่าทำไม — chip เปลี่ยนสี + ไอคอนกุญแจ
 *
 * ⚠️ **ไม่ได้ทำให้ถูกเลือกให้เอง** — ต้องใส่ใน `defaultValue`/`value` ด้วย
 * มันตอบว่า "ถอดออกได้ไหม" ไม่ใช่ "ต้องมีไหม"
 *
 * ⚠️ ไม่มีผลในโหมดเลือกอันเดียว — การเลือกทับคือการเปลี่ยนค่า ไม่ใช่การถอดออก
 * ล็อกไว้จะกลายเป็นช่องที่แก้ไม่ได้เลย ใช้ `disabled` แทน
 */
function LockedDemo() {
  const lockedIds = new Set(["1"]); // Alicia = คนประจำที่ระบบผูกมาให้
  const [value, setValue] = useState<Person[]>(() => directory.slice(0, 2));
  const [options, setOptions] = useState<Person[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  return (
    <EntityAutocomplete<Person>
      multiple
      label="ทีมที่ดูแล"
      hint="คนประจำถูกล็อกไว้ ถอดออกไม่ได้"
      placeholder="ค้นชื่อหรือแผนก..."
      value={value}
      onChange={setValue}
      options={options}
      optionsLoading={optionsLoading}
      isOptionLocked={(p) => lockedIds.has(p.id)}
      getOptionValue={(p) => p.id}
      getOptionLabel={(p) => p.name}
      getOptionDescription={(p) => p.department}
      onSearch={(query) => {
        setOptionsLoading(true);
        fakeSearch(query, (people) => {
          setOptions(people);
          setOptionsLoading(false);
        });
      }}
    />
  );
}

export const LockedSelection: Story = {
  render: () => <LockedDemo />,
};
