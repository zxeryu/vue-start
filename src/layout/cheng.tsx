import { defineComponent } from "vue";
import { Overview, ProCheng } from "@vue-start/cheng";
import { useChengState } from "@/store/StoreCurrent";
import { BaseElements } from "../common/el";

const LayoutElements = [
  { name: "PageContainer", children: true },
  { name: "Card", children: true },
  { name: "CardTabPane", children: true },
  { name: "CardDivider" },
  { name: "WaterMark" },
];

const FormElements = [
  { name: "Form", children: true },
  { name: "ModalForm", children: true },
  { name: "DrawerForm", children: true },
  { name: "SearchForm", children: true },
  { name: "List", children: true },
  { name: "Group", children: true },
  { name: "Item", children: true },
  { name: "Text" },
  { name: "TextArea" },
  { name: "Password" },
  { name: "Captcha" },
  { name: "Digit" },
  { name: "DatePicker" },
  { name: "DateRangePicker" },
  { name: "TimePicker" },
  { name: "TimeRangePicker" },
  { name: "DateTimePicker" },
  { name: "DateTimeRangePicker" },
  {
    name: "Select",
    setProps: [
      { name: "name", elementType: "text" },
      { name: "label", elementType: "text" },
      { name: "placeholder", elementType: "text" },
      {
        name: "options",
        groupType: "array",
        setProps: [
          { name: "label", elementType: "text" },
          { name: "value", elementType: "text" },
        ],
      },
    ],
  },
  { name: "Checkbox" },
  { name: "CheckboxGroup" },
  { name: "RadioGroup" },
  { name: "Switch" },
  { name: "Rate" },
  { name: "Slider" },
  { name: "Money" },
];

const TableElements = [
  { name: "Table" },
  { name: "EditTable" },
  { name: "FormEditTableItem" },
  { name: "TableDropdown" },
];

const HtmlElements = [
  { name: "div" },
  { name: "p" },
  { name: "span" },
];

export const elements = [
  { title: "Layout" },
  ...LayoutElements,
  { title: "ElementPlus" },
  ...BaseElements,
  { title: "Form" },
  ...FormElements,
  { title: "Table" },
  ...TableElements,
  { title: "Html" },
  ...HtmlElements,
];

export const ChengOpe = defineComponent(() => {
  const [chengState, setChengState] = useChengState();

  return () => {
    return (
      <ProCheng
        show={chengState.show}
        groupElements={elements as any}
        onClose={() => {
          setChengState({ ...chengState, show: false });
        }}>
        <Overview />
      </ProCheng>
    );
  };
});
