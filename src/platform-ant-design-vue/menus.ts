export const menus = [
  { title: "综述", name: "OverviewIndexMd" },
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
    title: "pro",
    name: "Pro",
    children: [
      {
        title: "@vue-start/antd-pro",
        name: "El",
        children: [
          { title: "Loading", name: "ElLoadingIndex" },
          { title: "Pagination", name: "ElPaginationIndex" },
          { title: "Tabs", name: "ElTabsIndex" },
          { title: "Menus", name: "ElMenusIndex" },
          { title: "Uploader", name: "ElUploaderIndex" },
        ],
      },
      {
        title: "@vue-start/pro",
        name: "Element",
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
];
