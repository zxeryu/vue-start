export const routes = [
  {
    name: "Quota",
    path: "quota",
    children: [
      {
        name: "QuotaDetail",
        path: "detail",
        component: () => import("@/pro/module/quota/detail/index"),
      },
      {
        name: "QuotaList",
        path: "list",
        component: () => import("@/pro/module/quota/list/index"),
      },
    ],
  },
];
