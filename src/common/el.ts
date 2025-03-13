import { IElement, ISetPropGroup, ISetPropItem } from "../../@vue-start/cheng/src/types";

const createSwitch = (name: string) => ({ name, elementType: "switch" });
const createText = (name: string, extra?: Record<string, any>) => ({ name, elementType: "text", ...extra });
const createDigit = (name: string, extra?: Record<string, any>) => ({ name, elementType: "digit", ...extra });
const createSelect = (name: string, extra?: Record<string, any>) => ({ name, elementType: "select", ...extra });

const multiple = createSwitch("multiple");
const readonly = createSwitch("readonly");
const disabled = createSwitch("disabled");
const clearable = createSwitch("clearable");
const closable = createSwitch("closable");
const filterable = createSwitch("filterable");
const teleported = createSwitch("teleported");
const appendToBody = createSwitch("appendToBody");
const closeOnClickModal = createSwitch("closeOnClickModal"); //点击modal关闭弹层
const closeOnPressEscape = createSwitch("closeOnPressEscape"); //点击esc按钮关闭弹层
const destroyOnClose = createSwitch("destroyOnClose"); //控制是否在关闭弹层之后将子元素全部销毁

const label = createText("label");
const value = createText("value");
const children = createText("children");

const placeholder = createText("placeholder");
const format = createText("format");
const valueFormat = createText("valueFormat");

const options: ISetPropGroup = {
  groupType: "array",
  name: "options",
  setProps: [value, label],
};

const size: ISetPropItem = createSelect("size", { options: ["large", "default", "small"] });

const placement: ISetPropItem = createSelect("placement", {
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
});

/************************** 元素 ********************************/
//button
const Button: IElement = {
  name: "Button",
  elementType: "Button",
  setProps: [
    createSelect("type", { options: ["primary", "success", "warning", "danger", "info"] }),
    size,
    createSwitch("plain"),
    createSwitch("text"),
    createSwitch("bg"),
    createSwitch("link"),
    createSwitch("round"),
    createSwitch("circle"),
    createSwitch("loading"),
    disabled,
    createText("color"),
  ],
};

const operateItems: ISetPropGroup = {
  groupType: "array",
  name: "items",
  setProps: [
    createText("value"),
    createText("label"),
    createSwitch("show"),
    disabled,
    createDigit("sort"),
    createText("per"),
    createText("perSuffix"),
  ],
};

//operate
const Operate: IElement = {
  name: "Operate",
  elementType: "Operate",
  setProps: [operateItems],
};

//typography
const Typography: IElement = {
  name: "Typography",
  elementType: "Typography",
  setProps: [createText("content"), createSwitch("ellipsis")],
};

//pagination
const Pagination: IElement = {
  name: "Pagination",
  elementType: "Pagination",
  setProps: [
    size,
    disabled,
    teleported,
    createSwitch("hideOnSinglePage"),
    createSwitch("background"),
    createDigit("pageSize"),
    createDigit("defaultPageSize"),
    createDigit("total"),
    createDigit("pageCount"),
    createDigit("pagerCount"),
    createDigit("defaultCurrentPage"),
    createText("layout"),
    createText("popperClass"),
    createText("prevText"),
    createText("prevIcon"),
    createText("nextText"),
    createText("nextIcon"),
  ],
};

//tabs
const Tabs: IElement = {
  name: "Tabs",
  elementType: "Tabs",
  setProps: [
    { ...options, setProps: [...options.setProps, disabled, closable, createSwitch("lazy")] },
    createSelect("type", { options: ["card", "border-card"] }),
    createSwitch("stretch"),
    closable,
    createSwitch("addable"),
    createSwitch("editable"),
    createSelect("tabPosition", { options: ["top", "left", "right", "bottom"] }),
  ],
};

//tags wait

//tree
const Tree: IElement = {
  name: "Tree",
  elementType: "Tree",
  setProps: [
    { ...options, name: "treeData" },
    {
      groupType: "object",
      name: "fieldNames",
      setProps: [label, children],
    },
    createText("emptyText"),
    createText("nodeKey"),
    createSwitch("renderAfterExpand"),
    createSwitch("highlightCurrent"),
    createSwitch("defaultExpandAll"),
    createSwitch("expandOnClickNode"),
    createSwitch("checkOnClickNode"),
    createSwitch("autoExpandParent"),
    createSwitch("showCheckbox"),
    createSwitch("checkStrictly"),
    createSwitch("accordion"),
    createDigit("indent"),
    createSwitch("lazy"),
    createSwitch("draggable"),
  ],
};

//Statistic

//Avatar
//Badge
//Empty
//Image
//Progress
//Result
//Skeleton
//Divider
//Watermark

//Affix
//Anchor
//Backtop

//Carousel

export const Basics = [Button, Operate, Typography, Pagination, Tabs, Tree];

/************************** form input ********************************/
const Select: IElement = {
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
};

const TreeSelect: IElement = {
  name: "TreeSelect",
  elementType: "TreeSelect$",
  setProps: [...Select.setProps, ...Tree.setProps],
};

const Input: IElement = {
  name: "Input",
  elementType: "Text$",
  setProps: [
    createSelect("type", { options: ["text", "textarea"] }),
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
    createSelect("resize", { options: ["none", "both", "horizontal", "vertical"] }),
  ],
};

const Digit: IElement = {
  name: "Digit",
  elementType: "Digit",
  setProps: [
    createDigit("min"),
    createDigit("max"),
    createDigit("step"),
    createSwitch("stepStrictly"),
    createDigit("precision"),
    size,
    readonly,
    disabled,
    createSwitch("controls"),
    createSelect("controlsPosition", { options: ["right"] }),
    createSelect("valueOnClear", { options: ["min", "max"] }),
  ],
};

const DigitRange: IElement = {
  name: "DigitRange",
  elementType: "DigitRange",
  setProps: [
    createSwitch("singleEmit"),
    { groupType: "object", name: "start", setProps: Digit.setProps } as ISetPropGroup,
    { groupType: "object", name: "end", setProps: Digit.setProps } as ISetPropGroup,
  ],
};

const RadioGroup: IElement = {
  name: "RadioGroup",
  elementType: "Radio$",
  setProps: [
    options,
    createSelect("optionType", { options: ["default", "button"] }),
    size,
    disabled,
    createText("textColor"),
    createText("fill"),
  ],
};

const CheckboxGroup: IElement = {
  name: "CheckboxGroup",
  elementType: "CheckboxGroup",
  setProps: [
    options,
    createDigit("min"),
    createDigit("max"),
    size,
    disabled,
    createText("textColor"),
    createText("fill"),
    createText("tag"),
  ],
};

const Cascader: IElement = {
  name: "Cascader",
  elementType: "Cascader",
  setProps: [
    options,
    {
      groupType: "object",
      name: "props",
      setProps: [
        multiple,
        createSwitch("checkStrictly"),
        createSwitch("emitPath"),
        createSwitch("lazy"),
        value,
        label,
        children,
        createText("disabled"),
        createText("leaf"),
        createSelect("expandTrigger", { options: ["click", "hover"] }),
        createDigit("hoverThreshold"),
      ],
    } as ISetPropGroup,
    size,
    placeholder,
    disabled,
    clearable,
    createSwitch("showAllLevels"),
    createSwitch("collapseTags"),
    createDigit("maxCollapseTags"),
    createSwitch("collapseTagsTooltip"),
    createText("separator"),
    filterable,
    createDigit("debounce"),
    teleported,
    createSelect("tagType", { options: ["success", "info", "warning", "danger"] }),
  ],
};

const DatePicker: IElement = {
  name: "DatePicker",
  elementType: "DatePicker",
  setProps: [
    createSelect("type", {
      options: [
        "year",
        // "years",
        "month",
        "date",
        // "dates",
        "datetime",
        "week",
        "datetimerange",
        "daterange",
        "monthrange",
      ],
    }),
    format,
    valueFormat,
    createText("rangeSeparator"),
    readonly,
    disabled,
    size,
    createSwitch("editable"),
    clearable,
    placeholder,
    createText("startPlaceholder"),
    createText("endPlaceholder"),
    createSwitch("unlinkPanels"),
    createText("prefixIcon"),
    createText("clearIcon"),
    teleported,
  ],
};

const DateTimePicker: IElement = {
  name: "DateTimePicker",
  elementType: "DateTimePicker",
  setProps: DatePicker.setProps,
};

const Rate: IElement = {
  name: "Rate",
  elementType: "Rate",
  setProps: [
    createDigit("max"),
    size,
    disabled,
    createSwitch("allowHalf"),
    createDigit("lowThreshold"),
    createDigit("highThreshold"),
  ],
};

const Slider: IElement = {
  name: "Slider",
  elementType: "Slider",
  setProps: [
    createDigit("min"),
    createDigit("max"),
    disabled,
    size,
    createDigit("step"),
    createSwitch("showInput"),
    createDigit("inputSize"),
    createSwitch("showInputControls"),
    createSwitch("showStops"),
    createSwitch("showTooltip"),
    placement,
    createSwitch("range"),
    createSwitch("vertical"),
    createText("height"),
  ],
};

const TimePicker: IElement = {
  name: "TimePicker",
  elementType: "TimePicker",
  setProps: [
    readonly,
    disabled,
    createSwitch("editable"),
    clearable,
    size,
    placeholder,
    createText("startPlaceholder"),
    createText("endPlaceholder"),
    createSwitch("isRange"),
    createSwitch("arrowControl"),
    createText("rangeSeparator"),
    format,
    valueFormat,
  ],
};

const TimeSelect: IElement = {
  name: "TimeSelect",
  elementType: "TimeSelect",
  setProps: [
    disabled,
    createSwitch("editable"),
    clearable,
    size,
    placeholder,
    createText("effect"),
    createText("start"),
    createText("end"),
  ],
};

const Transfer: IElement = {
  name: "Transfer",
  elementType: "Transfer",
  setProps: [filterable, createText("filterPlaceholder")],
};

//Uploader
const Uploader: IElement = {
  name: "Uploader",
  elementType: "Uploader",
  setProps: [
    createText("action"),
    createText("method"),
    createText("multiple"),
    createText("name"),
    createSwitch("withCredentials"),
    createSwitch("showFileList"),
    createSwitch("drag"),
    createText("accept"),
    createText("listType"),
    disabled,
    createDigit("limit"),
    createDigit("maxSize"),
  ],
};

export const FormInputs: IElement[] = [
  Select,
  Input,
  Digit,
  DigitRange,
  RadioGroup,
  CheckboxGroup,
  Cascader,
  DatePicker,
  DateTimePicker,
  TimePicker,
  TimeSelect,
  Rate,
  Slider,
  Transfer,
  TreeSelect,
  Uploader,
];

/************************** 弹出层 ********************************/
//
const Modal: IElement = {
  name: "Modal",
  elementType: "Modal",
  setProps: [
    createSwitch("visible"),
    createText("cancelText"),
    { groupType: "object", name: "cancelButtonProps", setProps: Button.setProps },
    createText("okText"),
    { groupType: "object", name: "okButtonProps", setProps: Button.setProps },
    createSwitch("footer"),
    createSwitch("maskClosable"),
  ],
};

const Tooltip: IElement = {
  name: "Tooltip",
  elementType: "Tooltip",
  setProps: [
    createText("trigger"),
    createText("effect"),
    createText("content"),
    placement,
    disabled,
    createDigit("offset"),
    createText("transition"),
    createSwitch("showArrow"),
    createSwitch("showAfter"),
    createSwitch("hideAfter"),
    createDigit("autoClose"),
    createSwitch("persistent"),
  ],
};

//popover

const Popover: IElement = {
  name: "Popover",
  elementType: "Popover",
  setProps: [createText("width"), createText("title"), ...Tooltip.setProps],
};

//Alert
//Drawer

const Drawer: IElement = {
  name: "Drawer",
  elementType: "Drawer",
  setProps: [
    appendToBody,
    createSwitch("lockScroll"),
    closeOnClickModal,
    closeOnPressEscape,
    createDigit("openDelay"),
    createDigit("closeDelay"),
    destroyOnClose,
    createSwitch("modal"),
    createSelect("direction", { options: ["ltr", "rtl", "ttb", "btt"] }),
    createSwitch("showClose"),
    createText("size"),
    createText("title"),
    createDigit("zIndex"),
  ],
};

//loading
const Loading: IElement = {
  name: "Loading",
  elementType: "Loading",
  setProps: [
    createSwitch("loading"),
    createSwitch("fullscreen"),
    createSwitch("lock"),
    createSwitch("body"),
    createSwitch("custom"),
    createText("text"),
    createText("spinner"),
    createText("background"),
  ],
};

//Popconfirm

export const Feedbacks = [Modal, Tooltip, Popover, Drawer, Loading];

/************************** pro（复合组件） ********************************/
const formProps = [
  createSwitch("inline"),
  createSelect("labelPosition", { options: ["left", "right", "top"] }),
  createText("labelWidth"),
  createText("labelSuffix"),
  createText("hideRequiredAsterisk"),
  createSelect("requireAsteriskPosition", { options: ["left", "right"] }),
  createSwitch("showMessage"),
  createSwitch("inlineMessage"),
  createSwitch("statusIcon"),
  createSwitch("validateOnRuleChange"),
  size,
  disabled,
  createSwitch("scrollToError"),
];

const proFormProps = [readonly];

const Form: IElement = {
  name: "Form",
  elementType: "Form",
  setProps: [
    //el
    ...formProps,
    //pro
  ],
};

//table
//desc
//curd

/************************** 布局 ********************************/
const Page: IElement = {
  name: "Page",
  elementType: "Page$",
  setProps: [
    //page-header
    createText("title"),
    createText("subTitle"),
    createSwitch("showBack"),
  ],
};

export const Layouts: IElement[] = [
  Page,
  { name: "div", elementType: "div", setProps: [] },
  { name: "p", elementType: "p", setProps: [] },
  { name: "span", elementType: "span", setProps: [] },
];
