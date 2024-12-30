import { isElementPlus } from "@/common/platform";

export const menus = [
  { title: "综述", name: "OverviewIndexMd" },
  { title: "request", name: "RequestIndex" },
  { title: "store", name: "StoreIndex" },
  { title: "config", name: "ConfigIndex" },
  {
    title: "hooks",
    name: "Hooks",
    children: [
      { title: "useEffect", name: "HooksEffectIndexMd" },
      { title: "其他hooks", name: "HooksChildrenIndexMd" },
      { title: "工具方法", name: "HooksUtilIndexMd" },
    ],
  },
  {
    title: "pro",
    name: "Pro",
    children: [
      {
        title: isElementPlus() ? "element-pro" : "antd-pro",
        name: "El",
        children: [
          { title: "Loading", name: "ElLoadingIndex" },
          { title: "Pagination", name: "ElPaginationIndex" },
          { title: "Tabs", name: "ElTabsIndex" },
          { title: "Menus", name: "ElMenusIndex" },
          { title: "Uploader", name: "ElUploaderIndex" },
          { title: "InputNumberRange", name: "ElDigitRangeIndex" },
          ...(isElementPlus()
            ? [
                { title: "Checkbox", name: "ElCheckboxIndex" },
                { title: "Modal", name: "ElModalIndex" },
                { title: "Radio", name: "ElRadioIndex" },
                { title: "Select", name: "ElSelectIndex" },
              ]
            : []),
        ],
      },
      {
        title: "pro",
        name: "Element",
        children: [
          { title: "Form", name: "ElementFormIndex" },
          { title: "SearchForm", name: "ElementFormSearchIndex" },
          { title: "Table", name: "ElementTableIndex" },
          { title: "Typography", name: "ElementTypographyIndex" },
          { title: "Show", name: "ElementShowIndex" },
          { title: "Operate", name: "ElementOperateIndex" },
          { title: "List", name: "ElementListIndex" },
          { title: "Desc", name: "ElementDescIndex" },
          { title: "Page", name: "ElementPageIndex" },
        ],
      },
      {
        title: "curd",
        name: "Curd",
        children: [
          { title: "Curd", name: "CurdCurdIndex" },
          { title: "CurdForm", name: "CurdFormIndex" },
          { title: "CurdModal", name: "CurdModalIndex" },
          { title: "CurdDesc", name: "CurdDescIndex" },
        ],
      },
    ],
  },
  { title: "media", name: "PreviewIndex" },
  { title: "chart", name: "ChartIndex" },
  {
    title: "map",
    name: "Map",
    children: [
      { title: "overview", name: "MapOverviewIndex" },
      { title: "overlay", name: "MapOverlayIndex" },
      { title: "overlay-group", name: "MapOverlayGroupIndex" },
      { title: "info-window", name: "MapInfoWindowIndex" },
      { title: "layer", name: "MapLayerIndex" },
      { title: "labels-layer", name: "MapLayerLabelsIndex" },
      { title: "layer-group", name: "MapLayerGroupIndex" },
      { title: "api", name: "MapApiIndex" },
    ],
  },
  { title: "css", name: "CssIndex" },
  {
    title: "curd",
    name: "CurdDemo",
    children: [
      { title: "curd-basic", name: "CurdDemoBasicIndex" },
      { title: "curd-module", name: "CurdDemoModalIndex" },
      {
        title: "curd-page",
        name: "CurdDemoPageIndex",
        children: [{ title: "curd-page-detail", name: "CurdDemoPageDetail", hide: true }],
      },
    ],
  },
  {
    title: "module",
    name: "Module",
    children: [{ title: "list", name: "QuotaList" }],
  },
  {
    title: "test",
    name: "TestIndex",
    children: [
      {
        title: "test",
        name: "TestDetail",
        hide: true,
      },
    ],
  },
];
