import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/counter",
    name: "Counter",
    component: () => import("../views/Counter.vue"),
  },
  {
    path: "/network",
    name: "Network",
    component: () => import("../views/Network.vue"),
  },
  {
    path: "/hooks",
    name: "Hooks",
    component: () => import("../views/Hooks.vue"),
  },
  {
    path: "/comp",
    name: "Comp",
    component: () => import("../views/Comp"),
  },
  {
    path: "/comp-el",
    name: "CompElement",
    component: () => import("../views/CompElement"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
