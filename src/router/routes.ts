export const routes = [
  {
    name: "About",
    path: "about",
    component: () => import("@/views/About.vue"),
  },
  { name: "Comp", path: "comp", component: () => import("@/views/Comp") },
  {
    name: "Compelement",
    path: "compelement",
    component: () => import("@/views/CompElement"),
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
    component: () => import("@/views/Hooks.vue"),
  },
  {
    name: "Network",
    path: "network",
    component: () => import("@/views/Network.vue"),
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
    name: "Route",
    path: "route",
    children: [
      {
        name: "RouteIndex",
        path: "index",
        component: () => import("@/views/route/index"),
      },
    ],
  },
  {
    name: "Server",
    path: "server",
    children: [
      {
        name: "ServerIndex",
        path: "index",
        component: () => import("@/views/server/index"),
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
];
