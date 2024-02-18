export const routes = [
  { name: "Comp", path: "comp", component: () => import("@/views/Comp") },
  {
    name: "Compelement",
    path: "compelement",
    component: () => import("@/views/CompElement"),
  },
  {
    name: "Chart",
    path: "chart",
    children: [
      {
        name: "ChartIndex",
        path: "index",
        component: () => import("@/views/chart/index"),
      },
    ],
  },
  {
    name: "Config",
    path: "config",
    children: [
      {
        name: "ConfigIndex",
        path: "index",
        component: () => import("@/views/config/index"),
      },
    ],
  },
  {
    name: "Css",
    path: "css",
    children: [
      {
        name: "CssIndex",
        path: "index",
        component: () => import("@/views/css/index"),
      },
    ],
  },
  {
    name: "Curd",
    path: "curd",
    children: [
      {
        name: "CurdCurd",
        path: "curd",
        children: [
          {
            name: "CurdCurdIndex",
            path: "index",
            component: () => import("@/views/curd/curd/index"),
          },
        ],
      },
      {
        name: "CurdDesc",
        path: "desc",
        children: [
          {
            name: "CurdDescIndex",
            path: "index",
            component: () => import("@/views/curd/desc/index"),
          },
        ],
      },
      {
        name: "CurdForm",
        path: "form",
        children: [
          {
            name: "CurdFormIndex",
            path: "index",
            component: () => import("@/views/curd/form/index"),
          },
        ],
      },
      {
        name: "CurdModal",
        path: "modal",
        children: [
          {
            name: "CurdModalIndex",
            path: "index",
            component: () => import("@/views/curd/modal/index"),
          },
        ],
      },
    ],
  },
  {
    name: "Devkit",
    path: "devkit",
    children: [
      {
        name: "DevkitClients",
        path: "clients",
        children: [
          {
            name: "DevkitClientsIndexMd",
            path: "index-md",
            component: () => import("@/views/devkit/clients/index-md"),
          },
        ],
      },
      {
        name: "DevkitRoute",
        path: "route",
        children: [
          {
            name: "DevkitRouteIndexMd",
            path: "index-md",
            component: () => import("@/views/devkit/route/index-md"),
          },
        ],
      },
    ],
  },
  {
    name: "El",
    path: "el",
    children: [
      {
        name: "ElCheckbox",
        path: "checkbox",
        children: [
          {
            name: "ElCheckboxIndex",
            path: "index",
            component: () => import("@/views/el/checkbox/index"),
          },
        ],
      },
      {
        name: "ElDigitRange",
        path: "digit-range",
        children: [
          {
            name: "ElDigitRangeIndex",
            path: "index",
            component: () => import("@/views/el/digit-range/index"),
          },
        ],
      },
      {
        name: "ElLoading",
        path: "loading",
        children: [
          {
            name: "ElLoadingIndex",
            path: "index",
            component: () => import("@/views/el/loading/index"),
          },
        ],
      },
      {
        name: "ElMenus",
        path: "menus",
        children: [
          {
            name: "ElMenusIndex",
            path: "index",
            component: () => import("@/views/el/menus/index"),
          },
        ],
      },
      {
        name: "ElModal",
        path: "modal",
        children: [
          {
            name: "ElModalIndex",
            path: "index",
            component: () => import("@/views/el/modal/index"),
          },
        ],
      },
      {
        name: "ElPagination",
        path: "pagination",
        children: [
          {
            name: "ElPaginationIndex",
            path: "index",
            component: () => import("@/views/el/pagination/index"),
          },
        ],
      },
      {
        name: "ElRadio",
        path: "radio",
        children: [
          {
            name: "ElRadioIndex",
            path: "index",
            component: () => import("@/views/el/radio/index"),
          },
        ],
      },
      {
        name: "ElSelect",
        path: "select",
        children: [
          {
            name: "ElSelectIndex",
            path: "index",
            component: () => import("@/views/el/select/index"),
          },
        ],
      },
      {
        name: "ElTabs",
        path: "tabs",
        children: [
          {
            name: "ElTabsIndex",
            path: "index",
            component: () => import("@/views/el/tabs/index"),
          },
        ],
      },
      {
        name: "ElUploader",
        path: "uploader",
        children: [
          {
            name: "ElUploaderIndex",
            path: "index",
            component: () => import("@/views/el/uploader/index"),
          },
        ],
      },
    ],
  },
  {
    name: "Element",
    path: "element",
    children: [
      {
        name: "ElementDesc",
        path: "desc",
        children: [
          {
            name: "ElementDescIndex",
            path: "index",
            component: () => import("@/views/element/desc/index"),
          },
        ],
      },
      {
        name: "ElementForm",
        path: "form",
        children: [
          {
            name: "ElementFormIndex",
            path: "index",
            component: () => import("@/views/element/form/index"),
          },
        ],
      },
      {
        name: "ElementFormSearch",
        path: "form-search",
        children: [
          {
            name: "ElementFormSearchIndex",
            path: "index",
            component: () => import("@/views/element/form-search/index"),
          },
        ],
      },
      {
        name: "ElementList",
        path: "list",
        children: [
          {
            name: "ElementListIndex",
            path: "index",
            component: () => import("@/views/element/list/index"),
          },
        ],
      },
      {
        name: "ElementOperate",
        path: "operate",
        children: [
          {
            name: "ElementOperateIndex",
            path: "index",
            component: () => import("@/views/element/operate/index"),
          },
        ],
      },
      {
        name: "ElementPage",
        path: "page",
        children: [
          {
            name: "ElementPageIndex",
            path: "index",
            component: () => import("@/views/element/page/index"),
          },
        ],
      },
      {
        name: "ElementShow",
        path: "show",
        children: [
          {
            name: "ElementShowIndex",
            path: "index",
            component: () => import("@/views/element/show/index"),
          },
        ],
      },
      {
        name: "ElementTable",
        path: "table",
        children: [
          {
            name: "ElementTableIndex",
            path: "index",
            component: () => import("@/views/element/table/index"),
          },
        ],
      },
      {
        name: "ElementTypography",
        path: "typography",
        children: [
          {
            name: "ElementTypographyIndex",
            path: "index",
            component: () => import("@/views/element/typography/index"),
          },
        ],
      },
    ],
  },
  {
    name: "Hooks",
    path: "hooks",
    children: [
      {
        name: "HooksChildren",
        path: "children",
        children: [
          {
            name: "HooksChildrenIndexMd",
            path: "index-md",
            component: () => import("@/views/hooks/children/index-md"),
          },
        ],
      },
      {
        name: "HooksEffect",
        path: "effect",
        children: [
          {
            name: "HooksEffectIndexMd",
            path: "index-md",
            component: () => import("@/views/hooks/effect/index-md"),
          },
        ],
      },
      {
        name: "HooksUtil",
        path: "util",
        children: [
          {
            name: "HooksUtilIndexMd",
            path: "index-md",
            component: () => import("@/views/hooks/util/index-md"),
          },
        ],
      },
    ],
  },
  {
    name: "Map",
    path: "map",
    children: [
      {
        name: "MapApi",
        path: "api",
        children: [
          {
            name: "MapApiIndex",
            path: "index",
            component: () => import("@/views/map/api/index"),
          },
        ],
      },
      {
        name: "MapInfoWindow",
        path: "info-window",
        children: [
          {
            name: "MapInfoWindowIndex",
            path: "index",
            component: () => import("@/views/map/info-window/index"),
          },
        ],
      },
      {
        name: "MapLayer",
        path: "layer",
        children: [
          {
            name: "MapLayerIndex",
            path: "index",
            component: () => import("@/views/map/layer/index"),
          },
        ],
      },
      {
        name: "MapLayerGroup",
        path: "layer-group",
        children: [
          {
            name: "MapLayerGroupIndex",
            path: "index",
            component: () => import("@/views/map/layer-group/index"),
          },
        ],
      },
      {
        name: "MapLayerLabels",
        path: "layer-labels",
        children: [
          {
            name: "MapLayerLabelsIndex",
            path: "index",
            component: () => import("@/views/map/layer-labels/index"),
          },
        ],
      },
      {
        name: "MapOverlay",
        path: "overlay",
        children: [
          {
            name: "MapOverlayIndex",
            path: "index",
            component: () => import("@/views/map/overlay/index"),
          },
        ],
      },
      {
        name: "MapOverlayGroup",
        path: "overlay-group",
        children: [
          {
            name: "MapOverlayGroupIndex",
            path: "index",
            component: () => import("@/views/map/overlay-group/index"),
          },
        ],
      },
      {
        name: "MapOverview",
        path: "overview",
        children: [
          {
            name: "MapOverviewIndex",
            path: "index",
            component: () => import("@/views/map/overview/index"),
          },
        ],
      },
    ],
  },
  {
    name: "Overview",
    path: "overview",
    children: [
      {
        name: "OverviewIndexMd",
        path: "index-md",
        component: () => import("@/views/overview/index-md"),
      },
    ],
  },
  {
    name: "Preview",
    path: "preview",
    children: [
      {
        name: "PreviewIndex",
        path: "index",
        component: () => import("@/views/preview/index"),
      },
    ],
  },
  {
    name: "Request",
    path: "request",
    children: [
      {
        name: "RequestIndex",
        path: "index",
        component: () => import("@/views/request/index"),
      },
    ],
  },
  {
    name: "Server",
    path: "server",
    children: [
      {
        name: "ServerIndexMd",
        path: "index-md",
        component: () => import("@/views/server/index-md"),
      },
    ],
  },
  {
    name: "Store",
    path: "store",
    children: [
      {
        name: "StoreIndex",
        path: "index",
        component: () => import("@/views/store/index"),
      },
    ],
  },
  {
    name: "Test",
    path: "test",
    children: [
      {
        name: "TestDetail",
        path: "detail",
        props: { id: "123" },
        component: () => import("@/views/test/Detail"),
      },
      {
        name: "TestIndex",
        path: "index",
        meta: { aaa: 111, bbb: "222" },
        component: () => import("@/views/test/index"),
      },
    ],
  },
];
