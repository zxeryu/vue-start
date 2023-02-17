export const routes = [
  {
    name: "About",
    path: "about",
    component: () => import("@/views/About.vue"),
  },
  {
    name: "Column",
    path: "column",
    children: [
      {
        name: "ColumnIndexMd",
        path: "index-md",
        component: () => import("@/views/column/index-md"),
      },
    ],
  },
  { name: "Comp", path: "comp", component: () => import("@/views/Comp") },
  {
    name: "Compelement",
    path: "compelement",
    component: () => import("@/views/CompElement"),
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
    name: "Counter",
    path: "counter",
    component: () => import("@/views/Counter.vue"),
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
    name: "Element",
    path: "element",
    children: [
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
        name: "ElementGrid",
        path: "grid",
        children: [
          {
            name: "ElementGridIndex",
            path: "index",
            component: () => import("@/views/element/grid/index"),
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
    ],
  },
  { name: "Home", path: "home", component: () => import("@/views/Home.vue") },
  {
    name: "Hooks",
    path: "hooks",
    children: [
      {
        name: "HooksIndexMd",
        path: "index-md",
        component: () => import("@/views/hooks/index-md"),
      },
    ],
  },
  {
    name: "Network",
    path: "network",
    component: () => import("@/views/Network.vue"),
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
    name: "Request",
    path: "request",
    children: [
      {
        name: "RequestIndexMd",
        path: "index-md",
        component: () => import("@/views/request/index-md"),
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
        name: "StoreIndexMd",
        path: "index-md",
        component: () => import("@/views/store/index-md"),
      },
    ],
  },
];
