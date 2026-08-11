# ContactSupportDialog

กล่อง "ติดต่อฝ่ายสนับสนุน" — **ใช้เหมือนกันทั้ง 4 แอป** (portal-web · mediwork-bo · medimatch-bo · hr-web)

```tsx
const [open, setOpen] = useState(false);
const { t } = useTranslation("common");

<Sidebar
  supportAction={{
    label: t("support_button.contact_support"),
    icon: <Headphones />,
    onClick: () => setOpen(true),
  }}
  …
/>

<ContactSupportDialog
  open={open}
  onOpenChange={setOpen}
  logo={<img src="/icons/mediact-logo.svg" alt="MediAct" className="h-10 w-auto" />}
  labels={{
    title: t("contact_support_modal.title"),
    lineTitle: t("contact_support_modal.line_support.title"),
    lineDescription: t("contact_support_modal.line_support.description"),
    phoneTitle: t("contact_support_modal.phone_support.title"),
    phoneDescription: t("contact_support_modal.phone_support.description"),
  }}
/>;
```

## ทำไมถึงอยู่ใน DS

ก่อนหน้านี้ทั้ง 4 แอปมีไฟล์ `ContactSupportModal.tsx` ของตัวเอง เนื้อหาเหมือนกันเกือบทุกบรรทัด
รวมถึง **LINE URL กับเบอร์โทรที่คัดลอกไว้ 4 ที่** ⇒ วันที่ช่องทางติดต่อเปลี่ยน ต้องไล่แก้ 4 รีโป
และถ้าลืมที่ใดที่หนึ่ง ผู้ใช้คนเดียวกันจะเห็นเบอร์ไม่ตรงกันระหว่างแอปแล้วไม่รู้ว่าอันไหนของจริง

ค่าเริ่มต้นจึงอยู่ที่นี่ที่เดียว (`MEDIACT_LINE_URL` · `MEDIACT_LINE_HANDLE` · `MEDIACT_SUPPORT_PHONE`)
— export ออกไปด้วย เผื่อจอไหนอยากอ้างเลขเดียวกันโดยไม่เปิดกล่อง

## สิ่งที่ DS **ไม่** ถือ

| | เหตุผล |
|---|---|
| **คำแปล** (`labels`) | แต่ละแอปมี i18n ของตัวเองและคีย์คนละชุด · DS ไม่มีชั้น i18n |
| **โลโก้** (`logo`) | DS ไม่มีสายพานสำหรับไฟล์ภาพ — ผู้เรียกส่ง `<img>` ที่ชี้ไป public ของตัวเองเข้ามา |

## ทรง

หัวกล่อง **จัดกึ่งกลาง ไม่มีเส้นคั่น** ต่างจากหน้าต่างฟอร์มทั่วไปที่หัวชิดซ้าย มีป้ายไอคอนและเส้นคั่น
— จงใจ เพราะกล่องนี้พูดในนามบริษัท ไม่ใช่ส่วนหนึ่งของงานในจอ และผู้ใช้คนเดียวกันเปิดหลายแอป
จึงต้องจำหน้าตา "ที่ขอความช่วยเหลือ" ได้ทันทีโดยไม่ต้องอ่าน

## สีที่เป็น hex ดิบโดยตั้งใจ 2 จุด

- `#06C755` / `#05b34e` — เขียวแบรนด์ของ **LINE** เป็นบริการภายนอก token แทนไม่ได้
- `text-teal-500` — เขียวน้ำทะเลของ **โลโก้ MediAct** ไม่ใช่สีแบรนด์ของแอป · ถ้าให้ตามธีม
  เบอร์จะเป็นครามใน MediHR แต่เขียวมิ้นต์ใน Mediwork ทั้งที่เป็นเบอร์เดียวกัน
