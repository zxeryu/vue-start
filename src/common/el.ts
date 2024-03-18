import { IElement, ISetPropGroup, ISetPropItem } from "../../@vue-start/cheng/src/types";

const createSwitch = (name: string) => ({ name, elementType: "switch" });
const createText = (name: string, extra?: Record<string, any>) => ({ name, elementType: "text", ...extra });
const createDigit = (name: string, extra?: Record<string, any>) => ({ name, elementType: "digit", ...extra });

const multiple = createSwitch("multiple");
const disabled = createSwitch("disabled");
const clearable = createSwitch("clearable");

const placeholder = createText("placeholder");

const options: ISetPropGroup = {
  groupType: "array",
  name: "options",
  setProps: [
    { name: "value", elementType: "text" },
    { name: "label", elementType: "text" },
  ],
};

const size: ISetPropItem = {
  name: "size",
  elementType: "select",
  options: ["large", "default", "small"],
};

const placement: ISetPropItem = {
  name: "placement",
  elementType: "select",
  options: [
    "top",
    "top-start",
    "top-end",
    "bottom",
    "bottom-start",
    "bottom-end",
    "left",
    "left-start",
    "left-end",
    "right",
    "right-start",
    "right-end",
  ],
};

export const BaseElements: IElement[] = [
  {
    name: "Input",
    elementType: "Text$",
    setProps: [
      { name: "type", elementType: "select", options: ["text", "textarea"] },
      createDigit("maxlength"),
      createDigit("minlength"),
      createSwitch("showWordLimit"),
      placeholder,
      clearable,
      createSwitch("showPassword"),
      disabled,
      size,
      createDigit("rows"),
      createSwitch("autosize"),
      createSwitch("readonly"),
      { name: "resize", elementType: "select", options: ["none", "both", "horizontal", "vertical"] },
    ],
  },
  {
    name: "Select",
    elementType: "Select$",
    setProps: [
      multiple,
      disabled,
      options,
      size,
      clearable,
      createSwitch("collapseTags"),
      createSwitch("collapseTagsTooltip"),
      createDigit("multipleLimit"),
      placeholder,
      createSwitch("filterable"),
      createText("loadingText"),
      createText("noMatchText"),
      placement,
      createDigit("maxCollapseTags"),
    ],
  },
  {
    name: "RadioGroup",
    elementType: "Radio$",
    setProps: [
      options,
      { name: "optionType", elementType: "select", options: ["default", "button"] },
      size,
      disabled,
      createText("textColor"),
      createText("fill"),
    ],
  },
];
