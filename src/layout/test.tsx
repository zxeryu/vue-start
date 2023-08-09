import { defineComponent } from "vue";
import { ProCheng, ProOperator, Overview } from "@vue-start/cheng";
import { map } from "lodash";
import { css } from "@emotion/css";

const LayoutElements = [
  { name: "HighPageContainer", children: true },
  { name: "HighCard", children: true },
  { name: "HighCardTabPane", children: true },
  { name: "HighCardDivider" },
  { name: "HighWaterMark" },
];

const FormElements = [
  { name: "HighForm", children: true },
  { name: "HighModalForm", children: true },
  { name: "HighDrawerForm", children: true },
  { name: "HighSearchForm", children: true },
  { name: "HighFormList", children: true },
  { name: "HighFormGroup", children: true },
  { name: "HighFormItem", children: true },
  { name: "HighFormText" },
  { name: "HighFormTextArea" },
  { name: "HighFormPassword" },
  { name: "HighFormCaptcha" },
  { name: "HighFormDigit" },
  { name: "HighFormDatePicker" },
  { name: "HighFormDateRangePicker" },
  { name: "HighFormTimePicker" },
  { name: "HighFormTimeRangePicker" },
  { name: "HighFormDateTimePicker" },
  { name: "HighFormDateTimeRangePicker" },
  {
    name: "HighFormSelect",
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
  { name: "HighFormCheckbox" },
  { name: "HighFormCheckboxGroup" },
  { name: "HighFormRadioGroup" },
  { name: "HighFormSwitch" },
  { name: "HighFormRate" },
  { name: "HighFormSlider" },
  { name: "HighFormMoney" },
];

const TableElements = [
  { name: "HighTable" },
  { name: "HighEditTable" },
  { name: "HighFormEditTableItem" },
  { name: "HighTableDropdown" },
];

const elements = [
  ...map(LayoutElements, (item) => ({ ...item, group: "Layout" })),
  ...map(FormElements, (item) => ({ ...item, group: "Form" })),
  ...map(TableElements, (item) => ({ ...item, group: "Table" })),
];

export const Test = defineComponent(() => {
  return () => {
    return (
      <ProCheng elements={elements}>
        <Overview
          class={css({
            position: "fixed",
            top: 0,
            right: 0,
            zIndex: 99,
            padding: 20,
            background: "rgba(0,0,0,0.2)",
            width: "20vw",
          })}
        />
        <ProOperator
          class={css({
            position: "fixed",
            top: 80,
            right: 0,
            zIndex: 99,
            padding: 20,
            background: "rgba(0,0,0,0.2)",
            width: "20vw",
          })}
        />
      </ProCheng>
    );
  };
});
