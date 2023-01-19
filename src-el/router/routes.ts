export const routes = [
  {
    name: "Curd",
    path: "curd",
    children: [
      {
        name: "CurdIndex",
        path: "index",
        component: () => import("@el/views/curd/index"),
      },
    ],
  },
  {
    name: "CurdModal",
    path: "curd-modal",
    children: [
      {
        name: "CurdModalIndex",
        path: "index",
        component: () => import("@el/views/curd-modal/index"),
      },
    ],
  },
  {
    name: "CurdPage",
    path: "curd-page",
    children: [
      {
        name: "CurdPageIndex",
        path: "index",
        component: () => import("@el/views/curd-page/index"),
      },
    ],
  },
  {
    name: "Form",
    path: "form",
    children: [
      {
        name: "FormIndex",
        path: "index",
        component: () => import("@el/views/form/index"),
      },
    ],
  },
  {
    name: "FormSearch",
    path: "form-search",
    children: [
      {
        name: "FormSearchIndex",
        path: "index",
        component: () => import("@el/views/form-search/index"),
      },
    ],
  },
  {
    name: "Table",
    path: "table",
    children: [
      {
        name: "TableIndex",
        path: "index",
        component: () => import("@el/views/table/index"),
      },
    ],
  },
];
