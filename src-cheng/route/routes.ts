export const routes = [
  {
    name: "Home",
    path: "home",
    children: [
      {
        name: "HomeIndex",
        path: "index",
        component: () => import("@cheng/views/home/index"),
      },
    ],
  },
];
