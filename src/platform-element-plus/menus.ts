export const menus = [
  { title: "综述", name: "OverviewIndexMd" },
  { title: "demo公共数据", name: "ColumnIndexMd" },
  { title: "@vue-start/request", name: "RequestIndex" },
  { title: "@vue-start/store", name: "StoreIndexMd" },
  { title: "@vue-start/config", name: "ConfigIndex" },
  {
    title: "@vue-start/hooks",
    name: "Hooks",
    children: [
      { title: "useEffect", name: "HooksEffectIndexMd" },
      { title: "其他hooks", name: "HooksChildrenIndexMd" },
      { title: "工具方法", name: "HooksUtilIndexMd" },
    ],
  },
  {
    title: "@vue-start/element-pro",
    children: [
      { title: "Checkbox", name: "ElCheckboxIndex" },
      { title: "Loading", name: "ElLoadingIndex" },
      { title: "Modal", name: "ElModalIndex" },
      { title: "Pagination", name: "ElPaginationIndex" },
      { title: "Radio", name: "ElRadioIndex" },
      { title: "Select", name: "ElSelectIndex" },
      { title: "Tabs", name: "ElTabsIndex" },
    ],
  },
  {
    title: "@vue-start/pro",
    children: [
      { title: "Form", name: "ElementFormIndex" },
      { title: "SearchForm", name: "ElementFormSearchIndex" },
      { title: "Table", name: "ElementTableIndex" },
      { title: "Operate", name: "ElementOperateIndex" },
      { title: "List", name: "ElementListIndex" },
      { title: "Desc", name: "ElementDescIndex" },
      { title: "Page", name: "ElementPageIndex" },
    ],
  },
  {
    title: "curd",
    children: [
      { title: "Curd", name: "CurdCurdIndex" },
      { title: "CurdForm", name: "CurdFormIndex" },
      { title: "CurdModal", name: "CurdModalIndex" },
      { title: "CurdDesc", name: "CurdDescIndex" },
    ],
  },
];
